import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { AuthCard, AuthShell, PageLoader } from "../components/AuthShell.tsx";
import { FormError, PasswordField, PrimaryButton, TextField } from "../components/Fields.tsx";
import { ApiError } from "../lib/api.ts";
import { useAuth } from "../lib/auth.tsx";

export default function SignInPage() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Event Garage Parking - Sign In";
  }, []);

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password, remember);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not reach the server. Make sure the API is running.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard>
        <div>
          <h1 className="font-['Roboto',sans-serif] text-[28px] leading-snug font-semibold tracking-tight text-gray-900 sm:text-[32px]">
            Welcome Back!
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-gray-500 sm:text-[16px]">
            Please enter your details.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="Enter your Email"
            onChange={setEmail}
          />

          <div className="flex flex-col gap-3.5">
            <PasswordField
              id="password"
              label="Password"
              value={password}
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={setPassword}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 accent-[#007db5]"
                />
                <span className="text-[14px] text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[14px] font-medium text-[#007db5] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <FormError message={error} />

          <PrimaryButton disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </PrimaryButton>
        </form>

        <p className="text-center text-[14px] leading-relaxed text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-[#007db5] underline hover:text-[#005b9a]">
            Signup
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
