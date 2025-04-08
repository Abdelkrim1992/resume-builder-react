import { cn } from "@/lib/utils";

interface FloatingResumeCardProps {
  className?: string;
}

const FloatingResumeCard = ({ className }: FloatingResumeCardProps) => {
  return (
    <div
      className={cn(
        "absolute left-0 bottom-0 -ml-24 mb-8 bg-white rounded-lg shadow-lg p-4 transform -rotate-6 w-64 transition-transform hover:rotate-0",
        className
      )}
      style={{ zIndex: 2 }}
    >
      <div className="bg-gray-100 rounded h-24 mb-3 flex items-center justify-center relative">
        <div className="w-full h-2 bg-gray-200 rounded absolute top-4 left-0"></div>
        <div className="w-1/2 h-2 bg-gray-200 rounded absolute top-8 left-0"></div>
        <div className="w-3/4 h-2 bg-gray-200 rounded absolute top-12 left-0"></div>
        <div className="w-2/3 h-2 bg-gray-200 rounded absolute top-16 left-0"></div>
      </div>
      <div className="flex items-center">
        <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0 mr-3"></div>
        <div className="flex-1">
          <div className="text-xs text-gray-500">Your Resume Website</div>
          <div className="text-xs text-blue-500 truncate">www.careerx.ai/resume/you</div>
        </div>
      </div>
      <div className="mt-2 flex justify-start">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <i className="ri-share-line mr-1"></i> Share
        </span>
      </div>
    </div>
  );
};

export default FloatingResumeCard;
