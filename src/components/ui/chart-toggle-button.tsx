interface ChartToggleButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}

export const ChartToggleButton = ({
  onClick,
  isActive,
  icon,
}: ChartToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-2xl ${isActive ? "text-gray-900" : "text-gray-500"}`}
    >
      {icon}
    </button>
  );
};
