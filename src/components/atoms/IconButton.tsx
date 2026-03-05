interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<NonNullable<IconButtonProps['variant']>, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export function IconButton({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  children,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
        transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASS[variant]}
      `}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
