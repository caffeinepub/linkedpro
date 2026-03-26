import { avatarInitials, personColor } from "../data/storage";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export default function Avatar({
  name = "",
  size = "md",
  className = "",
}: AvatarProps) {
  const safeName = name || "?";
  const color = personColor(safeName);
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${sizes[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {avatarInitials(safeName)}
    </div>
  );
}
