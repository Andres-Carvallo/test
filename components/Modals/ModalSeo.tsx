// components/Modal.tsx
import React from "react";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ showModal, onClose, children }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div
        className="bg-white  rounded-lg shadow-lg relative w-full max-w-xl mx-auto p-10"
        style={{ borderRadius: "var(--radius)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black md:hover:scale-125"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
