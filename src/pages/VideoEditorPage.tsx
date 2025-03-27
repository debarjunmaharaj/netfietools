
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoEditor } from '@/components/tools/video/VideoEditor';

const VideoEditorPage = () => {
  return (
    <Layout>
      <div className="pb-8">
        <VideoEditor />
      </div>
    </Layout>
  );
};

export default VideoEditorPage;
