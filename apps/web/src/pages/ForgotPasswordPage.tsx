import { useEffect } from "react";
import { Link } from "react-router";
import { AuthCard, AuthShell } from "../components/AuthShell.tsx";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "Event Garage Parking - Forgot Password";
  }, []);

  return (
    <AuthShell>
      <AuthCard>
        <div>
          <h1 className="font-['Roboto',sans-serif] text-[28px] leading-snug font-semibold tracking-tight text-gray-900 sm:text-[32px]">
            Forgot password?
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-gray-500 sm:text-[16px]">
            Sign in with the email and password on your account. If you are new,
            create an account instead.
          </p>
        </div>
        <Link
          to="/signin"
          className="flex w-full items-center justify-center rounded-[12px] bg-[#007db5] px-[10px] py-[13px] text-[16px] font-semibold text-white shadow-md hover:bg-[#00689a]"
        >
          Back to login
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
