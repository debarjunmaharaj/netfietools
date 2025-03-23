
import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  Image as ImageIcon, 
  Type, 
  Download, 
  Brush, 
  Square, 
  Circle, 
  Trash2, 
  Undo, 
  Redo, 
  Sliders, 
  Sun,
  Copy
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const ImageEditor: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: '#f0f0f0',
        width: 800,
        height: 600,
      });
      
      fabricCanvasRef.current.on('object:modified', saveState);
      fabricCanvasRef.current.on('object:added', saveState);
      fabricCanvasRef.current.on('object:removed', saveState);
      
      // Initial state
      saveState();
      
      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, []);

  const saveState = () => {
    if (fabricCanvasRef.current) {
      const json = JSON.stringify(fabricCanvasRef.current.toJSON());
      setUndoStack(prev => [...prev, json]);
      setRedoStack([]);
    }
  };

  const undo = () => {
    if (undoStack.length > 1 && fabricCanvasRef.current) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(prev => prev.slice(0, -1));
      
      fabricCanvasRef.current.loadFromJSON(previousState, () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && fabricCanvasRef.current) {
      const nextState = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, nextState]);
      setRedoStack(prev => prev.slice(0, -1));
      
      fabricCanvasRef.current.loadFromJSON(nextState, () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && fabricCanvasRef.current) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result && fabricCanvasRef.current) {
          fabric.Image.fromURL(event.target.result.toString(), (img) => {
            // Scale image to fit canvas while maintaining aspect ratio
            const canvas = fabricCanvasRef.current;
            if (!canvas) return;
            
            const canvasWidth = canvas.width || 800;
            const canvasHeight = canvas.height || 600;
            
            const imgWidth = img.width || 0;
            const imgHeight = img.height || 0;
            
            const scaleX = canvasWidth / imgWidth;
            const scaleY = canvasHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY);
            
            img.scale(scale);
            img.set({
              originX: 'center',
              originY: 'center',
              left: canvasWidth / 2,
              top: canvasHeight / 2,
            });
            
            // Clear existing canvas
            canvas.clear();
            canvas.add(img);
            setHasImage(true);
            saveState();
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.IText('Double-click to edit', {
        left: 200,
        top: 200,
        fill: '#000000',
        fontFamily: 'Arial',
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      saveState();
    }
  };

  const addRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new fabric.Rect({
        left: 200,
        top: 200,
        fill: '#4ade80',
        width: 100,
        height: 100,
        opacity: 0.7,
      });
      
      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.setActiveObject(rect);
      saveState();
    }
  };

  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        left: 200,
        top: 200,
        fill: '#60a5fa',
        radius: 50,
        opacity: 0.7,
      });
      
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
      saveState();
    }
  };

  const drawMode = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = !fabricCanvasRef.current.isDrawingMode;
      
      if (fabricCanvasRef.current.isDrawingMode) {
        fabricCanvasRef.current.freeDrawingBrush.width = 5;
        fabricCanvasRef.current.freeDrawingBrush.color = '#000000';
        
        toast({
          title: "Draw Mode Activated",
          description: "Click and drag to draw on the canvas",
        });
      } else {
        toast({
          title: "Draw Mode Deactivated",
          description: "Selection mode active",
        });
      }
    }
  };

  const deleteSelectedObject = () => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.getActiveObject()) {
      fabricCanvasRef.current.remove(fabricCanvasRef.current.getActiveObject());
      saveState();
    }
  };

  const applyFilters = () => {
    if (fabricCanvasRef.current) {
      const objects = fabricCanvasRef.current.getObjects();
      objects.forEach(obj => {
        if (obj instanceof fabric.Image) {
          const image = obj as fabric.Image;
          image.filters = [
            new fabric.Image.filters.Brightness({ brightness: (brightness - 100) / 100 }),
            new fabric.Image.filters.Contrast({ contrast: contrast / 100 })
          ];
          image.applyFilters();
        }
      });
      fabricCanvasRef.current.renderAll();
    }
  };

  const downloadImage = () => {
    if (fabricCanvasRef.current && hasImage) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataURL;
      link.click();
      
      toast({
        title: "Image Downloaded",
        description: "Your edited image has been downloaded",
      });
    } else {
      toast({
        title: "No Image to Download",
        description: "Please upload an image first",
        variant: "destructive",
      });
    }
  };

  const duplicateSelectedObject = () => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.getActiveObject()) {
      const activeObject = fabricCanvasRef.current.getActiveObject();
      
      if (activeObject) {
        activeObject.clone((cloned: fabric.Object) => {
          cloned.set({
            left: (activeObject.left || 0) + 20,
            top: (activeObject.top || 0) + 20,
            evented: true,
          });
          
          fabricCanvasRef.current?.add(cloned);
          fabricCanvasRef.current?.setActiveObject(cloned);
          saveState();
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-4">Image Editor</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button onClick={drawMode} size="sm" variant="outline">
                  <Brush className="h-4 w-4 mr-2" />
                  Draw
                </Button>
                
                <Button onClick={addText} size="sm" variant="outline">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
                
                <Button onClick={addRectangle} size="sm" variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                
                <Button onClick={addCircle} size="sm" variant="outline">
                  <Circle className="h-4 w-4 mr-2" />
                  Circle
                </Button>
                
                <Button onClick={duplicateSelectedObject} size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                
                <Button onClick={deleteSelectedObject} size="sm" variant="outline" className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30">
                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                  Delete
                </Button>
                
                <Button onClick={undo} size="sm" variant="outline" disabled={undoStack.length <= 1}>
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                
                <Button onClick={redo} size="sm" variant="outline" disabled={redoStack.length === 0}>
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </Button>
                
                <Button onClick={downloadImage} size="sm" variant="outline" disabled={!hasImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center items-center p-4 h-[600px] overflow-auto bg-gray-100 dark:bg-gray-900">
              <canvas ref={canvasRef} />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <Tabs defaultValue="adjust">
              <TabsList className="w-full">
                <TabsTrigger value="adjust" className="flex-1">
                  <Sliders className="h-4 w-4 mr-2" />
                  Adjust
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="adjust" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">
                        <Sun className="h-4 w-4 inline mr-2" />
                        Brightness: {brightness}%
                      </Label>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={200}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                    </div>
                    <Slider
                      id="contrast"
                      min={0}
                      max={200}
                      step={1}
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                    />
                  </div>
                  
                  <Separator />
                  
                  <Button onClick={applyFilters} className="w-full" disabled={!hasImage}>
                    Apply Filters
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
