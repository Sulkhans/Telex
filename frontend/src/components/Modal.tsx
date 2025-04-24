import { useState, useEffect } from "react";
import Close from "../assets/close.svg?react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: Props) => {
  const [animationClass, setAnimationClass] = useState("scale-0 opacity-0");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimationClass("scale-100 opacity-100");
      }, 10);
    } else {
      setAnimationClass("scale-0 opacity-0");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-background/35 dark:bg-dark-background/65 transition-all">
      <div
        className={`w-full max-w-md mx-4 p-4 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border shadow transform transition-all duration-300 ${animationClass}`}
      >
        <div className="flex justify-between items-center mb-2">
          {title && <h3 className="font-medium">{title}</h3>}
          <button onClick={onClose}>
            <Close className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
