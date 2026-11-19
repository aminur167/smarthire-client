import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  outline: 'border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600',
  ghost: 'hover:bg-gray-100 text-gray-600',
};

const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, type = 'button', className, ...props }) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      type={type}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
