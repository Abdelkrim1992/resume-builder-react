import { Link } from "wouter";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  learnMoreLink: string;
}

const FeatureCard = ({ title, description, icon, iconBgColor, learnMoreLink }: FeatureCardProps) => {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className={`feature-icon ${iconBgColor}`}>
        <i className={icon}></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900 pt-4">{title}</h3>
      <p className="mt-2 text-base text-gray-500">
        {description}
      </p>
      <div className="mt-4">
        <Link href={learnMoreLink} className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center">
          Learn more
          <i className="ri-arrow-right-line ml-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
