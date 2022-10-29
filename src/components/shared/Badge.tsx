import { PADDING, ROUNDED } from "../design";

interface BadgeProps {
  text: string;
  type?: "success" | "danger" | "warning";
  backgroundColor?: string;
  color?: string;
}

const Badge = ({ text, backgroundColor, color, type }: BadgeProps) => {
  return (
    <span
      className={` text-[10px] font-semibold border py-0.5 px-2 rounded-full ${
        backgroundColor ?? type === "success"
          ? "bg-green-200 dark:bg-green-800"
          : type === "danger"
          ? "bg-red-200 dark:bg-red-800"
          : type === "warning"
          ? "bg-amber-200 dark:bg-amber-800"
          : "bg-primaryLight dark:bg-primaryDark"
      } ${
        color ?? type === "success"
          ? "text-success border-success"
          : type === "danger"
          ? "text-danger border-danger"
          : type === "warning"
          ? "text-warning border-warning"
          : "text-primary border-primary"
      } `}
    >
      {text}
    </span>
  );
};

export default Badge;
