import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Simple SVG illustration for visual appeal
const InvoiceIllustration = () => (
  <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
    <rect x="40" y="35" width="200" height="130" rx="16" fill="#e0edfa"/>
    <rect x="60" y="60" width="160" height="25" rx="6" fill="#a7cdfa"/>
    <rect x="60" y="95" width="120" height="15" rx="5" fill="#dde7f9"/>
    <rect x="60" y="120" width="90" height="8" rx="4" fill="#bdd3f6"/>
    <circle cx="190" cy="140" r="14" fill="#487be7"/>
  </svg>
);

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-20 py-14 md:py-28">
        
        {/* Left column - text */}
        <div className="w-full md:w-1/2 space-y-7">
          <span className="inline-block bg-blue-100 text-blue-900 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide mb-2">
            Next-Gen Billing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
            Effortless AI Invoicing & Insights
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Craft professional invoices, track payments, and get actionable financial insights—all powered by artificial intelligence, in one beautiful workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold text-base shadow-lg hover:bg-blue-800 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold text-base shadow-lg hover:bg-blue-800 transition-all"
              >
                Start Now
              </Link>
            )}
          </div>
          <div className="flex items-center mt-4 gap-3">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-800">
              Eassy to use and trusted by thousands of businesses worldwide
            </span>
          </div>
        </div>

        {/* Right column - illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <InvoiceIllustration />
        </div>
      </div>
    </section>
  );
};

export default Hero;
