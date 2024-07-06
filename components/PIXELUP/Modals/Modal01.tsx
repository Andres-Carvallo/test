import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal01: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <button
          onClick={onClose}
          className="mb-4"
        >
          Cerrar
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal01;
