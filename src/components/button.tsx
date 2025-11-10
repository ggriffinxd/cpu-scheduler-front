interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  bgColor?: string;
  height?: string;
  width?: string;
  radius?: string;
}

export function Button({
  children,
  onClick,
  className = "",
  bgColor = "bg-transparent",
  height = "11",
  width = "20",
  radius = "full",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer flex h-${height} w-${width} items-center justify-center rounded-${radius} ${bgColor} transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
