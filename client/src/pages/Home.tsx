import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import FloatingResumeCard from "@/components/ui/floating-resume-card";
import FloatingJobCard from "@/components/ui/floating-job-card";
import SocialShare from "@/components/ui/social-share";
import FeatureCard from "@/components/FeatureCard";
import HowItWorks from "@/components/HowItWorks";
import ResumeTemplate from "@/components/ResumeTemplate";
import Testimonial from "@/components/Testimonial";
import PricingCard from "@/components/PricingCard";
import CTASection from "@/components/CTASection";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Import SVG images
import heroIllustration from "@/assets/images/hero-illustration.svg";
import featuresIllustration from "@/assets/images/features-illustration.svg";
import scoreIllustration from "@/assets/images/score-illustration.svg";
import resumeTemplatePreview from "@/assets/images/resume-template-preview.svg";

const Home = () => {
  const { toast } = useToast();
  
  const { data: templates } = useQuery<any[]>({
    queryKey: ['/api/templates'],
  });

  const handleTemplateSelect = () => {
    toast({
      title: "Template selected",
      description: "Please sign up or log in to continue building your resume.",
    });
  };

  const handlePricingSelect = (plan: string) => {
    toast({
      title: `${plan} plan selected`,
      description: "Please sign up or log in to continue with this plan.",
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-primary-800 mb-4">
                THE #1 RESUME BUILDER
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Create a Job-Ready</span>
                <span className="block text-primary-600">Resume in Minutes</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Create your resume easily with our free builder and professional templates.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/resume-builder">
                      <Button size="lg" className="w-full">
                        Build My Resume
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6">
              <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={heroIllustration} 
                  alt="Resume Builder Illustration" 
                  className="w-full h-auto"
                />
                
                {/* Floating Resume Card */}
                <FloatingResumeCard />
                
                {/* Floating Job Card */}
                <FloatingJobCard />
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <SocialShare />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="section-title">Features</h2>
            <p className="section-heading">
              Everything you need to land your dream job
            </p>
            <p className="section-subheading">
              Our AI-powered platform helps you create professional resumes, cover letters, and optimize your job applications.
            </p>
          </div>

          <div className="mt-10 mb-16">
            <div className="flex justify-center">
              <img 
                src={featuresIllustration} 
                alt="Resume Builder Features" 
                className="max-w-full h-auto"
              />
            </div>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="AI Resume Builder"
                description="Create professional resumes in minutes with our AI-powered builder, featuring multiple templates and formats."
                icon="ri-file-list-3-line"
                iconBgColor="bg-primary-500"
                learnMoreLink="/resume-builder"
              />
              <FeatureCard
                title="Resume Scoring"
                description="Get instant feedback on how your resume stacks up against industry standards and ATS requirements."
                icon="ri-line-chart-line"
                iconBgColor="bg-secondary-500"
                learnMoreLink="/resume-score"
              />
              <FeatureCard
                title="Cover Letter Generator"
                description="Generate compelling cover letters tailored to specific job descriptions and your unique experience."
                icon="ri-file-text-line"
                iconBgColor="bg-green-500"
                learnMoreLink="/cover-letter"
              />
              <FeatureCard
                title="JD Matching"
                description="Compare your resume to job descriptions to identify gaps and optimize your application for each position."
                icon="ri-search-line"
                iconBgColor="bg-purple-500"
                learnMoreLink="/resume-jd-match"
              />
              <FeatureCard
                title="Export Options"
                description="Download your resume in multiple formats including PDF, DOCX, and create a shareable online version."
                icon="ri-download-cloud-line"
                iconBgColor="bg-yellow-500"
                learnMoreLink="/resume-builder"
              />
              <FeatureCard
                title="Template Library"
                description="Choose from dozens of professionally designed templates that are proven to get results."
                icon="ri-palette-line"
                iconBgColor="bg-red-500"
                learnMoreLink="/resume-builder"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Score Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="section-title">Resume Score</h2>
              <p className="section-heading">
                Know where your resume stands
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Our AI-powered scoring system evaluates your resume across multiple dimensions, including ATS compatibility, 
                content quality, formatting, and keyword optimization.
              </p>
              <div className="mt-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <strong className="font-medium text-gray-700">Detailed Analysis:</strong> Get scores across key categories like content, formatting, and readability.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <strong className="font-medium text-gray-700">Actionable Suggestions:</strong> Receive specific recommendations to improve your score.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <strong className="font-medium text-gray-700">Industry Benchmarks:</strong> See how your resume compares to successful candidates in your field.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/resume-score">
                  <Button className="w-full sm:w-auto">
                    Score My Resume
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="flex justify-center">
                <img 
                  src={scoreIllustration} 
                  alt="Resume Score Analysis" 
                  className="max-w-full h-auto rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Templates Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Templates</h2>
            <p className="section-heading">
              Professional resume templates
            </p>
            <p className="section-subheading">
              Choose from our collection of ATS-friendly templates designed to help you land your dream job.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates ? (
                templates.slice(0, 3).map((template) => (
                  <ResumeTemplate
                    key={template.id}
                    name={template.name}
                    description={template.description}
                    isPremium={template.isPremium}
                    onSelect={handleTemplateSelect}
                  />
                ))
              ) : (
                // Placeholder templates if data is not loaded
                Array(3).fill(0).map((_, index) => (
                  <ResumeTemplate
                    key={index}
                    name={["Modern Professional", "Creative Minimal", "Executive Classic"][index]}
                    description={[
                      "A clean, modern design suitable for most industries.",
                      "Perfect for creative industries and design roles.",
                      "Traditional design perfect for executive and management roles."
                    ][index]}
                    isPremium={index !== 0}
                    onSelect={handleTemplateSelect}
                  />
                ))
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/resume-builder" className="inline-flex items-center text-base font-medium text-primary-600 hover:text-primary-500">
              View all templates
              <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Testimonials</h2>
            <p className="section-heading">
              Success stories from our users
            </p>
            <p className="section-subheading">
              Hear from professionals who landed their dream jobs with CareerX.AI.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Testimonial
                quote="After months of job searching with no luck, I used CareerX.AI to rebuild my resume. Within two weeks, I had three interviews and landed my dream job at a tech company."
                authorName="Sarah Johnson"
                authorPosition="Software Developer"
              />
              <Testimonial
                quote="The Resume Score feature helped me identify weaknesses in my resume that I never would have noticed. After making the suggested improvements, my response rate from employers doubled."
                authorName="David Martinez"
                authorPosition="Marketing Manager"
              />
              <Testimonial
                quote="The AI-generated cover letter saved me so much time and anxiety. It perfectly highlighted my experience in relation to the job description, and I'm convinced it's what got me the interview."
                authorName="Emma Wilson"
                authorPosition="Financial Analyst"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Pricing</h2>
            <p className="section-heading">
              Plans for every stage of your career
            </p>
            <p className="section-subheading">
              Choose the plan that fits your needs, from free basic services to premium career support.
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            <PricingCard
              title="Free"
              description="Great for getting started with your job search."
              price="$0"
              period="/month"
              features={[
                "1 resume template",
                "Basic resume builder",
                "PDF download",
                "Limited resume scoring"
              ]}
              buttonText="Start for free"
              buttonVariant="outline"
              onSelect={() => handlePricingSelect("Free")}
            />
            <PricingCard
              title="Premium"
              description="Perfect for serious job seekers who want to stand out."
              price="$12"
              period="/month"
              features={[
                "All free features",
                "20+ premium templates",
                "AI content suggestions",
                "Cover letter generator",
                "Advanced resume scoring",
                "Multiple formats (PDF, DOCX)"
              ]}
              buttonText="Get Premium"
              buttonVariant="default"
              isPopular={true}
              onSelect={() => handlePricingSelect("Premium")}
            />
            <PricingCard
              title="Pro"
              description="For career professionals who need comprehensive tools."
              price="$29"
              period="/month"
              features={[
                "All Premium features",
                "LinkedIn profile optimization",
                "JD matching analysis",
                "Interview preparation tools",
                "Career coach consultation",
                "Priority support"
              ]}
              buttonText="Get Pro"
              buttonVariant="outline"
              onSelect={() => handlePricingSelect("Pro")}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
};

export default Home;
