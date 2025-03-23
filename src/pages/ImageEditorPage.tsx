
import React from 'react';
import { Layout } from '@/components/Layout';
import { ImageEditor } from '@/components/tools/image/ImageEditor';

const ImageEditorPage = () => {
  return (
    <Layout>
      <div className="pb-8">
        <ImageEditor />
      </div>
    </Layout>
  );
};

export default ImageEditorPage;
