import { Download, FileText, PenTool, Shield, Users, Zap } from 'lucide-react';
import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Invoice Generator',
      description: 'Create professional invoices in seconds. Add your logo, terms, and payment details. Export as PDF instantly.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: PenTool,
      title: 'Digital Signatures',
      description: 'Get clients to sign contracts digitally. Draw, upload, or type signatures. Legal and secure.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Download your documents as PDF, send via email, or share with a simple link. No cloud storage needed.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All processing happens in your browser. Your data never leaves your device. 100% privacy guaranteed.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No loading screens. No server delays. Everything happens instantly on your device. Work at the speed of thought.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Store client details, generate recurring invoices, and track all your contracts in one place.',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 lg:py-36 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Run Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Stop switching between tools. Create invoices, contracts, and signatures all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
