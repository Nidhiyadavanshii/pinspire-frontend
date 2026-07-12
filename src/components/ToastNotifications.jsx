import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const TOAST_DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = TOAST_DURATION) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastNotifications toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

const typeStyles = {
  success: {
    border: '#c7f0da',
    bg: '#ffffff',
    icon: CheckCircle,
    iconColor: '#103c25',
  },
  error: {
    border: '#f5c6cb',
    bg: '#ffffff',
    icon: XCircle,
    iconColor: '#cc001f',
  },
  warning: {
    border: '#ffe8a1',
    bg: '#ffffff',
    icon: AlertTriangle,
    iconColor: '#cc001f',
  },
  info: {
    border: '#dadad3',
    bg: '#ffffff',
    icon: Info,
    iconColor: '#262622',
  },
};

function ToastItem({ toast, onRemove }) {
  const { id, message, type, duration } = toast;
  const style = typeStyles[type] || typeStyles.info;
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="pointer-events-auto w-full max-w-sm"
      style={{ fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
    >
      <div
        className="flex items-start gap-3 rounded-[16px] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
        style={{
          backgroundColor: style.bg,
          border: `1.5px solid ${style.border}`,
        }}
      >
        <div className="mt-0.5 shrink-0">
          <Icon size={18} color={style.iconColor} strokeWidth={2.2} />
        </div>
        <p
          className="flex-1 pt-0.5 text-[14px] font-medium leading-[1.4]"
          style={{ color: '#33332e' }}
        >
          {message ?? ''}
        </p>
        <button
          onClick={() => onRemove(id)}
          className="mt-0.5 shrink-0 rounded-full p-1 transition-colors duration-200 hover:bg-[#f6f6f3]"
          aria-label="Dismiss notification"
          style={{ color: '#91918c' }}
        >
          <X size={14} strokeWidth={2.4} />
        </button>
      </div>
    </motion.div>
  );
}

export default function ToastNotifications({ toasts = [], onRemove }) {
  const remove = onRemove || (() => {});
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 px-4 pb-6 sm:bottom-4 sm:items-end sm:px-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {(toasts ?? []).map((toast) => (
          <ToastItem key={toast?.id ?? Math.random()} toast={toast} onRemove={remove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
