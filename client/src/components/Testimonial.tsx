interface TestimonialProps {
  quote: string;
  authorName: string;
  authorPosition: string;
}

const Testimonial = ({ quote, authorName, authorPosition }: TestimonialProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="text-yellow-400 flex">
          <i className="ri-star-fill"></i>
          <i className="ri-star-fill"></i>
          <i className="ri-star-fill"></i>
          <i className="ri-star-fill"></i>
          <i className="ri-star-fill"></i>
        </div>
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
      <div className="mt-4 flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">{authorName.charAt(0)}</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{authorName}</h3>
          <p className="text-xs text-gray-500">{authorPosition}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
