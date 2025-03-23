
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://netfie.com/wp-content/uploads/2025/03/Netfie__1_-removebg-preview-450x174.png.webp" 
                alt="Netfie Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All-in-one digital toolkit for your creative and productivity needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Image Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/image/background-remover" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Background Remover
                </Link>
              </li>
              <li>
                <Link to="/image/converter" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link to="/image/editor" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Image Editor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Audio Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/audio/recorder" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Audio Recorder
                </Link>
              </li>
              <li>
                <Link to="/audio/converter" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Audio Converter
                </Link>
              </li>
              <li>
                <Link to="/text/text-to-speech" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Text to Speech
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Netfie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
