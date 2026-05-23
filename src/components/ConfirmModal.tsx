import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop/Overlay with soft blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[#fbfaf6] rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden border border-neutral-300 relative z-10 p-6 flex flex-col gap-4 text-center items-center"
          >
            {/* Warning Icon Circle */}
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100/50 shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>

            {/* Title & Message */}
            <div className="flex flex-col gap-1.5 w-full">
              <h3 className="text-lg font-bold text-neutral-800 tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
                {title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans px-2">
                {message}
              </p>
            </div>

            {/* Confirm & Cancel Buttons */}
            <div className="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                id="btn-confirm-cancel"
                onClick={onCancel}
                className="flex-1 py-2 px-3 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
              >
                {cancelText}
              </button>
              <button
                type="button"
                id="btn-confirm-ok"
                onClick={onConfirm}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-700 text-xs font-semibold text-white active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-rose-900/10 min-h-[44px]"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
