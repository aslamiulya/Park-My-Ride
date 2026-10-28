import { useState, type ReactNode } from "react";

const fieldClass =
  "flex items-center gap-2.5 rounded-[12px] border border-gray-300 px-4 py-[13px] transition focus-within:border-[#007db5] focus-within:shadow-[0_0_0_3px_rgba(0,125,181,0.12)]";

const inputClass =
  "w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400";

export function TextField({
  id,
  label,
  type = "text",
  value,
  autoComplete,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  autoComplete: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="text-[14px] font-medium text-gray-600">
        {label}
      </label>
      <div className={fieldClass}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          required
        />
      </div>
    </div>
  );
}

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="text-[14px] font-medium text-gray-600">
        {label}
      </label>
      <div className={fieldClass}>
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          required
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          className="flex items-center justify-center text-gray-500"
          onClick={() => setVisible((current) => !current)}
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex w-full items-center justify-center rounded-[12px] bg-[#007db5] px-[10px] py-[13px] text-[16px] font-semibold tracking-wide text-white shadow-md transition hover:bg-[#00689a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:text-[17px]"
    >
      {children}
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="text-center text-sm font-semibold text-red-600" role="alert">
      {message}
    </p>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {hidden ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.1A10.8 10.8 0 0121 12c-.7 1.2-1.6 2.3-2.7 3.2" />
          <path d="M6.1 6.1C4.4 7.4 3 9.1 2 12c1.6 3.4 5.2 6 10 6 1.5 0 2.9-.3 4.2-.8" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}
