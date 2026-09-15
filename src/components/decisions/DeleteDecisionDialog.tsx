import type { Decision } from "../../types/decision";

type DeleteDecisionDialogProps = { decision: Decision; onCancel: () => void; onConfirm: () => void };

export function DeleteDecisionDialog({ decision, onCancel, onConfirm }: DeleteDecisionDialogProps) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-text-primary/40 px-page">
      <section aria-modal="true" className="w-full max-w-md rounded border border-border bg-surface p-6 shadow-lg" role="dialog">
        <h2 className="text-lg font-semibold">Delete this decision?</h2>
        <p className="mt-2 text-sm text-text-secondary">This will remove “{decision.text}”. This can&apos;t be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity hover:opacity-70" onClick={onCancel} type="button">Cancel</button>
          <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90" onClick={onConfirm} type="button">Delete decision</button>
        </div>
      </section>
    </div>
  );
}
