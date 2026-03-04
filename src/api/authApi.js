import http from "./http";

const persistAuth = (authPayload) => {
  localStorage.setItem("accessToken", authPayload.accessToken);
  localStorage.setItem("authUser", JSON.stringify(authPayload));
};

export const login = async (payload) => {
  const { data } = await http.post("/auth/login", payload);
  persistAuth(data);
  return data;
};

export const register = async (payload) => {
  const body = {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    displayName: payload.displayName?.trim() || payload.username,
    bio: payload.bio ?? null,
    profileImageUrl: payload.profileImageUrl ?? null
  };

  const { data } = await http.post("/auth/register", body);
  persistAuth(data);
  return data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
};
