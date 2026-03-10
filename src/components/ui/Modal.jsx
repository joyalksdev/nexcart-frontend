import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: Closes modal on click */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-black text-(--text) tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-(--primary) transition-colors"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="text-(--text-muted)">{children}</div>
      </div>
    </div>
  );
};

export default Modal;