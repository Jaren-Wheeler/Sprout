import SproutModal from './SproutModal';

export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <SproutModal onClose={onCancel} level={60}>

      <div className="sprout-paper p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold text-amber-900">
          {title}
        </h2>

        <p className="text-amber-900/80">
          {message}
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="sprout-btn-muted px-4 py-2"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="sprout-btn-danger px-4 py-2"
          >
            {confirmText}
          </button>
        </div>

      </div>

    </SproutModal>
  );
}