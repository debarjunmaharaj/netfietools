
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b border-border">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://netfie.com/wp-content/uploads/2025/03/Netfie__1_-removebg-preview-450x174.png.webp" 
            alt="Netfie Logo" 
            className="h-10 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Home
          </Link>
          <Link 
            to="/image" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Image Tools
          </Link>
          <Link 
            to="/video" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Video Tools
          </Link>
          <Link 
            to="/audio" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Audio Tools
          </Link>
          <Link 
            to="/text" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Text Tools
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/contact"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:bg-primary/90"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};
