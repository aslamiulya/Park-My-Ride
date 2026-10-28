import type { ReactNode } from "react";
import { Link } from "react-router";

function BrandBadge() {
  return (
    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border-2 border-white/90 text-[16px] font-bold text-white lg:h-[58px] lg:w-[58px] lg:text-[18px]">
      EGP
    </div>
  );
}

function HeaderLinks({ mobile = false }: { mobile?: boolean }) {
  const linkClass = "transition hover:text-white";
  return (
    <nav
      className={
        mobile
          ? "flex flex-wrap justify-center gap-1 text-[10px] text-white/75"
          : "flex items-center justify-end gap-1 text-[9px] whitespace-nowrap text-white/75 lg:text-[11px]"
      }
    >
      <a
        className={linkClass}
        href="https://eventgarageparking.com/homeowner-faq/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Help
      </a>
      <span className="opacity-40">|</span>
      {mobile ? (
        <>
          <Link className={linkClass} to="/signin">
            Sign In
          </Link>
          <span>/</span>
          <Link className={linkClass} to="/signup">
            Register
          </Link>
          <span className="opacity-40">|</span>
        </>
      ) : null}
      <a className={linkClass} href="https://eventgarageparking.net/contact-us/">
        Contact
      </a>
      <span className="opacity-40">|</span>
      <Link className={linkClass} to="/">
        Homeowner Portal
      </Link>
    </nav>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),rgba(0,125,181,0.35)_35%,#00608a_70%,#004f73)]">
      <header className="w-full bg-[#007DB5]">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-10">
          <div className="hidden w-full items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
            <div className="flex justify-start">
              <BrandBadge />
            </div>
            <div className="text-center text-[20px] leading-tight font-bold tracking-[1px] whitespace-nowrap text-white lg:text-[28px]">
              Event Garage Parking
            </div>
            <HeaderLinks />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-center md:hidden">
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[10px] border-2 border-white/90 text-[16px] font-bold text-white">
              EGP
            </div>
            <div className="text-[22px] leading-tight font-bold tracking-[1px] text-white">
              Event Garage Parking
            </div>
            <HeaderLinks mobile />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-14 md:py-16">
        {children}
      </main>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[460px] flex-col gap-7 rounded-[24px] bg-white px-7 pt-9 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-9 sm:pt-10 sm:pb-9">
      {children}
    </div>
  );
}

export function PageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex h-[118px] w-[118px] items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-[#e6eef3] border-t-[#007DB5]" />
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-[#007DB5] text-[18px] font-bold text-white">
          EGP
        </div>
      </div>
    </div>
  );
}
