import { useId } from "react";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  tone?: "danger" | "primary";
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
  tone = "danger",
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal describedBy={descriptionId} labelledBy={titleId} onClose={onCancel} role="alertdialog">
      <h2 className="text-h2 text-text-primary" id={titleId}>
        {title}
      </h2>
      <p className="mt-2 text-small text-text-secondary" id={descriptionId}>
        {description}
      </p>
      <div className="mt-6 flex justify-end gap-2.5">
        <button className="ui-button-secondary" onClick={onCancel} type="button">
          {cancelLabel}
        </button>
        <button
          className={tone === "danger" ? "ui-button-danger" : "ui-button-primary"}
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
