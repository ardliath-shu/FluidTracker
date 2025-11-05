export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="card dialog blue">
        <p>{message}</p>
        <div className="col">
          <div className="row">
            <button className="btn green w-100" onClick={onConfirm}>
              <i className="fas fa-check"></i> OK
            </button>
          </div>
          <div className="row">
            <button className="btn red w-100" onClick={onCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
