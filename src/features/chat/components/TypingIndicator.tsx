import React from "react";

interface TypingIndicatorProps {
  userName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userName = "Someone",
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500 italic animate-pulse">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{userName} is typing...</span>
    </div>
  );
};
