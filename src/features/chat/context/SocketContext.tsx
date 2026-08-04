import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { chatApi } from "../api/chatApi";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: Set<string>;
  typingUsersMap: Record<string, Set<string>>; // conversationId -> Set of userIds
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  emitSendMessage: (data: {
    conversationId: string;
    message: string;
    messageType?: "text" | "image" | "file";
    attachments?: any[];
    replyTo?: string;
  }) => void;
  emitTyping: (conversationId: string) => void;
  emitStopTyping: (conversationId: string) => void;
  emitMarkRead: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUserIds: new Set(),
  typingUsersMap: {},
  joinConversation: () => {},
  leaveConversation: () => {},
  emitSendMessage: () => {},
  emitTyping: () => {},
  emitStopTyping: () => {},
  emitMarkRead: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const token = accessToken || localStorage.getItem("jobbox_accessToken");

  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUsersMap, setTypingUsersMap] = useState<
    Record<string, Set<string>>
  >({});

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const backendUrl =
      import.meta.env.VITE_BASE_URL || "http://localhost:5000";

    const newSocket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("⚡ Real-time chat socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Chat socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
      setIsConnected(false);
    });

    newSocket.on("user_online", ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });

    newSocket.on("user_offline", ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    newSocket.on(
      "typing",
      ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        setTypingUsersMap((prev) => {
          const currentSet = new Set(prev[conversationId] || []);
          currentSet.add(userId);
          return { ...prev, [conversationId]: currentSet };
        });
      }
    );

    newSocket.on(
      "stop_typing",
      ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        setTypingUsersMap((prev) => {
          const currentSet = new Set(prev[conversationId] || []);
          currentSet.delete(userId);
          return { ...prev, [conversationId]: currentSet };
        });
      }
    );

    newSocket.on("conversation_updated", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("receive_message", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("message_read", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, dispatch]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("join_conversation", { conversationId });
      }
    },
    [socket, isConnected]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("leave_conversation", { conversationId });
      }
    },
    [socket, isConnected]
  );

  const emitSendMessage = useCallback(
    (data: {
      conversationId: string;
      message: string;
      messageType?: "text" | "image" | "file";
      attachments?: any[];
      replyTo?: string;
    }) => {
      if (socket && isConnected) {
        socket.emit("send_message", data);
      }
    },
    [socket, isConnected]
  );

  const emitTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("typing", { conversationId });
      }
    },
    [socket, isConnected]
  );

  const emitStopTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("stop_typing", { conversationId });
      }
    },
    [socket, isConnected]
  );

  const emitMarkRead = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("message_read", { conversationId });
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUserIds,
        typingUsersMap,
        joinConversation,
        leaveConversation,
        emitSendMessage,
        emitTyping,
        emitStopTyping,
        emitMarkRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
