import { useEffect } from "react";
import { Navigate } from "react-router";
import { PageLoader } from "../components/AuthShell.tsx";
import { useAuth } from "../lib/auth.tsx";

export default function HomePage() {
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    document.title = "Event Garage Parking - Home";
  }, []);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <header className="w-full bg-[#007DB5]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 border-white/90 text-[14px] font-bold text-white sm:h-[52px] sm:w-[52px] sm:text-[16px]">
              EGP
            </div>
            <div className="truncate text-[15px] font-bold tracking-[0.4px] text-white sm:text-[22px] sm:tracking-[1px]">
              Event Garage Parking
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="shrink-0 rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold whitespace-nowrap text-[#007db5]"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-[24px] bg-white px-7 py-9 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <p className="text-[14px] font-medium text-[#007db5]">Signed in</p>
          <h1 className="mt-2 font-['Roboto',sans-serif] text-[32px] font-semibold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="mt-3 text-[16px] text-gray-600">
            You are signed in as {user.email}. Listings, bookings, and payments
            will be added on the next screens.
          </p>
        </div>
      </main>
    </div>
  );
}
