import { Check, ChevronDown, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type ComboboxProps = {
  describedBy?: string;
  id: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  renderOption?: (option: string) => ReactNode;
  value: string;
};

export function Combobox({
  describedBy,
  id,
  invalid = false,
  onChange,
  options,
  placeholder,
  renderOption,
  value,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const query = value.trim().toLowerCase();
  const matches = options.filter((option) => option.toLowerCase().includes(query));
  const canCreate = value.trim().length > 0 && !options.some((option) => option.toLowerCase() === query);
  const items: Array<{ kind: "existing" | "create"; label: string }> = [
    ...matches.map((option) => ({ kind: "existing" as const, label: option })),
    ...(canCreate ? [{ kind: "create" as const, label: value.trim() }] : []),
  ];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(items.length - 1);
  }, [activeIndex, items.length]);

  function commit(index: number) {
    const item = items[index];
    if (item) onChange(item.label);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      commit(activeIndex);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        className={`ui-input pr-9 ${invalid ? "ui-input-invalid" : ""}`}
        id={id}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={inputRef}
        role="combobox"
        type="text"
        value={value}
      />
      <button
        aria-label={open ? "Hide project suggestions" : "Show project suggestions"}
        className="ui-focus absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-sm text-text-tertiary transition-colors hover:text-text-primary"
        onClick={() => {
          setOpen((currentOpen) => !currentOpen);
          inputRef.current?.focus();
        }}
        tabIndex={-1}
        type="button"
      >
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && items.length > 0 && (
        <div
          className="ui-popover absolute left-0 right-0 z-30 mt-1.5 max-h-56 overflow-y-auto"
          id={listId}
          role="listbox"
        >
          {items.map((item, index) => (
            <div
              aria-selected={item.kind === "existing" && item.label === value}
              className={`ui-menu-item ${index === activeIndex ? "bg-muted" : ""}`}
              id={`${listId}-${index}`}
              key={`${item.kind}-${item.label}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(index)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
            >
              {item.kind === "create" ? (
                <span className="flex items-center gap-2 text-primary-fg">
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  Create "{item.label}"
                </span>
              ) : (
                <>
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    {renderOption ? renderOption(item.label) : item.label}
                  </span>
                  {item.label === value && (
                    <Check aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
