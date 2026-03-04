import AlertMessage from "./AlertMessage";
import TweetCard from "./TweetCard";

export default function TweetFeed({
  tweets,
  loading,
  error,
  isAuthenticated,
  onComment,
  onRetweet,
  onLoadComments
}) {
  return (
    <section className="rounded-2xl border border-edge bg-surface/80 p-5 shadow-soft backdrop-blur-xl transition-colors">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-heading">Timeline</h2>
          <p className="text-sm text-subtle">Fresh posts from this profile, newest first.</p>
        </div>
        <span className="rounded-full bg-raised px-3 py-1 text-xs font-semibold text-body">
          {tweets.length} posts
        </span>
      </div>

      <AlertMessage type="error" message={error} />

      {loading ? (
        <div className="mt-4 space-y-3">
          <div className="h-28 animate-pulse rounded-xl bg-raised" />
          <div className="h-28 animate-pulse rounded-xl bg-raised" />
        </div>
      ) : tweets.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-edge bg-raised/50 px-4 py-6 text-center text-sm text-subtle">
          Nothing here yet. Try another username or post the first tweet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              isAuthenticated={isAuthenticated}
              onComment={onComment}
              onRetweet={onRetweet}
              onLoadComments={onLoadComments}
            />
          ))}
        </div>
      )}
    </section>
  );
}
