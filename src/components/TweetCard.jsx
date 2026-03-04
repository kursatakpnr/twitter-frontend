import { useState } from "react";

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "-";
  }
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export default function TweetCard({
  tweet,
  isAuthenticated,
  onComment,
  onRetweet,
  onLoadComments
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [retweetOpen, setRetweetOpen] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [retweetLoading, setRetweetLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const submitReply = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalMessage("");

    if (!isAuthenticated) {
      setLocalError("First log in, then jump into the conversation.");
      return;
    }
    if (replyText.trim().length < 1) {
      setLocalError("Write a quick reply before sending.");
      return;
    }

    setReplyLoading(true);
    const result = await onComment(tweet.id, replyText.trim());
    setReplyLoading(false);

    if (result.ok) {
      setReplyText("");
      setReplyOpen(false);
      setLocalMessage("Reply posted.");
      if (result.data) {
        setComments((previous) => [...previous, result.data]);
        setCommentsLoaded(true);
      }
      return;
    }
    setLocalError(result.message);
  };

  const submitRetweet = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalMessage("");

    if (!isAuthenticated) {
      setLocalError("Log in to retweet this post.");
      return;
    }

    setRetweetLoading(true);
    const result = await onRetweet(tweet.id, quoteText.trim());
    setRetweetLoading(false);

    if (result.ok) {
      setQuoteText("");
      setRetweetOpen(false);
      setLocalMessage("Retweeted successfully.");
      return;
    }
    setLocalError(result.message);
  };

  const toggleReplies = async () => {
    const willOpen = !repliesOpen;
    setRepliesOpen(willOpen);
    setReplyOpen(false);
    setRetweetOpen(false);
    setLocalError("");
    setLocalMessage("");

    if (!willOpen || commentsLoaded) {
      return;
    }

    setCommentsLoading(true);
    setCommentsError("");
    const result = await onLoadComments(tweet.id);
    setCommentsLoading(false);

    if (result.ok) {
      setComments(result.data ?? []);
      setCommentsLoaded(true);
      return;
    }

    setCommentsError(result.message);
  };

  return (
    <article className="group rounded-2xl border border-edge bg-raised/60 p-4 shadow-card transition-all duration-200 hover:border-brand/30 hover:shadow-glow">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-heading">{tweet.author?.displayName ?? "Someone"}</p>
          <p className="text-xs text-subtle">@{tweet.author?.username ?? "unknown"}</p>
        </div>
        <p className="text-xs font-medium text-subtle">{formatDate(tweet.createdAt)}</p>
      </header>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-body">{tweet.content}</p>

      {tweet.mediaUrl && (
        <a
          href={tweet.mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-brand underline-offset-2 transition hover:text-brand-hover hover:underline"
        >
          Open attachment
        </a>
      )}

      <footer className="mt-4 flex gap-3 text-xs font-semibold text-subtle">
        <span>Likes {tweet.likeCount ?? 0}</span>
        <span>Dislikes {tweet.dislikeCount ?? 0}</span>
        <span>Replies {tweet.commentCount ?? 0}</span>
        <span>Retweets {tweet.retweetCount ?? 0}</span>
      </footer>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setReplyOpen((previous) => !previous);
            setRetweetOpen(false);
            setRepliesOpen(false);
            setLocalError("");
            setLocalMessage("");
          }}
          className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-body transition hover:border-edge-hover hover:bg-surface hover:text-heading"
        >
          Reply
        </button>
        <button
          type="button"
          onClick={() => {
            setRetweetOpen((previous) => !previous);
            setReplyOpen(false);
            setRepliesOpen(false);
            setLocalError("");
            setLocalMessage("");
          }}
          className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-body transition hover:border-edge-hover hover:bg-surface hover:text-heading"
        >
          Retweet
        </button>
        <button
          type="button"
          onClick={toggleReplies}
          className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-body transition hover:border-edge-hover hover:bg-surface hover:text-heading"
        >
          {repliesOpen ? "Hide replies" : `View replies (${tweet.commentCount ?? 0})`}
        </button>
      </div>

      {replyOpen && (
        <form className="mt-3 space-y-2" onSubmit={submitReply}>
          <textarea
            className="min-h-[80px] w-full rounded-xl border border-edge bg-surface px-3 py-2 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            maxLength={280}
            required
          />
          <button
            type="submit"
            disabled={replyLoading}
            className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-night transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {replyLoading ? "Posting..." : "Post reply"}
          </button>
        </form>
      )}

      {retweetOpen && (
        <form className="mt-3 space-y-2" onSubmit={submitRetweet}>
          <input
            className="w-full rounded-xl border border-edge bg-surface px-3 py-2 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="Add a quote (optional)"
            value={quoteText}
            onChange={(event) => setQuoteText(event.target.value)}
            maxLength={280}
          />
          <button
            type="submit"
            disabled={retweetLoading}
            className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-night transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {retweetLoading ? "Sharing..." : "Retweet now"}
          </button>
        </form>
      )}

      {repliesOpen && (
        <div className="mt-3 space-y-2 rounded-xl border border-edge bg-surface/70 p-3">
          {commentsLoading && (
            <p className="text-xs font-medium text-subtle">Loading replies...</p>
          )}
          {commentsError && (
            <p className="text-xs font-medium text-err">{commentsError}</p>
          )}
          {!commentsLoading && !commentsError && comments.length === 0 && (
            <p className="text-xs font-medium text-subtle">
              No replies yet. Be the first one.
            </p>
          )}
          {!commentsLoading && !commentsError && comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-edge bg-raised/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-heading">
                      {comment.author?.displayName ?? "Someone"} @{comment.author?.username ?? "unknown"}
                    </p>
                    <p className="text-[11px] text-subtle">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-body">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {localError && <p className="mt-3 text-xs font-medium text-err">{localError}</p>}
      {localMessage && <p className="mt-3 text-xs font-medium text-ok">{localMessage}</p>}
    </article>
  );
}
