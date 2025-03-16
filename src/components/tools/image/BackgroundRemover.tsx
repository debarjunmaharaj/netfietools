
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UploadCloud, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const BackgroundRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
        setOriginalImage(event.target.result as string);
        setProcessedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    try {
      // Simulate processing for now - in future versions we'll implement actual background removal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, just return the original image
      setProcessedImage(originalImage);
      
      toast({
        title: "Success!",
        description: "Background removed successfully.",
      });
    } catch (error) {
      console.error("Error removing background:", error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed-background.png';
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
          <h1 className="text-3xl font-bold mb-2 gradient-text">Background Remover</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Remove the background from any image with one click
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

        {originalImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="aspect-square w-full relative">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="object-contain w-full h-full"
                />
                <div className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded text-xs font-medium">
                  Original
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="aspect-square w-full relative flex items-center justify-center bg-[url('/placeholder.svg')] bg-center bg-repeat">
                {processedImage ? (
                  <>
                    <img 
                      src={processedImage} 
                      alt="Processed" 
                      className="object-contain w-full h-full"
                    />
                    <div className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded text-xs font-medium">
                      Result
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 p-6">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <p>Processing...</p>
                      </div>
                    ) : (
                      <p>Result will appear here</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {originalImage && !isProcessing && !processedImage && (
            <Button 
              onClick={handleRemoveBackground} 
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>
          )}
          
          {processedImage && (
            <Button 
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
