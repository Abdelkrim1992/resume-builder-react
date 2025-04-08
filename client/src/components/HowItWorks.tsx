interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="text-center">
    <div className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
      <span className="text-primary-600 text-3xl font-bold">{number}</span>
    </div>
    <h3 className="mt-6 text-xl font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-base text-gray-500">
      {description}
    </p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-heading">
            Build your resume in 3 easy steps
          </p>
          <p className="section-subheading">
            Our streamlined process helps you create a professional resume quickly and easily.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Step 
              number={1}
              title="Choose a template"
              description="Select from our collection of professional templates designed for various industries and career levels."
            />
            <Step 
              number={2}
              title="Add your details"
              description="Fill in your information with our guided builder, or let our AI help you craft compelling content."
            />
            <Step 
              number={3}
              title="Download and share"
              description="Export your resume in your preferred format, and optionally create a shareable online version."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
