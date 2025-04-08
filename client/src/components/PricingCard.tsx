import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  isPopular?: boolean;
  onSelect: () => void;
}

const PricingCard = ({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  buttonVariant,
  isPopular = false,
  onSelect
}: PricingCardProps) => {
  return (
    <div className={`bg-white border ${isPopular ? 'border-primary-200' : 'border-gray-200'} rounded-lg shadow-sm divide-y divide-gray-200 relative`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            Popular
          </span>
        </div>
      )}
      <div className="p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">{title}</h2>
        <p className="mt-4 text-sm text-gray-500">{description}</p>
        <p className="mt-8">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          <span className="text-base font-medium text-gray-500">{period}</span>
        </p>
        <Button
          variant={buttonVariant}
          className={`mt-8 w-full ${buttonVariant === 'outline' ? 'bg-primary-50 border-primary-500 text-primary-600 hover:bg-primary-100' : ''}`}
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </div>
      <div className="pt-6 pb-8 px-6">
        <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex space-x-3">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
