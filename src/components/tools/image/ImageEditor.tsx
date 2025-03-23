
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UploadCloud,
  Download,
  Loader2,
  Crop,
  RotateCcw,
  BrightnessIcon,
  Contrast,
  Image,
  Eraser,
  PaintBucket,
  Undo,
  Redo,
  Shuffle,
  Pencil,
  Type,
  Save,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Canvas, Rect, Circle, Path, IObjectOptions, Image as FabricImage } from 'fabric';

export const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [brightness, setBrightness] = useState<number[]>([100]);
  const [contrast, setContrast] = useState<number[]>([100]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new Canvas(canvasRef.current, {
        isDrawingMode: false,
        backgroundColor: '#f0f0f0',
      });
      
      // Set default canvas size
      fabricCanvasRef.current.setDimensions({
        width: 800,
        height: 600
      });
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result && fabricCanvasRef.current) {
          const imgSrc = event.target.result.toString();
          setOriginalImage(imgSrc);
          
          // Clear canvas
          fabricCanvasRef.current.clear();
          
          // Load image onto canvas
          const img = await new Promise<HTMLImageElement>((resolve) => {
            const image = new Image();
            image.src = imgSrc;
            image.onload = () => resolve(image);
          });
          
          const fabricImage = new FabricImage(img);
          
          // Scale image to fit canvas
          const canvasWidth = fabricCanvasRef.current.getWidth();
          const canvasHeight = fabricCanvasRef.current.getHeight();
          
          const scale = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
          ) * 0.8;
          
          fabricImage.scale(scale);
          
          // Center image
          fabricImage.set({
            left: canvasWidth / 2 - (img.width * scale) / 2,
            top: canvasHeight / 2 - (img.height * scale) / 2,
          });
          
          fabricCanvasRef.current.add(fabricImage);
          fabricCanvasRef.current.renderAll();
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error loading image:', error);
      toast({
        title: "Error",
        description: "Failed to load image. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    
    if (!fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.isDrawingMode = tool === 'draw';
    
    if (tool === 'draw' && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = activeColor;
      fabricCanvasRef.current.freeDrawingBrush.width = 3;
    }
  };

  const handleAddShape = (shape: 'circle' | 'rectangle') => {
    if (!fabricCanvasRef.current) return;
    
    const options: IObjectOptions = {
      left: 100,
      top: 100,
      fill: activeColor,
    };
    
    if (shape === 'rectangle') {
      const rect = new Rect({
        ...options,
        width: 100,
        height: 100,
      });
      fabricCanvasRef.current.add(rect);
    } else if (shape === 'circle') {
      const circle = new Circle({
        ...options,
        radius: 50,
      });
      fabricCanvasRef.current.add(circle);
    }
    
    fabricCanvasRef.current.renderAll();
  };

  const handleUndo = () => {
    if (fabricCanvasRef.current) {
      // Simple undo (not ideal, but works for demo)
      const objects = fabricCanvasRef.current.getObjects();
      if (objects.length > 0) {
        fabricCanvasRef.current.remove(objects[objects.length - 1]);
      }
    }
  };

  const handleClearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      if (originalImage) {
        // Reload the original image
        handleReloadImage();
      }
    }
  };

  const handleReloadImage = async () => {
    if (!originalImage || !fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.clear();
    
    try {
      const img = await new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.src = originalImage;
        image.onload = () => resolve(image);
      });
      
      const fabricImage = new FabricImage(img);
      
      // Scale image to fit canvas
      const canvasWidth = fabricCanvasRef.current.getWidth();
      const canvasHeight = fabricCanvasRef.current.getHeight();
      
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      ) * 0.8;
      
      fabricImage.scale(scale);
      
      // Center image
      fabricImage.set({
        left: canvasWidth / 2 - (img.width * scale) / 2,
        top: canvasHeight / 2 - (img.height * scale) / 2,
      });
      
      fabricCanvasRef.current.add(fabricImage);
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      console.error('Error reloading image:', error);
    }
  };

  const handleDownload = () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 0.8,
      });
      
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success!",
        description: "Image downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = () => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const imageObject = objects.find(obj => obj instanceof FabricImage);
    
    if (imageObject && imageObject instanceof FabricImage) {
      // Reset filters first
      imageObject.filters = [];
      
      // Apply brightness filter
      if (brightness[0] !== 100) {
        imageObject.filters.push({
          type: 'brightness',
          brightness: (brightness[0] - 100) / 100
        } as any);
      }
      
      // Apply contrast filter
      if (contrast[0] !== 100) {
        imageObject.filters.push({
          type: 'contrast',
          contrast: contrast[0] / 100
        } as any);
      }
      
      imageObject.applyFilters();
      fabricCanvasRef.current.renderAll();
    }
  };

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Image Editor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edit your images with powerful tools similar to Photoshop
          </p>
        </div>

        {!originalImage ? (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
            <div 
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer transition-colors hover:border-primary" 
              onClick={triggerFileInput}
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {isLoading ? (
                <Loader2 className="w-16 h-16 text-gray-400 mb-4 animate-spin" />
              ) : (
                <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                <Tabs defaultValue="tools">
                  <TabsList className="w-full">
                    <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
                    <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tools" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={activeTool === 'select' ? 'default' : 'outline'}
                        className="p-2 h-auto"
                        onClick={() => handleToolClick('select')}
                      >
                        <div className="flex flex-col items-center">
                          <Image size={20} />
                          <span className="text-xs mt-1">Select</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTool === 'draw' ? 'default' : 'outline'}
                        className="p-2 h-auto"
                        onClick={() => handleToolClick('draw')}
                      >
                        <div className="flex flex-col items-center">
                          <Pencil size={20} />
                          <span className="text-xs mt-1">Draw</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTool === 'eraser' ? 'default' : 'outline'}
                        className="p-2 h-auto"
                        onClick={() => handleToolClick('eraser')}
                      >
                        <div className="flex flex-col items-center">
                          <Eraser size={20} />
                          <span className="text-xs mt-1">Erase</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTool === 'text' ? 'default' : 'outline'}
                        className="p-2 h-auto"
                        onClick={() => handleToolClick('text')}
                      >
                        <div className="flex flex-col items-center">
                          <Type size={20} />
                          <span className="text-xs mt-1">Text</span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="p-2 h-auto"
                        onClick={() => handleAddShape('rectangle')}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 border-2 border-current"></div>
                          <span className="text-xs mt-1">Rect</span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="p-2 h-auto"
                        onClick={() => handleAddShape('circle')}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full border-2 border-current"></div>
                          <span className="text-xs mt-1">Circle</span>
                        </div>
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="color-picker">Color</Label>
                      <div className="flex mt-2">
                        <input
                          id="color-picker"
                          type="color"
                          value={activeColor}
                          onChange={(e) => setActiveColor(e.target.value)}
                          className="w-full h-10 cursor-pointer rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleUndo}
                      >
                        <Undo size={18} className="mr-1" />
                        Undo
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleClearCanvas}
                      >
                        <Eraser size={18} className="mr-1" />
                        Clear
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="adjust" className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="brightness-slider">Brightness</Label>
                        <span className="text-sm text-gray-500">{brightness[0]}%</span>
                      </div>
                      <Slider
                        id="brightness-slider"
                        min={0}
                        max={200}
                        step={1}
                        value={brightness}
                        onValueChange={setBrightness}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="contrast-slider">Contrast</Label>
                        <span className="text-sm text-gray-500">{contrast[0]}%</span>
                      </div>
                      <Slider
                        id="contrast-slider"
                        min={0}
                        max={200}
                        step={1}
                        value={contrast}
                        onValueChange={setContrast}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleReloadImage}
                    >
                      <RotateCcw size={18} className="mr-1" />
                      Reset Image
                    </Button>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleDownload}
                  >
                    <Save size={18} className="mr-2" />
                    Save Image
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                <div className="w-full overflow-auto">
                  <div className="min-h-[600px] flex items-center justify-center">
                    {isLoading ? (
                      <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                    ) : (
                      <canvas
                        ref={canvasRef}
                        className="border border-gray-200 dark:border-gray-700 max-w-full"
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
