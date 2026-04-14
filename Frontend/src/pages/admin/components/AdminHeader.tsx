import { Button } from "@/Components/ui/button";
import { useSelector } from "react-redux";
import DemoBanner from "./DemoBanner";

interface AdminHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * Reusable Header component for Admin pages.
 */
export default function AdminHeader({
  title,
  description,
  buttonText,
  onButtonClick
}: AdminHeaderProps) {
  const { userInfo } = useSelector((state: any) => state.auth);

  return (
    <div className="flex flex-col mb-6">
      {/* Conditionally show Demo Banner */}
      {userInfo?.isDemo && <DemoBanner />}

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[22px] font-bold text-[var(--text)] leading-tight">
            {title}
          </h2>
          <p className="text-[13px] text-[var(--text2)] mt-1">
            {description}
          </p>
        </div>

        {buttonText && onButtonClick && (
          <Button
            size="sm"
            onClick={onButtonClick}
            className="bg-a hover:bg-a/90 text-white px-4 h-[36px] rounded-lg shadow-[0_4px_14px_var(--ag)] hover:-translate-y-0.5 transition-all"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
