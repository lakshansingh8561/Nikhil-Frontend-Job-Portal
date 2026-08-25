import React from "react";

/**
 * Shared surface tokens so every card in the network section lines up.
 * LinkedIn: white card, 8px radius, hairline border, no heavy shadow.
 */
export const CARD_CLASS =
  "bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
}

export const Card: React.FC<CardProps> = ({ children, className = "", as = "div" }) => {
  const Tag = as as any;
  return <Tag className={`${CARD_CLASS} ${className}`}>{children}</Tag>;
};

interface CardSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Adds the divider + "Show all" footer link LinkedIn uses on profiles. */
  footer?: React.ReactNode;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  action,
  children,
  className = "",
  footer,
}) => (
  <Card as="section" className={className}>
    <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
      <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">{title}</h2>
      {action}
    </div>
    <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">{children}</div>
    {footer && (
      <div className="border-t border-[rgba(0,0,0,0.08)]">{footer}</div>
    )}
  </Card>
);

export default Card;
