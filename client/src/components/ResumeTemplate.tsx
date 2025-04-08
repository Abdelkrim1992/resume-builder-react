import { Button } from "@/components/ui/button";

interface ResumeTemplateProps {
  name: string;
  description: string;
  isPremium: boolean;
  onSelect: () => void;
}

const ResumeTemplate = ({ name, description, isPremium, onSelect }: ResumeTemplateProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="p-2 bg-gray-100 h-64 flex items-center justify-center">
        {/* Template preview - using a placeholder div with centered template name */}
        <div className="border border-gray-200 bg-white w-3/4 h-3/4 flex items-center justify-center">
          <span className="text-gray-700 font-medium">{name}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="badge badge-success">
            ATS-Friendly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="text-primary-600 border-primary-600 hover:bg-primary-50"
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
