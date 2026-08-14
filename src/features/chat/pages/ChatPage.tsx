import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetUserConversationsQuery,
  useCreateOrGetConversationMutation,
} from "../api/chatApi";
import { useSocket } from "../context/SocketContext";
import type { IConversation } from "../types/chat.types";
import { ConversationList } from "../components/ConversationList";
import { ChatWindow } from "../components/ChatWindow";
import { NewChatModal } from "../components/NewChatModal";

import toast from "react-hot-toast";

export const ChatPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetConvId = searchParams.get("conversationId");
  const targetJobId = searchParams.get("jobId");
  const targetApplicantId = searchParams.get("applicantId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(targetConvId || null);

  const { onlineUserIds } = useSocket();
  const { data: conversations = [], isLoading } = useGetUserConversationsQuery();
  const [createOrGetConversation] = useCreateOrGetConversationMutation();

  const [activeConversation, setActiveConversation] =
    useState<IConversation | null>(null);

  const handleStartChatFromModal = async (payload: {
    jobId: string;
    applicantId?: string;
  }) => {
    try {
      const conv = await createOrGetConversation(payload).unwrap();
      const convId = conv ? (conv.id || conv._id) : null;
      if (conv && convId) {
        setSelectedConvId(convId);
        setActiveConversation(conv);
        setHasNavigatedBack(false);
      } else {
        toast.error("Unable to open conversation.");
      }
    } catch (err: any) {
      console.error("Failed to start chat from modal:", err);
      toast.error(err?.data?.message || "Failed to start chat. Please try again.");
    }
  };

  // If query params specify jobId & applicantId, attempt to create/get conversation automatically
  useEffect(() => {
    if (targetJobId) {
      createOrGetConversation({
        jobId: targetJobId,
        applicantId: targetApplicantId || undefined,
      })
        .unwrap()
        .then((conv) => {
          const convId = conv.id || conv._id;
          setSelectedConvId(convId);
          setActiveConversation(conv);
          setHasNavigatedBack(false);
          setSearchParams({}, { replace: true });
        })
        .catch((err) => {
          console.error("Failed to initialize conversation from params:", err);
        });
    }
  }, [targetJobId, targetApplicantId, createOrGetConversation, setSearchParams]);

  // Sync active conversation when conversations list updates
  useEffect(() => {
    if (conversations.length > 0) {
      if (selectedConvId) {
        const match = conversations.find((c) => (c.id || c._id) === selectedConvId);
        if (match) {
          setActiveConversation(match);
        }
      } else if (!activeConversation && !hasNavigatedBack && !targetJobId) {
        if (window.innerWidth >= 1024) {
          const first = conversations[0];
          const firstId = first?.id || first?._id;
          if (firstId) {
            setSelectedConvId(firstId);
            setActiveConversation(first);
          }
        }
      }
    }
  }, [conversations, selectedConvId, activeConversation, hasNavigatedBack, targetJobId]);

  const handleSelectConversation = (conv: IConversation) => {
    const convId = conv.id || conv._id;
    setSelectedConvId(convId);
    setActiveConversation(conv);
    setHasNavigatedBack(false);
  };

  const handleBack = () => {
    setSelectedConvId(null);
    setActiveConversation(null);
    setHasNavigatedBack(true);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[500px] w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
      {/* Conversation List Sidebar */}
      <div
        className={`w-full lg:w-[32%] xl:w-[28%] shrink-0 h-full ${
          activeConversation ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={selectedConvId || activeConversation?.id || activeConversation?._id}
          onSelectConversation={handleSelectConversation}
          onDeleteActiveConversation={handleBack}
          onlineUserIds={onlineUserIds}
          isLoading={isLoading}
          onOpenNewChatModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Main Chat Window */}
      <div
        className={`flex-1 h-full min-w-0 lg:w-[68%] xl:w-[72%] ${
          !activeConversation ? "hidden lg:flex" : "flex"
        }`}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            onBack={handleBack}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#F8FAFC] p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-[#4F46E5] font-bold text-4xl mb-4 shadow-2xs border border-indigo-100/60 animate-bounce" style={{ animationDuration: '3s' }}>
              💬
            </div>
            <h3 className="text-xl font-extrabold text-[#05264E] tracking-tight">
              Select a conversation
            </h3>
            <p className="text-sm font-medium text-gray-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
              Choose a conversation from the left to start chatting.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#4338CA] hover:scale-[1.03] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleStartChatFromModal}
      />
    </div>
  );
};

export default ChatPage;
