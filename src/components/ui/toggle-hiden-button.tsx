import { LuEyeOff, LuEye } from "react-icons/lu";
import { useAppStore } from "@/store/app.store";

export function ToggleHidenButton() {
  const { hideValues, toggleHideValues } = useAppStore();

  return (
    <button
      className="text-gray-400"
      onClick={toggleHideValues}
      title="Toggle hidden values"
    >
      {hideValues ? <LuEyeOff /> : <LuEye />}
    </button>
  );
}
