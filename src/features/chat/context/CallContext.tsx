import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  FiPhone,
  FiVideo,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiPhoneOff,
  FiX,
} from "react-icons/fi";
import { useSocket } from "./SocketContext";
import toast from "react-hot-toast";

interface IncomingCallData {
  conversationId: string;
  fromUserId: string;
  callType: "audio" | "video";
  callerName: string;
  callerAvatar?: string;
  sdpOffer: any;
}

interface ActiveCallSession {
  conversationId: string;
  targetUserId: string;
  targetName: string;
  targetAvatar?: string;
  callType: "audio" | "video";
  isCaller: boolean;
  status: "calling" | "connected";
}

interface CallContextType {
  incomingCall: IncomingCallData | null;
  activeCallSession: ActiveCallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (
    targetUserId: string,
    conversationId: string,
    callType: "audio" | "video",
    callerName: string,
    callerAvatar?: string
  ) => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => void;
  endCall: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocket();

  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [activeCallSession, setActiveCallSession] = useState<ActiveCallSession | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up streams & peer connection
  const cleanupCall = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCallDuration(0);

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIncomingCall(null);
    setActiveCallSession(null);
    setIsMuted(false);
    setIsVideoOff(false);
  }, [localStream, remoteStream]);

  // Handle Socket Events for Call Signaling
  useEffect(() => {
    if (!socket) return;

    // 1. Recipient receives an incoming call
    const handleIncomingCall = (data: IncomingCallData) => {
      console.log("📞 Incoming Call received:", data);
      setIncomingCall(data);
      toast.success(`Incoming ${data.callType} call from ${data.callerName}`, {
        duration: 8000,
        icon: "📞",
      });
    };

    // 2. Caller receives call accepted event from recipient
    const handleCallAccepted = async (data: {
      conversationId: string;
      recipientUserId: string;
      sdpAnswer: any;
    }) => {
      console.log("🟢 Call Accepted by recipient!");
      if (peerConnectionRef.current && data.sdpAnswer) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdpAnswer)
          );
          setActiveCallSession((prev) =>
            prev ? { ...prev, status: "connected" } : null
          );
          toast.success("Call Connected!");

          // Start call timer
          timerIntervalRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    };

    // 3. Caller receives call declined event
    const handleCallDeclined = (data: { reason?: string }) => {
      toast.error(data.reason || "Call was declined by recipient.");
      cleanupCall();
    };

    // 4. Either user receives call ended event
    const handleCallEnded = () => {
      toast("Call ended", { icon: "🔴" });
      cleanupCall();
    };

    // 5. ICE Candidate exchange
    const handleIceCandidate = async (data: { candidate: any }) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    };

    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);
    socket.on("call_declined", handleCallDeclined);
    socket.on("call_ended", handleCallEnded);
    socket.on("ice_candidate", handleIceCandidate);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_declined", handleCallDeclined);
      socket.off("call_ended", handleCallEnded);
      socket.off("ice_candidate", handleIceCandidate);
    };
  }, [socket, cleanupCall]);

  // Attach local media stream
  const getUserMediaStream = async (callType: "audio" | "video") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
      setLocalStream(stream);
      return stream;
    } catch (err: any) {
      console.warn("Could not access camera/microphone:", err?.message);
      // Fallback: Dummy stream for demo if no physical hardware permission
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1E293B";
        ctx.fillRect(0, 0, 640, 480);
      }
      const stream = canvas.captureStream(30);
      setLocalStream(stream);
      return stream;
    }
  };

  // Setup Peer Connection
  const createPeerConnection = (targetUserId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice_candidate", {
          targetUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // 📞 Start an Outgoing Call
  const startCall = async (
    targetUserId: string,
    conversationId: string,
    callType: "audio" | "video",
    callerName: string,
    callerAvatar?: string
  ) => {
    if (!socket) {
      toast.error("Socket connection not available.");
      return;
    }

    setActiveCallSession({
      conversationId,
      targetUserId,
      targetName: callerName,
      targetAvatar: callerAvatar,
      callType,
      isCaller: true,
      status: "calling",
    });

    const stream = await getUserMediaStream(callType);
    const pc = createPeerConnection(targetUserId);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call_user", {
      conversationId,
      targetUserId,
      callType,
      callerName,
      callerAvatar,
      sdpOffer: offer,
    });
  };

  // 🟢 Accept an Incoming Call
  const acceptCall = async () => {
    if (!incomingCall || !socket) return;

    const { conversationId, fromUserId, callType, callerName, callerAvatar, sdpOffer } =
      incomingCall;

    setActiveCallSession({
      conversationId,
      targetUserId: fromUserId,
      targetName: callerName,
      targetAvatar: callerAvatar,
      callType,
      isCaller: false,
      status: "connected",
    });

    const stream = await getUserMediaStream(callType);
    const pc = createPeerConnection(fromUserId);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(sdpOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("accept_call", {
      conversationId,
      callerUserId: fromUserId,
      sdpAnswer: answer,
    });

    setIncomingCall(null);
    toast.success("Call connected!");

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // 🔴 Decline an Incoming Call
  const declineCall = () => {
    if (incomingCall && socket) {
      socket.emit("decline_call", {
        conversationId: incomingCall.conversationId,
        callerUserId: incomingCall.fromUserId,
        reason: "Recipient declined call",
      });
    }
    cleanupCall();
  };

  // 🔴 End active Call
  const endCall = () => {
    if (activeCallSession && socket) {
      socket.emit("end_call", {
        conversationId: activeCallSession.conversationId,
        targetUserId: activeCallSession.targetUserId,
      });
    }
    cleanupCall();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        activeCallSession,
        localStream,
        remoteStream,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
      }}
    >
      {children}

      {/* ======================================================== */}
      {/* 🔔 GLOBAL INCOMING CALL POPUP MODAL (WhatsApp Style)      */}
      {/* ======================================================== */}
      {incomingCall && !activeCallSession && (
        <div className="fixed top-6 right-6 z-[99999] w-80 sm:w-96 rounded-3xl bg-[#0F172A] p-5 text-white shadow-2xl border border-indigo-500/40 animate-bounce transition-all">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {incomingCall.callerAvatar ? (
                <img
                  src={incomingCall.callerAvatar}
                  alt={incomingCall.callerName}
                  className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-white text-xl shadow-md border-2 border-indigo-400">
                  {incomingCall.callerName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0F172A] animate-ping" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider bg-indigo-500/20 px-2 py-0.5 rounded-md">
                {incomingCall.callType === "video" ? <FiVideo /> : <FiPhone />}
                Incoming {incomingCall.callType === "video" ? "Video" : "Voice"} Call
              </span>
              <h4 className="text-base font-black text-white truncate mt-1">
                {incomingCall.callerName}
              </h4>
              <p className="text-xs text-indigo-200 font-medium">Ringing...</p>
            </div>
          </div>

          {/* Action Buttons: Green Accept & Red Decline */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={declineCall}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-600/90 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer"
            >
              <FiX className="text-base" /> Decline
            </button>
            <button
              type="button"
              onClick={acceptCall}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer animate-pulse"
            >
              <FiPhone className="text-base" /> Accept & Join
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📹 ACTIVE CALL WINDOW OVERLAY MODAL                       */}
      {/* ======================================================== */}
      {activeCallSession && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] p-6 text-white shadow-2xl border border-slate-700 flex flex-col items-center justify-between min-h-[420px] overflow-hidden">
            {/* Call Header */}
            <div className="text-center w-full">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-extrabold text-indigo-300 border border-indigo-400/30 uppercase tracking-wider mb-4">
                {activeCallSession.callType === "video" ? <FiVideo /> : <FiPhone />}
                {activeCallSession.status === "connected"
                  ? `Connected • ${formatDuration(callDuration)}`
                  : "Calling & Ringing..."}
              </span>

              {/* Video Stream Preview or Avatar */}
              {activeCallSession.callType === "video" ? (
                <div className="relative w-full h-56 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden my-3 shadow-inner">
                  {/* Remote / Main Stream */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Local Thumbnail Stream */}
                  <div className="absolute bottom-3 right-3 h-20 w-28 rounded-xl bg-slate-800 border-2 border-indigo-500 overflow-hidden shadow-lg">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative mx-auto h-24 w-24 my-4">
                  {activeCallSession.targetAvatar ? (
                    <img
                      src={activeCallSession.targetAvatar}
                      alt={activeCallSession.targetName}
                      className="h-full w-full rounded-full object-cover border-4 border-indigo-500 shadow-xl"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-white text-3xl shadow-xl border-4 border-indigo-400">
                      {activeCallSession.targetName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-[#0F172A] animate-pulse" />
                </div>
              )}

              <h3 className="text-xl font-black text-white">{activeCallSession.targetName}</h3>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-5 mt-6">
              <button
                type="button"
                onClick={toggleMute}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                  isMuted
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FiMicOff className="text-xl" /> : <FiMic className="text-xl" />}
              </button>

              <button
                type="button"
                onClick={endCall}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="End Call"
              >
                <FiPhoneOff className="text-2xl" />
              </button>

              {activeCallSession.callType === "video" && (
                <button
                  type="button"
                  onClick={toggleVideo}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                    isVideoOff
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                  title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isVideoOff ? <FiVideoOff className="text-xl" /> : <FiVideo className="text-xl" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};
