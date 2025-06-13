import React from "react";

const ActionModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveButtonText = "Simpan",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onSave}>
            {saveButtonText}
          </button>
          <button className="button" onClick={onClose}>
            Batal
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ActionModal;
