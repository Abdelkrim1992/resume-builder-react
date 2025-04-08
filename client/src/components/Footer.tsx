import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <span className="text-2xl text-primary-600 mr-2">
                <i className="ri-robot-fill"></i>
              </span>
              <span className="font-bold text-gray-800 text-xl">
                CAREERX<span className="text-primary-600">.AI</span>
              </span>
            </div>
            <p className="text-gray-500 text-base">
              Creating professional resumes to help you land your dream job.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/resume-builder" className="text-base text-gray-500 hover:text-gray-900">
                      Resume Builder
                    </Link>
                  </li>
                  <li>
                    <Link href="/resume-score" className="text-base text-gray-500 hover:text-gray-900">
                      Resume Score
                    </Link>
                  </li>
                  <li>
                    <Link href="/cover-letter" className="text-base text-gray-500 hover:text-gray-900">
                      Cover Letter
                    </Link>
                  </li>
                  <li>
                    <Link href="/resume-jd-match" className="text-base text-gray-500 hover:text-gray-900">
                      JD Matching
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Partners
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      GDPR
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CareerX.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
