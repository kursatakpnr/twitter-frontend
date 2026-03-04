import { useState } from "react";
import AlertMessage from "./AlertMessage";

const MAX_TWEET_LENGTH = 280;

export default function TweetComposer({ onPublish, loading, disabled, error, success }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const remaining = MAX_TWEET_LENGTH - content.length;

  const submit = async (event) => {
    event.preventDefault();
    const success = await onPublish({
      content,
      mediaUrl
    });
    if (success) {
      setContent("");
      setMediaUrl("");
    }
  };

  return (
    <section className="rounded-2xl border border-edge bg-surface/80 p-5 shadow-soft backdrop-blur-xl transition-colors">
      <h2 className="text-lg font-bold text-heading">Say something</h2>
      <p className="mt-1 text-sm text-subtle">What are you sharing right now?</p>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="What's happening?"
          maxLength={MAX_TWEET_LENGTH}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={disabled || loading}
          required
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${
              remaining < 30 ? "text-err" : "text-subtle"
            }`}
          >
            {remaining} characters left
          </span>
        </div>

        <input
          className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Drop an image or media link (optional)"
          value={mediaUrl}
          onChange={(event) => setMediaUrl(event.target.value)}
          disabled={disabled || loading}
        />

        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-brand-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Post tweet"}
        </button>
      </form>

      <div className="mt-3 space-y-2">
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />
      </div>
    </section>
  );
}
