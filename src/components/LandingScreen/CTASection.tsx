import { ArrowRight, Check } from 'lucide-react';
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 lg:py-36 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl sm:text-2xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Join thousands of freelancers who are already using our platform to run their business smarter.
          </p>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/templates"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Create Your First Invoice
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/signin"
              className="inline-flex items-center gap-2 px-10 py-5 bg-purple-700/50 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-purple-700/70 backdrop-blur-sm transition-all duration-300"
            >
              Sign In
            </a>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Check className="w-8 h-8 text-green-300" />
              <span className="text-white font-medium">100% Free</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Check className="w-8 h-8 text-green-300" />
              <span className="text-white font-medium">No Credit Card</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Check className="w-8 h-8 text-green-300" />
              <span className="text-white font-medium">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
