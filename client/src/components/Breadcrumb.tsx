import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const labelMap: Record<string, string> = {
  details: "Details",
  checkout: "Checkout",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Split and filter segments
  const parts = pathname.split("/").filter(Boolean);

  // Don’t show anything on home
  if (parts.length === 0) return null;

  

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">{parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}</span>
      </button>
    </div>
  );
}
