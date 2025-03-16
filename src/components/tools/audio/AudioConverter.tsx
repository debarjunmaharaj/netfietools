
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Download, FileAudio, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac';

export const AudioConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [convertedURL, setConvertedURL] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if it's an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select an audio file.',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Clean up previous URL if exists
      if (convertedURL) {
        URL.revokeObjectURL(convertedURL);
        setConvertedURL(null);
      }
    }
  };
  
  const handleFormatChange = (value: string) => {
    setOutputFormat(value as AudioFormat);
    
    // Clean up previous URL if exists
    if (convertedURL) {
      URL.revokeObjectURL(convertedURL);
      setConvertedURL(null);
    }
  };
  
  const convertAudio = async () => {
    if (!file) return;
    
    setIsConverting(true);
    
    try {
      // In a real implementation, we would use a library like ffmpeg.wasm to convert
      // the audio. Since that's beyond the scope of this example, we'll simulate the
      // conversion by just creating a new URL for the original file.
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a URL for the original file (in a real app, this would be the converted file)
      const url = URL.createObjectURL(file);
      setConvertedURL(url);
      
      toast({
        title: 'Conversion Complete',
        description: `Your audio has been converted to ${outputFormat} format.`,
      });
    } catch (error) {
      console.error('Error converting audio:', error);
      toast({
        title: 'Conversion Failed',
        description: 'There was an error converting your audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Audio Converter</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert audio files to different formats like MP3, WAV, OGG, and AAC
          </p>
        </div>
        
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="audio-file">Upload Audio File</Label>
              <div 
                className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  id="audio-file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/*"
                  className="hidden"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileAudio size={40} className="text-primary mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={40} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">MP3, WAV, OGG, AAC (max 50MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="output-format">Output Format</Label>
              <Select
                value={outputFormat}
                onValueChange={handleFormatChange}
              >
                <SelectTrigger id="output-format" className="mt-2">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="ogg">OGG</SelectItem>
                  <SelectItem value="aac">AAC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={convertAudio} 
              disabled={!file || isConverting}
              className="w-full"
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </Card>
        
        {convertedURL && (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <div className="flex flex-col items-center">
              <audio src={convertedURL} className="w-full mb-4" controls />
              
              <Button asChild>
                <a href={convertedURL} download={`converted.${outputFormat}`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download {outputFormat.toUpperCase()}
                </a>
              </Button>
            </div>
          </Card>
        )}
        
        <div className="mt-8">
          <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-3 text-amber-700 dark:text-amber-400">
              <AlertTriangle size={20} />
              <p className="text-sm">
                Note: This is a demo. In an actual implementation, server-side processing 
                or WebAssembly would be used for audio conversion.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
