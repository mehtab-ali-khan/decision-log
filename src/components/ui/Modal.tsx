import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let scrollLockCount = 0;

function lockBodyScroll(): () => void {
  if (scrollLockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  scrollLockCount += 1;

  return () => {
    scrollLockCount -= 1;
    if (scrollLockCount === 0) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };
}

type ModalProps = {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  variant?: "sheet" | "center";
  describedBy?: string;
  panelClassName?: string;
  role?: "dialog" | "alertdialog";
};

export function Modal({
  children,
  labelledBy,
  onClose,
  variant = "center",
  describedBy,
  panelClassName = "max-w-md p-6",
  role = "dialog",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel)?.focus();

    return () => previouslyFocused?.focus?.();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
    ).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const isSheet = variant === "sheet";

  return createPortal(
    <div
      className={`fixed inset-x-0 top-0 z-50 flex h-[100dvh] ${
        isSheet
          ? "items-end justify-end sm:items-stretch"
          : "items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:p-6"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-fade-in bg-text-primary/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={
          isSheet
            ? "relative flex max-h-[92vh] w-full animate-slide-in-bottom flex-col overflow-hidden rounded-t-xl bg-surface shadow-overlay sm:max-h-none sm:h-full sm:max-w-[30rem] sm:animate-slide-in-right sm:rounded-none"
            : `relative flex w-full animate-scale-in flex-col overflow-hidden rounded-lg bg-surface shadow-overlay ${panelClassName}`
        }
        ref={panelRef}
        role={role}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
