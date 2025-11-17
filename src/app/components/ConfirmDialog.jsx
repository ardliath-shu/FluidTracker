export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <dialog className="card dialog blue">
        <p>{message}</p>
        <div className="col">
          <div className="row">
            <button className="btn blue w-100" onClick={onConfirm}>
              <i className="fas fa-check"></i> OK
            </button>
          </div>
          <div className="row">
            <button className="btn red w-100" onClick={onCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
