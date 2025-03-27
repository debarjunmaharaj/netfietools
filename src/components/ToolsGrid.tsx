
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ImageIcon, 
  FileType, 
  FileAudio, 
  FileText, 
  MessageSquare, 
  Crop, 
  RefreshCw, 
  ScanText, 
  FileStack, 
  Mic, 
  VolumeX, 
  Edit3,
  Video,
  Scissors,
  Volume2,
  Music,
  BarChart,
  FileVideo,
  Languages,
  Code,
  Hash
} from 'lucide-react';

interface Tool {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  path: string;
  category: 'image' | 'audio' | 'text' | 'converter' | 'video';
}

const tools: Tool[] = [
  // Image tools
  {
    id: 'bg-remover',
    icon: <Crop size={24} />,
    name: 'Background Remover',
    description: 'Remove backgrounds from images with one click',
    path: '/image/background-remover',
    category: 'image',
  },
  {
    id: 'image-editor',
    icon: <Edit3 size={24} />,
    name: 'Image Editor',
    description: 'Edit images with a powerful Photoshop-like editor',
    path: '/image/editor',
    category: 'image',
  },
  {
    id: 'image-converter',
    icon: <RefreshCw size={24} />,
    name: 'Image Converter',
    description: 'Convert images between PNG, JPG, WEBP and more',
    path: '/image/converter',
    category: 'converter',
  },
  
  // Text tools
  {
    id: 'text-to-speech',
    icon: <MessageSquare size={24} />,
    name: 'Text to Speech',
    description: 'Convert text to natural speech in English and Bengali',
    path: '/text/text-to-speech',
    category: 'text',
  },
  {
    id: 'text-summarizer',
    icon: <ScanText size={24} />,
    name: 'Text Summarizer',
    description: 'Automatically summarize long articles and documents',
    path: '/text/summarizer',
    category: 'text',
  },
  {
    id: 'pdf-tools',
    icon: <FileStack size={24} />,
    name: 'PDF Tools',
    description: 'Merge, split, compress and convert PDF files',
    path: '/text/pdf-tools',
    category: 'text',
  },
  
  // Audio tools
  {
    id: 'audio-recorder',
    icon: <Mic size={24} />,
    name: 'Audio Recorder',
    description: 'Record high-quality audio using your microphone',
    path: '/audio/recorder',
    category: 'audio',
  },
  {
    id: 'audio-converter',
    icon: <RefreshCw size={24} />,
    name: 'Audio Converter',
    description: 'Convert audio files between MP3, WAV, OGG formats',
    path: '/audio/converter',
    category: 'audio',
  },
  {
    id: 'voice-changer',
    icon: <Volume2 size={24} />,
    name: 'Voice Changer',
    description: 'Apply fun effects to transform your voice',
    path: '/audio/voice-changer',
    category: 'audio',
  },
  
  // Video tools
  {
    id: 'video-editor',
    icon: <Video size={24} />,
    name: 'Video Editor',
    description: 'Trim, cut, and enhance your video content',
    path: '/video/editor',
    category: 'video',
  },
  
  // Additional tools - these would be implemented in future
  {
    id: 'ai-image-generator',
    icon: <ImageIcon size={24} />,
    name: 'AI Image Generator',
    description: 'Create original images using AI models',
    path: '/image/ai-generator',
    category: 'image',
  },
  {
    id: 'audio-enhancer',
    icon: <Music size={24} />,
    name: 'Audio Enhancer',
    description: 'Improve audio quality by reducing noise and enhancing clarity',
    path: '/audio/enhancer',
    category: 'audio',
  },
  {
    id: 'subtitle-generator',
    icon: <FileText size={24} />,
    name: 'Subtitle Generator',
    description: 'Automatically generate subtitles for video content',
    path: '/video/subtitle-generator',
    category: 'video',
  },
  {
    id: 'code-formatter',
    icon: <Code size={24} />,
    name: 'Code Formatter',
    description: 'Format and beautify code in various programming languages',
    path: '/text/code-formatter',
    category: 'text',
  },
  {
    id: 'language-translator',
    icon: <Languages size={24} />,
    name: 'Language Translator',
    description: 'Translate text between multiple languages',
    path: '/text/translator',
    category: 'text',
  },
];

interface ToolsGridProps {
  filter?: string;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ filter }) => {
  const filteredTools = filter 
    ? tools.filter(tool => tool.category === filter)
    : tools;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTools.map((tool) => (
        <Link key={tool.id} to={tool.path} className="tool-card animate-fade-up">
          <div className="p-6">
            <div className="tool-icon">
              {tool.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
