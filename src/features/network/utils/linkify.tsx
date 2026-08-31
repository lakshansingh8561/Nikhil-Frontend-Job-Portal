import React from "react";
import { Link } from "react-router-dom";

/**
 * Turns raw post/comment text into React nodes with clickable URLs and
 * hashtags. Deliberately does *not* use `dangerouslySetInnerHTML` — user text
 * is only ever rendered as a text node, so a crafted post can't inject markup.
 */

// Order matters: URLs first so a "#" inside a query string isn't treated as a tag.
const TOKEN_PATTERN = /((?:https?:\/\/|www\.)[^\s<]+)|(#[\p{L}\p{N}_]{2,50})/gu;

export interface LinkifyOptions {
  /** Where a hashtag click should navigate, e.g. "/job-seeker/network". */
  hashtagBasePath?: string;
}

export const linkify = (
  text: string,
  options: LinkifyOptions = {}
): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const source = typeof text === "string" ? text : "";
  TOKEN_PATTERN.lastIndex = 0;

  let match = TOKEN_PATTERN.exec(source);
  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(source.slice(lastIndex, match.index));
    }

    const [token, url, hashtag] = match;

    if (url) {
      // Trailing punctuation shouldn't become part of the href.
      const trailing = url.match(/[.,!?)\]]+$/)?.[0] || "";
      const clean = trailing ? url.slice(0, -trailing.length) : url;
      const href = clean.startsWith("http") ? clean : `https://${clean}`;

      nodes.push(
        <a
          key={`u${key}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={(event) => event.stopPropagation()}
          className="text-[#3C65F5] hover:underline break-all"
        >
          {clean}
        </a>
      );
      if (trailing) nodes.push(trailing);
    } else if (hashtag) {
      const tag = hashtag.slice(1);
      const base = options.hashtagBasePath;
      nodes.push(
        base ? (
          <Link
            key={`h${key}`}
            to={`${base}?tag=${encodeURIComponent(tag.toLowerCase())}`}
            onClick={(event) => event.stopPropagation()}
            className="font-semibold text-[#3C65F5] hover:underline"
          >
            {hashtag}
          </Link>
        ) : (
          <span key={`h${key}`} className="font-semibold text-[#3C65F5]">
            {hashtag}
          </span>
        )
      );
    } else {
      nodes.push(token);
    }

    key += 1;
    lastIndex = match.index + token.length;
    match = TOKEN_PATTERN.exec(source);
  }

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes;
};
