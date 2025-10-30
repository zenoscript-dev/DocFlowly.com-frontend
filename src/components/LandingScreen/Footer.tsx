import { FileText, Heart } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-gray-300 py-12 sm:py-16'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">Invoice & Sign</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The simplest invoice generator and contract signature platform for freelancers worldwide.
            </p>
            <p className="text-sm text-gray-500">
              Made with <Heart className="w-4 h-4 inline text-red-500" /> for freelancers
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/templates" className="hover:text-purple-400 transition-colors">Templates</a></li>
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
              <li><a href="/blog" className="hover:text-purple-400 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Invoice & Sign. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
