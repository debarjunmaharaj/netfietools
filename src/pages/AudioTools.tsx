
import React from 'react';
import { Layout } from '@/components/Layout';
import { ToolsGrid } from '@/components/ToolsGrid';

const AudioTools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Audio Tools</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Edit, enhance, and convert your audio files with our comprehensive suite of audio tools.
          </p>
        </div>
        
        <ToolsGrid filter="audio" />
      </div>
    </Layout>
  );
};

export default AudioTools;
