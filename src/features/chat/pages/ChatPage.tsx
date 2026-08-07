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

export const ChatPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetConvId = searchParams.get("conversationId");
  const targetJobId = searchParams.get("jobId");
  const targetApplicantId = searchParams.get("applicantId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);

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
      setActiveConversation(conv);
      setHasNavigatedBack(false);
    } catch (err) {
      console.error("Failed to start chat from modal:", err);
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
          setActiveConversation(conv);
          setHasNavigatedBack(false);
          // Clean up URL query params
          setSearchParams({}, { replace: true });
        })
        .catch((err) => {
          console.error("Failed to initialize conversation from params:", err);
        });
    }
  }, [targetJobId, targetApplicantId, createOrGetConversation, setSearchParams]);

  // Sync active conversation when conversations list updates or URL has conversationId
  useEffect(() => {
    if (targetConvId && conversations.length > 0) {
      const match = conversations.find(
        (c) => (c.id || c._id) === targetConvId
      );
      if (match) {
        setActiveConversation(match);
        setHasNavigatedBack(false);
      }
    } else if (
      !activeConversation &&
      !hasNavigatedBack &&
      conversations.length > 0 &&
      !targetJobId
    ) {
      // Auto-select 1st conversation on desktop ONLY on initial load if user hasn't explicitly navigated back
      if (window.innerWidth >= 1024) {
        setActiveConversation(conversations[0]);
      }
    }
  }, [targetConvId, conversations, activeConversation, targetJobId, hasNavigatedBack]);

  const handleSelectConversation = (conv: IConversation) => {
    setActiveConversation(conv);
    setHasNavigatedBack(false);
  };

  const handleBack = () => {
    setActiveConversation(null);
    setHasNavigatedBack(true);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[500px] w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
      {/* Requirement 1: Conversation List Width (Desktop 28-30%, Laptop 32%, Mobile full drawer/toggle) */}
      <div
        className={`w-full lg:w-[32%] xl:w-[28%] shrink-0 h-full ${
          activeConversation ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || activeConversation?._id}
          onSelectConversation={handleSelectConversation}
          onDeleteActiveConversation={handleBack}
          onlineUserIds={onlineUserIds}
          isLoading={isLoading}
          onOpenNewChatModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Requirement 1 & 12: Chat Window (Desktop 70-72%, Laptop 68%, Mobile full) & Empty State */}
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
          /* Requirement 12: Better Empty State */
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

