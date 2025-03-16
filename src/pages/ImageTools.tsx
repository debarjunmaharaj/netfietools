
import React from 'react';
import { Layout } from '@/components/Layout';
import { ToolsGrid } from '@/components/ToolsGrid';

const ImageTools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Image Tools</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform, enhance, and convert your images with our powerful suite of image editing tools.
          </p>
        </div>
        
        <ToolsGrid filter="image" />
      </div>
    </Layout>
  );
};

export default ImageTools;
