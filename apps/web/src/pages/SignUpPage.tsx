import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { AuthCard, AuthShell, PageLoader } from "../components/AuthShell.tsx";
import { FormError, PasswordField, PrimaryButton, TextField } from "../components/Fields.tsx";
import { ApiError } from "../lib/api.ts";
import { useAuth } from "../lib/auth.tsx";

export default function SignUpPage() {
  const { user, loading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Event Garage Parking - Sign Up";
  }, []);

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password, true);
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
            Create your account
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-gray-500 sm:text-[16px]">
            Use this account to sign in on the website.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            value={name}
            autoComplete="name"
            placeholder="Enter your name"
            onChange={setName}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="Enter your Email"
            onChange={setEmail}
          />
          <PasswordField
            id="password"
            label="Password"
            value={password}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            onChange={setPassword}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            onChange={setConfirmPassword}
          />

          <FormError message={error} />

          <PrimaryButton disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </PrimaryButton>
        </form>

        <p className="text-center text-[14px] leading-relaxed text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-[#007db5] underline hover:text-[#005b9a]">
            Login
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
