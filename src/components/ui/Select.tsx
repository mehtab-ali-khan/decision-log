import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type SelectOption<Value extends string> = {
  label: string;
  value: Value;
  adornment?: ReactNode;
};

type SelectProps<Value extends string> = {
  align?: "start" | "end";
  ariaLabel: string;
  icon?: ReactNode;
  isActive?: boolean;
  onChange: (value: Value) => void;
  options: SelectOption<Value>[];
  value: Value;
};

export function Select<Value extends string>({
  align = "start",
  ariaLabel,
  icon,
  isActive = false,
  onChange,
  options,
  value,
}: SelectProps<Value>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeaheadRef = useRef({ query: "", timer: 0 });
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedLabel = options[selectedIndex]?.label ?? "";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
    listRef.current?.focus();
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function select(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  }

  function handleTypeahead(key: string) {
    const typeahead = typeaheadRef.current;
    window.clearTimeout(typeahead.timer);
    typeahead.query += key.toLowerCase();
    typeahead.timer = window.setTimeout(() => {
      typeahead.query = "";
    }, 600);

    const match = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(typeahead.query),
    );
    if (match >= 0) setActiveIndex(match);
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (event.key.length === 1) handleTypeahead(event.key);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${ariaLabel}: ${selectedLabel}`}
        className={`ui-select-trigger ${
          isActive
            ? "border-primary/30 bg-primary-subtle text-primary-fg"
            : "border-border bg-surface text-text-primary hover:border-text-tertiary/50 hover:bg-muted"
        }`}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        ref={triggerRef}
        type="button"
      >
        {icon}
        <span className="max-w-[10rem] truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          aria-activedescendant={`${listId}-${activeIndex}`}
          aria-label={ariaLabel}
          className={`ui-popover absolute z-30 mt-1.5 max-h-64 w-56 overflow-y-auto ${
            align === "end" ? "right-0" : "left-0"
          }`}
          id={listId}
          onKeyDown={handleListKeyDown}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <div
              aria-selected={option.value === value}
              className={`ui-menu-item ${index === activeIndex ? "bg-muted" : ""}`}
              data-index={index}
              id={`${listId}-${index}`}
              key={option.value}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                {option.adornment}
                <span className="truncate">{option.label}</span>
              </span>
              {option.value === value && (
                <Check aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
