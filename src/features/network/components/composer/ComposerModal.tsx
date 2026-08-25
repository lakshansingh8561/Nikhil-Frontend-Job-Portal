import React from "react";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiFileText,
  FiGlobe,
  FiImage,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import MediaPreviewGrid from "./MediaPreviewGrid";
import useDismissable from "../../hooks/useDismissable";
import { ACCEPTED_TYPES, useMediaUpload } from "../../hooks/useMediaUpload";
import { useCreatePostMutation, useSearchDirectoryQuery } from "../../api/networkApi";
import type { AuthorDTO, PostVisibility } from "../../types";

const MAX_LENGTH = 3000;

interface ComposerModalProps {
  open: boolean;
  onClose: () => void;
  me?: { fullName?: string; profilePicture?: string; email?: string; headline?: string };
  /** Opens the file picker immediately for the Photo/Document shortcuts. */
  preset?: "media" | "document" | null;
  onPosted?: () => void;
}

export const ComposerModal: React.FC<ComposerModalProps> = ({
  open,
  onClose,
  me,
  preset,
  onPosted,
}) => {
  const [text, setText] = React.useState("");
  const [visibility, setVisibility] = React.useState<PostVisibility>("ANYONE");
  const [visibilityOpen, setVisibilityOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState<string | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const media = useMediaUpload();
  const [createPost, { isLoading: isPublishing }] = useCreatePostMutation();

  const visibilityRef = useDismissable<HTMLDivElement>(visibilityOpen, () =>
    setVisibilityOpen(false)
  );

  // Mention autocomplete: only queries once the user has typed 2+ characters.
  const { data: mentionResults } = useSearchDirectoryQuery(
    { query: mentionQuery || "", limit: 5 },
    { skip: !mentionQuery || mentionQuery.length < 2 }
  );

  const attachedFiles = media.items.length;
  // The core fix: text OR media is enough. The old composer used
  // `<textarea required>`, which blocked caption-less image posts entirely.
  const canPublish = (text.trim().length > 0 || attachedFiles > 0) && !isPublishing;

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => textareaRef.current?.focus(), 60);
    if (preset) {
      fileInputRef.current?.setAttribute(
        "accept",
        preset === "document" ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" : "image/*,video/*"
      );
      window.setTimeout(() => fileInputRef.current?.click(), 120);
    }
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetAndClose = React.useCallback(() => {
    setText("");
    setVisibility("ANYONE");
    setMentionQuery(null);
    media.reset();
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleAddFiles = (files: FileList | File[]) => {
    const rejections = media.addFiles(files);
    rejections.forEach((message) => toast.error(message));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.slice(0, MAX_LENGTH);
    setText(value);

    // Detect an in-progress "@name" token at the caret.
    const caret = event.target.selectionStart ?? value.length;
    const token = value.slice(0, caret).match(/@([\p{L}\p{N} ]{0,30})$/u);
    setMentionQuery(token ? token[1].trim() : null);
  };

  const insertMention = (person: AuthorDTO) => {
    const element = textareaRef.current;
    if (!element) return;
    const caret = element.selectionStart ?? text.length;
    const before = text.slice(0, caret).replace(/@([\p{L}\p{N} ]{0,30})$/u, "");
    const after = text.slice(caret);
    const next = `${before}@${person.fullName} ${after}`;
    setText(next.slice(0, MAX_LENGTH));
    setMentionQuery(null);
    window.setTimeout(() => {
      element.focus();
      const position = before.length + person.fullName.length + 2;
      element.setSelectionRange(position, position);
    }, 0);
  };

  const handlePublish = async () => {
    if (!canPublish) return;

    let uploaded: Awaited<ReturnType<typeof media.uploadAll>> = { media: [], failures: [] };

    if (attachedFiles > 0) {
      uploaded = await media.uploadAll();

      if (uploaded.failures.length > 0 && uploaded.media.length === 0) {
        toast.error("None of the attachments uploaded. Fix them and try again.");
        return;
      }
      if (uploaded.failures.length > 0) {
        toast.error(
          `${uploaded.failures.length} attachment${uploaded.failures.length > 1 ? "s" : ""} failed and were left out.`
        );
      }
    }

    try {
      await createPost({
        content: text.trim(),
        media: uploaded.media,
        visibility,
      }).unwrap();

      toast.success("Post published");
      resetAndClose();
      onPosted?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not publish your post.");
    }
  };

  const visibilityMeta =
    visibility === "ANYONE"
      ? { icon: <FiGlobe />, label: "Anyone" }
      : { icon: <FiUsers />, label: "Connections only" };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      widthClass="max-w-[744px]"
      title={
        <div className="flex items-center gap-3">
          <Avatar src={me?.profilePicture} name={me?.fullName} email={me?.email} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[rgba(0,0,0,0.9)]">
              {me?.fullName || "You"}
            </p>
            <div className="relative" ref={visibilityRef}>
              <button
                type="button"
                onClick={() => setVisibilityOpen((value) => !value)}
                className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.6)] px-2 py-0.5 text-xs font-semibold text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
              >
                {visibilityMeta.icon}
                {visibilityMeta.label}
                <FiChevronDown />
              </button>

              {visibilityOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-1 shadow-xl">
                  {(
                    [
                      { key: "ANYONE", icon: <FiGlobe />, label: "Anyone", hint: "Visible to everyone on the platform" },
                      { key: "CONNECTIONS", icon: <FiUsers />, label: "Connections only", hint: "Visible to your connections" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        setVisibility(option.key);
                        setVisibilityOpen(false);
                      }}
                      className={`flex w-full items-start gap-2.5 px-3 py-2 text-left transition hover:bg-[rgba(0,0,0,0.04)] cursor-pointer ${
                        visibility === option.key ? "bg-[#0a66c2]/5" : ""
                      }`}
                    >
                      <span className="mt-0.5 text-[rgba(0,0,0,0.6)]">{option.icon}</span>
                      <span>
                        <span className="block text-sm font-semibold text-[rgba(0,0,0,0.9)]">
                          {option.label}
                        </span>
                        <span className="block text-xs text-[rgba(0,0,0,0.6)]">{option.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-0.5">
            <AttachButton
              icon={<FiImage className="text-xl text-[#378fe9]" />}
              label="Add a photo"
              disabled={!media.canAddMore}
              onClick={() => {
                fileInputRef.current?.setAttribute("accept", "image/*");
                fileInputRef.current?.click();
              }}
            />
            <AttachButton
              icon={<FiVideo className="text-xl text-[#5f9b41]" />}
              label="Add a video"
              disabled={!media.canAddMore}
              onClick={() => {
                fileInputRef.current?.setAttribute("accept", "video/*");
                fileInputRef.current?.click();
              }}
            />
            <AttachButton
              icon={<FiFileText className="text-xl text-[#e06847]" />}
              label="Add a document"
              disabled={!media.canAddMore}
              onClick={() => {
                fileInputRef.current?.setAttribute(
                  "accept",
                  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                );
                fileInputRef.current?.click();
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            {text.length > MAX_LENGTH - 400 && (
              <span className="text-xs text-[rgba(0,0,0,0.6)]">
                {MAX_LENGTH - text.length} left
              </span>
            )}
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canPublish}
              className="rounded-full bg-[#0a66c2] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgba(0,0,0,0.3)] enabled:cursor-pointer"
            >
              {media.isUploading ? "Uploading…" : isPublishing ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      }
    >
      <div
        className={`px-4 pb-4 pt-2 sm:px-6 ${dragging ? "bg-[#0a66c2]/5" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer?.files?.length) handleAddFiles(event.dataTransfer.files);
        }}
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onPaste={(event) => {
              const files = Array.from(event.clipboardData?.files || []);
              if (files.length > 0) {
                event.preventDefault();
                handleAddFiles(files);
              }
            }}
            rows={attachedFiles > 0 ? 3 : 8}
            placeholder="What do you want to talk about?"
            className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-[rgba(0,0,0,0.9)] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
          />

          {mentionQuery !== null && (mentionResults?.users?.length ?? 0) > 0 && (
            <div className="absolute left-0 top-full z-30 w-full max-w-sm overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-1 shadow-xl">
              {mentionResults?.users?.map((person) => (
                <button
                  key={person.userId}
                  type="button"
                  onClick={() => insertMention(person)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-[rgba(0,0,0,0.04)] cursor-pointer"
                >
                  <Avatar
                    src={person.profilePicture}
                    name={person.fullName}
                    email={person.email}
                    size="sm"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)]">
                      {person.fullName}
                    </span>
                    <span className="block truncate text-xs text-[rgba(0,0,0,0.6)]">
                      {person.headline}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <MediaPreviewGrid
            items={media.items}
            onRemove={media.removeItem}
            onRetry={media.retry}
          />
        </div>

        {dragging && (
          <p className="mt-3 rounded-lg border-2 border-dashed border-[#0a66c2] bg-white/60 py-6 text-center text-sm font-semibold text-[#0a66c2]">
            Drop files to attach
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          hidden
          onChange={(event) => {
            if (event.target.files?.length) handleAddFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </Modal>
  );
};

const AttachButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[rgba(0,0,0,0.08)] disabled:opacity-40 enabled:cursor-pointer"
  >
    {icon}
  </button>
);

export default ComposerModal;
