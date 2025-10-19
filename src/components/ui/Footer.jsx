import { Facebook, Twitter, Linkedin } from 'lucide-react';
import logodark from '../../assets/logodark.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img className="h-20 w-full pr-60" src={logodark} alt="QAE Rankings Logo" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              India's most trusted college ranking platform, ensuring transparency, 
              credibility, and fair evaluation for better educational choices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://x.com/founderqae" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/founder-qae-70332238b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Application', href: '/application' },
                { name: 'Submission', href: '/submissions' },
                { name: 'FAQs', href: '/faqs' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Support</h3>
            <ul className="space-y-2">
              {[
                { name: 'Help Center', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
                { name: 'Methodology', href: '/methodology' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 QAE Rankings. All rights reserved. Empowering education through transparency.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;