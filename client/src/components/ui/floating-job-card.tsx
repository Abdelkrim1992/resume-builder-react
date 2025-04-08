import { cn } from "@/lib/utils";

interface FloatingJobCardProps {
  className?: string;
}

const FloatingJobCard = ({ className }: FloatingJobCardProps) => {
  return (
    <div
      className={cn(
        "absolute right-0 top-0 -mr-24 mt-24 bg-white rounded-lg shadow-lg p-4 transform rotate-6 w-64 transition-transform hover:rotate-0",
        className
      )}
      style={{ zIndex: 2 }}
    >
      <div className="flex items-center pb-2 border-b border-gray-100">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800">Dream Job</div>
          <div className="text-xs text-gray-500">Company Name</div>
        </div>
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <i className="ri-check-line text-green-500"></i>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          Full-time
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          Remote
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
          Product
        </span>
      </div>
      <div className="mt-3 h-2 bg-gray-100 rounded"></div>
      <div className="mt-2 h-2 bg-gray-100 rounded w-3/4"></div>
      <div className="mt-4 text-right">
        <span className="text-sm font-bold text-gray-800">$5,500</span>
      </div>
    </div>
  );
};

export default FloatingJobCard;
