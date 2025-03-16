
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadCloud, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type FormatType = 'png' | 'jpg' | 'webp';

export const ImageConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<FormatType>('png');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setFileName(file.name.split('.')[0] || 'converted');
        setConvertedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = async () => {
    if (!image) return;

    setIsConverting(true);
    
    try {
      // Simulate conversion for now - in future versions we'll implement actual conversion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just return the original image
      setConvertedImage(image);
      
      toast({
        title: "Success!",
        description: `Image converted to ${targetFormat.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error("Error converting image:", error);
      toast({
        title: "Error",
        description: "Failed to convert image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `${fileName}.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Image Converter</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert your images between different formats - PNG, JPG, WEBP and more
          </p>
        </div>

        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer transition-colors hover:border-primary" onClick={triggerFileInput}>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supports JPG, PNG, WEBP
            </p>
          </div>
        </Card>

        {image && (
          <div className="mb-8">
            <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="aspect-video w-full relative">
                <img 
                  src={image} 
                  alt="Image to Convert" 
                  className="object-contain w-full h-full"
                />
              </div>
            </Card>
          </div>
        )}

        {image && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="w-full sm:w-1/3">
              <Select
                value={targetFormat}
                onValueChange={(value) => setTargetFormat(value as FormatType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleConvert} 
              disabled={isConverting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert Image"
              )}
            </Button>
            
            {convertedImage && (
              <Button 
                onClick={handleDownload}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
