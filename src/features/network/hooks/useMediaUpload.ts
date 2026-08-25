import { useCallback, useRef, useState } from "react";
import type { MediaType, PostMedia } from "../types";

/**
 * Post attachments cannot go through RTK Query: `apiSlice.prepareHeaders` sets
 * `Content-Type: application/json` unconditionally, which corrupts a multipart
 * body (the browser never gets to append its own boundary). So this hook talks
 * to `POST /upload/post-media` directly with XMLHttpRequest — which also gives
 * us real upload progress, something fetch() can't report.
 */

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 15 * 1024 * 1024;

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|mov|webm|m4v|avi|mkv)$/i;

export const ACCEPTED_TYPES =
  "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt";

export interface PendingMedia {
  /** Stable local id so React keys survive reordering and retries. */
  id: string;
  file: File;
  /** Object URL for the instant thumbnail, revoked on removal. */
  previewUrl: string;
  type: MediaType;
  status: "queued" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  uploaded?: PostMedia;
}

export const detectMediaType = (file: File): MediaType => {
  const mime = (file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  // Some browsers report an empty mime type for files dragged from odd sources.
  if (IMAGE_EXTENSIONS.test(file.name)) return "IMAGE";
  if (VIDEO_EXTENSIONS.test(file.name)) return "VIDEO";
  return "DOCUMENT";
};

let localIdCounter = 0;
const nextLocalId = (): string => {
  localIdCounter += 1;
  return `m${localIdCounter}_${Math.random().toString(36).slice(2, 8)}`;
};

const authToken = (): string =>
  localStorage.getItem("jobbox_accessToken") || "";

const uploadEndpoint = (): string => {
  const origin = (import.meta.env.VITE_BASE_URL as string) || "";
  return `${origin.replace(/\/$/, "")}/api/v1/upload/post-media`;
};

interface UploadOutcome {
  media: PostMedia[];
  failures: PendingMedia[];
}

export const useMediaUpload = () => {
  const [items, setItems] = useState<PendingMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const previewUrls = useRef<Set<string>>(new Set());

  const patch = useCallback((id: string, changes: Partial<PendingMedia>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  }, []);

  /** Adds files, rejecting oversize ones and enforcing the 10-file cap. */
  const addFiles = useCallback(
    (incoming: FileList | File[]): string[] => {
      const rejections: string[] = [];
      const files = Array.from(incoming);

      setItems((current) => {
        const room = MAX_FILES - current.length;
        if (room <= 0) {
          rejections.push(`You can attach up to ${MAX_FILES} files.`);
          return current;
        }

        const accepted: PendingMedia[] = [];
        files.forEach((file) => {
          if (accepted.length >= room) {
            rejections.push(`Only the first ${MAX_FILES} files were attached.`);
            return;
          }
          if (file.size > MAX_FILE_BYTES) {
            rejections.push(`"${file.name}" is larger than 15 MB.`);
            return;
          }

          const previewUrl = URL.createObjectURL(file);
          previewUrls.current.add(previewUrl);

          accepted.push({
            id: nextLocalId(),
            file,
            previewUrl,
            type: detectMediaType(file),
            status: "queued",
            progress: 0,
          });
        });

        return [...current, ...accepted];
      });

      return rejections;
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrls.current.delete(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const reset = useCallback(() => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setItems([]);
    setIsUploading(false);
  }, []);

  /** Uploads one file and resolves with its server descriptor. */
  const uploadOne = useCallback(
    (item: PendingMedia): Promise<PostMedia> =>
      new Promise<PostMedia>((resolve, reject) => {
        const form = new FormData();
        form.append("files", item.file, item.file.name);

        const request = new XMLHttpRequest();
        request.open("POST", uploadEndpoint(), true);

        const token = authToken();
        if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
        // Intentionally no Content-Type header: the browser must set the
        // multipart boundary itself.

        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          patch(item.id, {
            status: "uploading",
            progress: Math.round((event.loaded / event.total) * 100),
          });
        };

        request.onload = () => {
          let payload: any = null;
          try {
            payload = JSON.parse(request.responseText || "{}");
          } catch {
            payload = null;
          }

          if (request.status >= 200 && request.status < 300) {
            const descriptor: PostMedia | undefined = payload?.data?.media?.[0];
            if (descriptor?.url) {
              resolve(descriptor);
              return;
            }
            reject(new Error("The server accepted the file but returned no URL."));
            return;
          }

          reject(new Error(payload?.message || `Upload failed (${request.status}).`));
        };

        request.onerror = () =>
          reject(new Error("Network error while uploading. Check your connection."));
        request.onabort = () => reject(new Error("Upload cancelled."));

        request.send(form);
      }),
    [patch]
  );

  /**
   * Uploads everything not already uploaded. Files are sent one at a time so
   * each progress ring is meaningful and a single failure doesn't take the
   * whole batch down.
   */
  const uploadAll = useCallback(async (): Promise<UploadOutcome> => {
    const snapshot = await new Promise<PendingMedia[]>((resolve) => {
      setItems((current) => {
        resolve(current);
        return current;
      });
    });

    if (snapshot.length === 0) return { media: [], failures: [] };

    setIsUploading(true);
    const media: PostMedia[] = [];
    const failures: PendingMedia[] = [];

    for (const item of snapshot) {
      if (item.status === "done" && item.uploaded) {
        media.push(item.uploaded);
        continue;
      }

      patch(item.id, { status: "uploading", progress: 0, error: undefined });

      try {
        const uploaded = await uploadOne(item);
        patch(item.id, { status: "done", progress: 100, uploaded });
        media.push(uploaded);
      } catch (error: any) {
        const message = error?.message || "Upload failed.";
        patch(item.id, { status: "error", error: message });
        failures.push({ ...item, status: "error", error: message });
      }
    }

    setIsUploading(false);
    return { media, failures };
  }, [patch, uploadOne]);

  const retry = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target) return;

      patch(id, { status: "uploading", progress: 0, error: undefined });
      try {
        const uploaded = await uploadOne(target);
        patch(id, { status: "done", progress: 100, uploaded });
      } catch (error: any) {
        patch(id, { status: "error", error: error?.message || "Upload failed." });
      }
    },
    [items, patch, uploadOne]
  );

  return {
    items,
    isUploading,
    hasMedia: items.length > 0,
    canAddMore: items.length < MAX_FILES,
    addFiles,
    removeItem,
    reset,
    uploadAll,
    retry,
  };
};
