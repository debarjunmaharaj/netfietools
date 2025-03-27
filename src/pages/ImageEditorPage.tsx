
import React from 'react';
import { Layout } from '@/components/Layout';
import { ImageEditor } from '@/components/tools/image/ImageEditor';

const ImageEditorPage = () => {
  return (
    <Layout>
      <div className="py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <ImageEditor />
      </div>
    </Layout>
  );
};

export default ImageEditorPage;
