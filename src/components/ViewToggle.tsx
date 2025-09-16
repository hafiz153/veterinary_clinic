import { Grid, List } from "lucide-react";

export type ViewType = "card" | "list";

interface ViewToggleProps {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
}

export default function ViewToggle({ viewType, setViewType }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewType("list")}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewType === "list"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List size={16} />
        List
      </button>
      <button
        onClick={() => setViewType("card")}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewType === "card"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Grid size={16} />
        Cards
      </button>
    </div>
  );
}
