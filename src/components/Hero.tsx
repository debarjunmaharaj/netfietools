
import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-80"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            All-in-One Digital Tools Suite
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
            Transform your digital content with our powerful tools. Edit images, convert files, 
            generate speech, and much more - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/image/background-remover"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Remove Image Background
            </Link>
            <Link
              to="/text/text-to-speech"
              className="bg-white hover:bg-gray-50 text-primary border border-primary px-6 py-3 rounded-lg font-medium transition-all"
            >
              Text to Speech
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
