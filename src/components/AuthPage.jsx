import { useMemo, useState } from "react";
import AlertMessage from "./AlertMessage";

const initialState = {
  usernameOrEmail: "",
  loginPassword: "",
  username: "",
  email: "",
  registerPassword: "",
  displayName: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[A-Za-z0-9_]+$/;

export default function AuthPage({
  user,
  loading,
  apiError,
  onLogin,
  onRegister,
  onLogout
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);
  const [localError, setLocalError] = useState("");

  const tabIndex = useMemo(() => (mode === "login" ? 0 : 1), [mode]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setLocalError("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setLocalError("");
  };

  const validateLogin = () => {
    if (!form.usernameOrEmail.trim()) {
      return "Tell us your username or email so we know it's you.";
    }
    if (form.loginPassword.trim().length < 6) {
      return "Oops, that password is a bit too short! Try at least 6 characters.";
    }
    return null;
  };

  const validateRegister = () => {
    if (form.username.trim().length < 3) {
      return "Your username needs at least 3 characters.";
    }
    if (!usernameRegex.test(form.username.trim())) {
      return "Use only letters, numbers, and underscores in your username.";
    }
    if (!emailRegex.test(form.email.trim())) {
      return "That email doesn't look right yet. Give it another check.";
    }
    if (form.registerPassword.trim().length < 8) {
      return "Oops, that password is a bit too short! Make it at least 8 characters.";
    }
    return null;
  };

  const submit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (mode === "login") {
      const validationMessage = validateLogin();
      if (validationMessage) {
        setLocalError(validationMessage);
        return;
      }

      const success = await onLogin({
        usernameOrEmail: form.usernameOrEmail.trim(),
        password: form.loginPassword
      });

      if (success) {
        setForm((previous) => ({ ...previous, loginPassword: "" }));
      }
      return;
    }

    const validationMessage = validateRegister();
    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    const success = await onRegister({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.registerPassword,
      displayName: form.displayName.trim()
    });

    if (success) {
      setForm(initialState);
    }
  };

  if (user) {
    return (
      <section className="rounded-3xl border border-edge bg-surface/80 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Welcome back</p>
        <h2 className="mt-2 text-2xl font-bold text-heading">You are in, @{user.username}</h2>
        <p className="mt-2 text-sm text-body">
          Ready to post, reply, and keep the conversation moving?
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 rounded-xl border border-edge px-4 py-2.5 text-sm font-semibold text-heading transition hover:border-edge-hover hover:bg-raised"
        >
          Log out for now
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-edge bg-surface/80 p-6 shadow-soft backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Twitter Clone</p>
      <h2 className="mt-2 text-2xl font-black text-heading">
        {mode === "login" ? "Welcome back!" : "Join the conversation today"}
      </h2>
      <p className="mt-2 text-sm text-body">
        {mode === "login"
          ? "Pick up where you left off."
          : "Create your profile and start sharing what is happening."}
      </p>

      <div className="mt-5 rounded-xl border border-edge bg-raised p-1">
        <div className="relative grid grid-cols-2">
          <div
            className={`absolute inset-y-0 w-1/2 rounded-lg bg-brand transition-transform duration-300 ${
              tabIndex === 0 ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`relative z-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "login" ? "text-night" : "text-body hover:text-heading"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`relative z-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "register" ? "text-night" : "text-body hover:text-heading"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <form className="mt-5 space-y-3" onSubmit={submit}>
        {mode === "login" ? (
          <>
            <input
              name="usernameOrEmail"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Username or email"
              value={form.usernameOrEmail}
              onChange={onFieldChange}
              autoComplete="username"
              required
            />
            <input
              name="loginPassword"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="password"
              placeholder="Your password"
              value={form.loginPassword}
              onChange={onFieldChange}
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-brand-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Getting you in..." : "Let's go"}
            </button>
          </>
        ) : (
          <>
            <input
              name="username"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Pick your @username"
              value={form.username}
              onChange={onFieldChange}
              autoComplete="username"
              required
            />
            <input
              name="email"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="email"
              placeholder="name@domain.com"
              value={form.email}
              onChange={onFieldChange}
              autoComplete="email"
              required
            />
            <input
              name="registerPassword"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="password"
              placeholder="Create a password"
              value={form.registerPassword}
              onChange={onFieldChange}
              autoComplete="new-password"
              required
            />
            <input
              name="displayName"
              className="w-full rounded-xl border border-edge bg-raised px-3 py-2.5 text-sm text-heading placeholder-subtle outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Display name (optional)"
              value={form.displayName}
              onChange={onFieldChange}
              autoComplete="name"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-brand-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating your account..." : "Create my account"}
            </button>
          </>
        )}
      </form>

      <div className="mt-4 space-y-2">
        <AlertMessage type="error" message={localError || apiError} />
      </div>
    </section>
  );
}
