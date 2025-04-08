import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to start your job search?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Create a professional resume in minutes and increase your chances of landing your dream job.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link href="/resume-builder">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/resume-score">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white bg-primary-800 hover:bg-primary-900 border-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="mx-auto rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <span className="text-lg text-gray-600">Job success image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
