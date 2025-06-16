// src/utils/toast.ts
import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  /**
   * Toast de éxito - Verde
   */
  success: ({ title, description, duration = 4000, action }: ToastOptions) => {
    return toast.success(title, {
      description,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      className: 'toast-success',
      style: {
        background: 'hsl(var(--background))',
        border: '1px solid hsl(142 76% 36%)',
        borderLeft: '4px solid hsl(142 76% 36%)',
        color: 'hsl(var(--foreground))',
      },
    });
  },

  /**
   * Toast de error - Rojo
   */
  error: ({ title, description, duration = 5000, action }: ToastOptions) => {
    return toast.error(title, {
      description,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      className: 'toast-error',
      style: {
        background: 'hsl(var(--background))',
        border: '1px solid hsl(0 84% 60%)',
        borderLeft: '4px solid hsl(0 84% 60%)',
        color: 'hsl(var(--foreground))',
      },
    });
  },

  /**
   * Toast de advertencia - Amarillo/Naranja
   */
  warning: ({ title, description, duration = 4500, action }: ToastOptions) => {
    return toast.warning(title, {
      description,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      className: 'toast-warning',
      style: {
        background: 'hsl(var(--background))',
        border: '1px solid hsl(38 92% 50%)',
        borderLeft: '4px solid hsl(38 92% 50%)',
        color: 'hsl(var(--foreground))',
      },
    });
  },

  /**
   * Toast informativo - Azul
   */
  info: ({ title, description, duration = 4000, action }: ToastOptions) => {
    return toast.info(title, {
      description,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      className: 'toast-info',
      style: {
        background: 'hsl(var(--background))',
        border: '1px solid hsl(221 83% 53%)',
        borderLeft: '4px solid hsl(221 83% 53%)',
        color: 'hsl(var(--foreground))',
      },
    });
  },

  /**
   * Toast de carga con promise
   */
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      className: 'toast-promise',
    });
  },

//   /**
//    * Toast personalizado con JSX
//    */
//   custom: (jsx: React.ReactNode, options?: { duration?: number }) => {
//     return toast.custom(jsx, {
//       duration: options?.duration || 4000,
//     });
//   },

  /**
   * Función para cerrar todos los toasts
   */
  dismiss: () => {
    toast.dismiss();
  },

  /**
   * Función para cerrar un toast específico
   */
  dismissById: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

// Versión con estilos más llamativos (gradientes)
export const showToastStyled = {
  success: ({ title, description, duration = 4000, action }: ToastOptions) => {
    return toast.success(title, {
      description,
      duration,
      action,
      className: 'toast-success-styled',
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.25)',
      },
    });
  },

  error: ({ title, description, duration = 5000, action }: ToastOptions) => {
    return toast.error(title, {
      description,
      duration,
      action,
      className: 'toast-error-styled',
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.25)',
      },
    });
  },

  warning: ({ title, description, duration = 4500, action }: ToastOptions) => {
    return toast.warning(title, {
      description,
      duration,
      action,
      className: 'toast-warning-styled',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)',
      },
    });
  },

  info: ({ title, description, duration = 4000, action }: ToastOptions) => {
    return toast.info(title, {
      description,
      duration,
      action,
      className: 'toast-info-styled',
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
      },
    });
  },
};