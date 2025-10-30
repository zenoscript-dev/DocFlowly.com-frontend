import { Check, Crown, Heart, Zap } from 'lucide-react';
import React from 'react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      icon: Heart,
      color: 'from-green-500 to-green-600',
      description: 'Perfect for trying out our platform',
      features: [
        'Create unlimited invoices',
        'Generate PDF documents',
        'Basic templates',
        'Digital signatures',
        'Export to PDF',
        'Data privacy guaranteed',
      ],
      cta: 'Get Started Free',
      ctaLink: '/templates',
    },
    {
      name: 'Professional',
      price: '$9',
      period: 'per month',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      description: 'Everything you need to grow your freelance business',
      popular: true,
      features: [
        'Everything in Starter',
        'Unlimited templates',
        'Custom branding',
        'Custom template designer access',
        'Client management',
        'Recurring invoices',
        'Priority support',
        'Advanced analytics',
        'API access (coming soon)',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/signup',
    },
    {
      name: 'Enterprise',
      price: '$29',
      period: 'per month',
      icon: Crown,
      color: 'from-indigo-500 to-indigo-600',
      description: 'For teams and agencies',
      features: [
        'Everything in Professional',
        'Team collaboration',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security',
        'Custom SLA',
        'White-label option',
        'API webhooks',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 lg:py-36 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Pricing for Everyone
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your business. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular
                  ? 'border-purple-500 scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              30-day money-back guarantee • Cancel anytime • No credit card required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

