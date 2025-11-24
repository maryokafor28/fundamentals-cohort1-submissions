import { Github, Linkedin, Mail } from 'lucide-react';

/**
 * Footer Component
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} LegacyBridge. Built for Week 9 Challenge.
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Tech Stack */}
          <div className="text-sm text-gray-600">
            Built with React + TypeScript + Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}