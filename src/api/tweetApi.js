import http from "./http";

export const fetchTweetsByUsername = async (username) => {
  const { data } = await http.get("/tweet/findByUsername", {
    params: { username }
  });
  return data;
};

export const createTweet = async (payload) => {
  const body = {
    content: payload.content,
    mediaUrl: payload.mediaUrl?.trim() ? payload.mediaUrl.trim() : null
  };
  const { data } = await http.post("/tweet", body);
  return data;
};

export const createComment = async (payload) => {
  const body = {
    tweetId: payload.tweetId,
    content: payload.content,
    parentCommentId: null
  };
  const { data } = await http.post("/comment", body);
  return data;
};

export const fetchCommentsByTweetId = async (tweetId) => {
  const { data } = await http.get("/comment/byTweetId", {
    params: { tweetId }
  });
  return data;
};

export const createRetweet = async (payload) => {
  const body = {
    tweetId: payload.tweetId,
    quoteText: payload.quoteText?.trim() ? payload.quoteText.trim() : null
  };
  const { data } = await http.post("/retweet", body);
  return data;
};
