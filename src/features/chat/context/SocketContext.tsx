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
  emitTyping: (conversationId: string, receiverId?: string) => void;
  emitStopTyping: (conversationId: string, receiverId?: string) => void;
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
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const token = accessToken || localStorage.getItem("jobbox_accessToken");

  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUsersMap, setTypingUsersMap] = useState<
    Record<string, Set<string>>
  >({});

  useEffect(() => {
    // Admins are not allowed to participate in chat; skip socket connection
    if (user?.role === "ADMIN") {
      return;
    }

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
      transports: ["polling", "websocket"],
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

    newSocket.on("online-users", (userIds: string[]) => {
      if (Array.isArray(userIds)) {
        setOnlineUserIds(new Set(userIds));
      }
    });

    newSocket.on("online_users", (userIds: string[]) => {
      if (Array.isArray(userIds)) {
        setOnlineUserIds(new Set(userIds));
      }
    });

    newSocket.on("user_online", ({ userId }: { userId: string }) => {
      if (userId) {
        setOnlineUserIds((prev) => new Set(prev).add(userId));
      }
    });

    newSocket.on("user_offline", ({ userId }: { userId: string }) => {
      if (userId) {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
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

    newSocket.on("receive_message", (_message: any) => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("receive-message", (_message: any) => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("message_read", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("message_delivered", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("message_edited", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    newSocket.on("message_deleted", () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user, dispatch]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("join_conversation", { conversationId });
        socket.emit("join-conversation", { conversationId });
      }
    },
    [socket, isConnected]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("leave_conversation", { conversationId });
        socket.emit("leave-conversation", { conversationId });
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
        socket.emit("send-message", data);
      }
    },
    [socket, isConnected]
  );

  const emitTyping = useCallback(
    (conversationId: string, receiverId?: string) => {
      if (socket && isConnected) {
        socket.emit("typing", { conversationId, receiverId });
      }
    },
    [socket, isConnected]
  );

  const emitStopTyping = useCallback(
    (conversationId: string, receiverId?: string) => {
      if (socket && isConnected) {
        socket.emit("stop_typing", { conversationId, receiverId });
        socket.emit("stop-typing", { conversationId, receiverId });
      }
    },
    [socket, isConnected]
  );

  const emitMarkRead = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("message_read", { conversationId });
        socket.emit("message-seen", { conversationId });
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
