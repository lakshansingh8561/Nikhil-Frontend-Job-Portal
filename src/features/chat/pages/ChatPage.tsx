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
    <div className="flex h-[calc(100vh-130px)] w-full overflow-hidden rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
      {/* Sidebar - Conversation List */}
      <div
        className={`w-full lg:w-80 xl:w-96 shrink-0 h-full ${
          activeConversation ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || activeConversation?._id}
          onSelectConversation={handleSelectConversation}
          onlineUserIds={onlineUserIds}
          isLoading={isLoading}
          onOpenNewChatModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Main Panel - Active Chat Window */}
      <div
        className={`flex-1 h-full min-w-0 ${
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] font-bold text-3xl mb-3 shadow-2xs">
              💬
            </div>
            <h3 className="text-base font-extrabold text-[#05264E]">
              Select or Start a Conversation
            </h3>
            <p className="text-xs font-medium text-gray-500 max-w-sm mt-1 mb-4">
              Choose a message thread from the left menu or click below to start a new chat.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
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
