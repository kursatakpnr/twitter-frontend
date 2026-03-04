import { useMemo, useState } from "react";
import { login, logout, register } from "./api/authApi";
import { extractApiError } from "./api/http";
import {
  createComment,
  createRetweet,
  createTweet,
  fetchCommentsByTweetId,
  fetchTweetsByUsername
} from "./api/tweetApi";
import AuthPage from "./components/AuthPage";
import TweetComposer from "./components/TweetComposer";
import TweetFeed from "./components/TweetFeed";

const getStoredUser = () => {
  const raw = localStorage.getItem("authUser");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [usernameQuery, setUsernameQuery] = useState("");
  const [tweets, setTweets] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState("");

  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState("");

  const isAuthenticated = useMemo(() => Boolean(localStorage.getItem("accessToken")), [user]);

  const handleLogin = async (payload) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const authResponse = await login(payload);
      setUser(authResponse);
      setUsernameQuery(authResponse.username ?? "");
      return true;
    } catch (error) {
      setAuthError(extractApiError(error, "Hmm, we could not log you in. Give it another shot."));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const authResponse = await register(payload);
      setUser(authResponse);
      setUsernameQuery(authResponse.username ?? "");
      return true;
    } catch (error) {
      setAuthError(extractApiError(error, "We could not create your account right now."));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setTweets([]);
    setUsernameQuery("");
    setAuthError("");
    setFeedError("");
    setPublishError("");
    setPublishSuccess("");
  };

  const loadTweets = async () => {
    setPublishSuccess("");
    setFeedError("");

    if (!isAuthenticated) {
      setFeedError("Log in first so we can load your feed.");
      return;
    }

    if (!usernameQuery.trim()) {
      setFeedError("Type a username to load the timeline.");
      return;
    }

    setFeedLoading(true);
    try {
      const result = await fetchTweetsByUsername(usernameQuery.trim());
      setTweets(result);
    } catch (error) {
      setFeedError(extractApiError(error, "Could not load tweets right now."));
    } finally {
      setFeedLoading(false);
    }
  };

  const handlePublish = async (payload) => {
    setPublishError("");
    setPublishSuccess("");

    if (!isAuthenticated) {
      setPublishError("You need to log in before posting.");
      return false;
    }

    setPublishLoading(true);
    try {
      const createdTweet = await createTweet(payload);
      setTweets((previous) => [createdTweet, ...previous]);
      setPublishSuccess("Nice one. Your tweet is live.");
      return true;
    } catch (error) {
      setPublishError(extractApiError(error, "Your tweet did not go through. Try once more."));
      return false;
    } finally {
      setPublishLoading(false);
    }
  };

  const handleComment = async (tweetId, content) => {
    try {
      const createdComment = await createComment({ tweetId, content });
      setTweets((previous) =>
        previous.map((tweet) =>
          tweet.id === tweetId
            ? { ...tweet, commentCount: (tweet.commentCount ?? 0) + 1 }
            : tweet
        )
      );
      return { ok: true, message: "Reply posted.", data: createdComment };
    } catch (error) {
      return {
        ok: false,
        message: extractApiError(error, "Could not post your reply right now.")
      };
    }
  };

  const handleRetweet = async (tweetId, quoteText) => {
    try {
      await createRetweet({ tweetId, quoteText });
      setTweets((previous) =>
        previous.map((tweet) =>
          tweet.id === tweetId
            ? { ...tweet, retweetCount: (tweet.retweetCount ?? 0) + 1 }
            : tweet
        )
      );
      return { ok: true, message: "Retweeted successfully." };
    } catch (error) {
      return {
        ok: false,
        message: extractApiError(error, "Could not retweet this post.")
      };
    }
  };

  const handleLoadComments = async (tweetId) => {
    try {
      const comments = await fetchCommentsByTweetId(tweetId);
      return { ok: true, data: comments };
    } catch (error) {
      return {
        ok: false,
        message: extractApiError(error, "Could not load replies right now.")
      };
    }
  };

  return (
    <div className="relative z-10 min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-edge bg-surface/80 p-6 shadow-soft backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Twitter Clone API</p>
          <h1 className="mt-2 text-3xl font-black text-heading md:text-4xl">Your Feed, Your Voice</h1>
          <p className="mt-2 max-w-2xl text-sm text-body">
            Jump in, check a profile timeline, and share a fresh tweet in seconds.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <AuthPage
              user={user}
              loading={authLoading}
              apiError={authError}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
            />

            <TweetComposer
              onPublish={handlePublish}
              loading={publishLoading}
              disabled={!isAuthenticated}
              error={publishError}
              success={publishSuccess}
            />
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-edge bg-surface/80 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Whose timeline do you want to see? (@username)"
                  value={usernameQuery}
                  onChange={(event) => setUsernameQuery(event.target.value)}
                />
                <button
                  type="button"
                  onClick={loadTweets}
                  disabled={feedLoading}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-brand-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {feedLoading ? "Loading timeline..." : "Load timeline"}
                </button>
              </div>
            </section>

            <TweetFeed
              tweets={tweets}
              loading={feedLoading}
              error={feedError}
              isAuthenticated={isAuthenticated}
              onComment={handleComment}
              onRetweet={handleRetweet}
              onLoadComments={handleLoadComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
