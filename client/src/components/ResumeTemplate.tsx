import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import resumeTemplatePreview from "@/assets/images/resume-template-preview.svg";

interface ResumeTemplateProps {
  name: string;
  description: string;
  isPremium: boolean;
  onSelect: () => void;
}

const ResumeTemplate = ({ name, description, isPremium, onSelect }: ResumeTemplateProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow transition-all duration-300 hover:shadow-lg">
      <div className="p-2 bg-gray-50 h-64 flex items-center justify-center">
        <img 
          src={resumeTemplatePreview} 
          alt={`${name} Template Preview`} 
          className="h-full object-contain"
        />
        {isPremium && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
              Premium
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ATS-Friendly
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="text-primary border-primary hover:bg-primary/10"
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
