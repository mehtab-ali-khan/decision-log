import { Trash2, Undo2 } from "lucide-react";
import toast from "react-hot-toast";

const UNDO_WINDOW_MS = 6000;

type UndoToastOptions = {
  message: string;
  onUndo: () => void;
};

export function showUndoToast({ message, onUndo }: UndoToastOptions) {
  toast.custom(
    (activeToast) => (
      <div
        className={`flex items-center gap-3 rounded-lg bg-text-primary py-2.5 pl-3.5 pr-2 text-small text-white shadow-overlay ${
          activeToast.visible ? "animate-fade-in-up" : "opacity-0"
        }`}
        role="status"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4 flex-shrink-0 opacity-70" />
        <span className="max-w-[18rem] truncate">{message}</span>
        <button
          className="ui-focus inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => {
            onUndo();
            toast.dismiss(activeToast.id);
          }}
          type="button"
        >
          <Undo2 aria-hidden="true" className="h-3.5 w-3.5" />
          Undo
        </button>
      </div>
    ),
    { duration: UNDO_WINDOW_MS },
  );
}
