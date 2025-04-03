
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Canvas, Rect, Circle, Triangle, Path, Group, Text, 
  Image as FabricImage, Object as FabricObject
} from 'fabric';
import { 
  Move, Pencil, Square, Circle as CircleIcon, Triangle as TriangleIcon, 
  Heart, Star, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  MessageCircle, Type, Image, Eraser, Trash2, Download, Undo, Redo,
  SlidersHorizontal, Copy, Scissors, RotateCw, Layers, Palette, Plus, Minus,
  Info, Save, Share, FileImage, Crop, FlipHorizontal, FlipVertical, Eye
} from 'lucide-react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { removeBackground, loadImage } from '@/utils/imageUtils';
import { Checkbox } from '@/components/ui/checkbox';

export const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [activeTab, setActiveTab] = useState<string>('tools');
  const [activeTool, setActiveTool] = useState<string>('select');
  const [fillColor, setFillColor] = useState<string>('#4338ca');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [fontWeight, setFontWeight] = useState<string>('normal');
  const [fontStyle, setFontStyle] = useState<string>('normal');
  const [textAlign, setTextAlign] = useState<string>('left');
  const [opacity, setOpacity] = useState<number>(100);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [showLayers, setShowLayers] = useState<boolean>(true);
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [zoom, setZoom] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgRemoverInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const { toast } = useToast();

  const addRectangle = () => {
    if (!fabricCanvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addTriangle = () => {
    if (!fabricCanvas) return;
    const triangle = new Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
    });
    fabricCanvas.add(triangle);
    fabricCanvas.setActiveObject(triangle);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addHeart = () => {
    if (!fabricCanvas) return;
    const heart = new Path('M 272.70141,238.71731 C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.1,
      scaleY: 0.1,
    });
    fabricCanvas.add(heart);
    fabricCanvas.setActiveObject(heart);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addStar = () => {
    if (!fabricCanvas) return;
    const star = new Path('M 250,500 L 396,643 L 342,463 L 488,348 L 304,348 L 250,163 L 196,348 L 12,348 L 158,463 L 104,643 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.2,
      scaleY: 0.2,
    });
    fabricCanvas.add(star);
    fabricCanvas.setActiveObject(star);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addArrowRight = () => {
    if (!fabricCanvas) return;
    const arrow = new Path('M 0,50 L 100,50 L 100,25 L 150,75 L 100,125 L 100,100 L 0,100 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    fabricCanvas.add(arrow);
    fabricCanvas.setActiveObject(arrow);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addArrowLeft = () => {
    if (!fabricCanvas) return;
    const arrow = new Path('M 150,50 L 50,50 L 50,25 L 0,75 L 50,125 L 50,100 L 150,100 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    fabricCanvas.add(arrow);
    fabricCanvas.setActiveObject(arrow);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addArrowUp = () => {
    if (!fabricCanvas) return;
    const arrow = new Path('M 75,0 L 25,50 L 50,50 L 50,150 L 100,150 L 100,50 L 125,50 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    fabricCanvas.add(arrow);
    fabricCanvas.setActiveObject(arrow);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addArrowDown = () => {
    if (!fabricCanvas) return;
    const arrow = new Path('M 75,150 L 125,100 L 100,100 L 100,0 L 50,0 L 50,100 L 25,100 z', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    fabricCanvas.add(arrow);
    fabricCanvas.setActiveObject(arrow);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addSpeechBubble = () => {
    if (!fabricCanvas) return;
    const speechBubble = new Path('M 75,0 A 75,75 0 1,0 75,150 A 75,75 0 1,0 75,0 z M 75,150 L 45,180 L 60,150', {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    fabricCanvas.add(speechBubble);
    fabricCanvas.setActiveObject(speechBubble);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new Text('Double click to edit', {
      left: 100,
      top: 100,
      fill: fillColor,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight as any,
      fontStyle: fontStyle as any,
      textAlign: textAlign as any,
      stroke: strokeColor,
      strokeWidth: strokeWidth / 10,
      opacity: opacity / 100,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    saveToUndoStack();
    fabricCanvas.renderAll();
    updateLayers();
  };

  const updateLayers = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    setLayers([...objects]);
  };

  const saveToUndoStack = () => {
    if (!fabricCanvas) return;
    const json = fabricCanvas.toJSON();
    setUndoStack(prev => [...prev, json]);
    setRedoStack([]);
    updateLayers();
  };

  const handleUndo = () => {
    if (!fabricCanvas || undoStack.length === 0) return;
    const currentState = fabricCanvas.toJSON();
    setRedoStack(prev => [...prev, currentState]);
    
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    fabricCanvas.loadFromJSON(previousState, () => {
      fabricCanvas.renderAll();
      updateLayers();
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || redoStack.length === 0) return;
    const currentState = fabricCanvas.toJSON();
    setUndoStack(prev => [...prev, currentState]);
    
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
      updateLayers();
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
      const imgData = ev.target?.result as string;
      
      // Fix: Update FabricImage.fromURL call to use the proper interface
      FabricImage.fromURL(imgData, {
        onComplete: (img) => {
          const maxDimension = 500;
          if (img.width && img.height) {
            if (img.width > maxDimension || img.height > maxDimension) {
              const scale = maxDimension / Math.max(img.width, img.height);
              img.scale(scale);
            }
          }
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.centerObject(img);
          saveToUndoStack();
          fabricCanvas.renderAll();
          setImageUploaded(true);
          toast({
            title: "Image added",
            description: "The image has been added to the canvas.",
          });
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBgRemovalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;
    
    setIsProcessing(true);
    toast({
      title: "Processing image",
      description: "Removing background... This may take a moment.",
    });
    
    try {
      const image = await loadImage(file);
      const processedBlob = await removeBackground(image);
      const url = URL.createObjectURL(processedBlob);
      
      // Fix: Update FabricImage.fromURL call to use the proper interface
      FabricImage.fromURL(url, {
        onComplete: (img) => {
          const maxDimension = 500;
          if (img.width && img.height) {
            if (img.width > maxDimension || img.height > maxDimension) {
              const scale = maxDimension / Math.max(img.width, img.height);
              img.scale(scale);
            }
          }
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.centerObject(img);
          saveToUndoStack();
          fabricCanvas.renderAll();
          setImageUploaded(true);
          toast({
            title: "Background removed",
            description: "The image has been added to the canvas with the background removed.",
          });
        }
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerBgRemoverInput = () => {
    bgRemoverInputRef.current?.click();
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      saveToUndoStack();
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      fabricCanvas.renderAll();
      setImageUploaded(false);
      setLayers([]);
      toast({
        title: "Canvas cleared",
        description: "The canvas has been cleared.",
      });
    }
  };

  const downloadImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      multiplier: 1,
      quality: 1,
    });
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'netfie-edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image downloaded",
      description: "Your edited image has been downloaded.",
    });
  };

  const cloneSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast({
        title: "No selection",
        description: "Please select an object to duplicate.",
        variant: "destructive",
      });
      return;
    }
    
    // Fix: Update the clone method call to match Fabric.js v6 API
    activeObject.clone((cloned: FabricObject) => {
      fabricCanvas.discardActiveObject();
      
      if (cloned.left !== undefined && cloned.top !== undefined) {
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10,
        });
      }
      
      if ('forEachObject' in cloned) {
        // Handle group objects
        const group = cloned as unknown as Group;
        group.forEachObject(function(obj: FabricObject) {
          fabricCanvas.add(obj);
        });
      } else {
        fabricCanvas.add(cloned);
      }
      
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();
      saveToUndoStack();
    });
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast({
        title: "No selection",
        description: "Please select an object to delete.",
        variant: "destructive",
      });
      return;
    }
    
    saveToUndoStack();
    fabricCanvas.remove(activeObject);
    fabricCanvas.renderAll();
    updateLayers();
    toast({
      title: "Object deleted",
      description: "The selected object has been deleted.",
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
    });
    
    setFabricCanvas(canvas);
    
    canvas.on('object:added', () => {
      updateLayers();
    });
    
    canvas.on('object:removed', () => {
      updateLayers();
    });
    
    canvas.on('mouse:up', () => {
      if (activeTool === 'draw' || activeTool === 'erase') {
        saveToUndoStack();
      }
    });
    
    canvas.on('object:modified', () => {
      saveToUndoStack();
    });
    
    return () => {
      canvas.dispose();
    };
  }, [canvasWidth, canvasHeight]);
  
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.defaultCursor = 'default';
    fabricCanvas.hoverCursor = 'move';
    
    switch (activeTool) {
      case 'select':
        fabricCanvas.selection = true;
        break;
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = fillColor;
          fabricCanvas.freeDrawingBrush.width = strokeWidth;
        }
        break;
      case 'erase':
        fabricCanvas.isDrawingMode = true;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = '#ffffff';
          fabricCanvas.freeDrawingBrush.width = strokeWidth * 2;
        }
        break;
      default:
        break;
    }
  }, [activeTool, fillColor, strokeWidth, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    const updates: any = {
      opacity: opacity / 100,
    };
    
    if ('fill' in activeObject) {
      updates.fill = fillColor;
    }
    
    if ('stroke' in activeObject) {
      updates.stroke = strokeColor;
      updates.strokeWidth = strokeWidth;
    }
    
    if (activeObject instanceof Text) {
      updates.fontSize = fontSize;
      updates.fontFamily = fontFamily;
      updates.fontWeight = fontWeight;
      updates.fontStyle = fontStyle;
      updates.textAlign = textAlign;
    }
    
    activeObject.set(updates);
    fabricCanvas.renderAll();
  }, [fillColor, strokeColor, strokeWidth, opacity, fontSize, fontFamily, fontWeight, fontStyle, textAlign]);

  const renderToolbar = () => (
    <div className="flex flex-col space-y-5">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tools</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={activeTool === 'select' ? "default" : "outline"} 
            onClick={() => setActiveTool('select')}
            className={`flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all duration-200 ${activeTool === 'select' ? 'bg-primary shadow-md' : 'hover:bg-primary/10'}`}
            size="sm"
          >
            <Move size={18} className="mb-1" />
            <span className="text-xs font-medium">Select</span>
          </Button>
          
          <Button 
            variant={activeTool === 'draw' ? "default" : "outline"} 
            onClick={() => setActiveTool('draw')}
            className={`flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all duration-200 ${activeTool === 'draw' ? 'bg-primary shadow-md' : 'hover:bg-primary/10'}`}
            size="sm"
          >
            <Pencil size={18} className="mb-1" />
            <span className="text-xs font-medium">Draw</span>
          </Button>
          
          <Button 
            variant={activeTool === 'erase' ? "default" : "outline"} 
            onClick={() => setActiveTool('erase')}
            className={`flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all duration-200 ${activeTool === 'erase' ? 'bg-primary shadow-md' : 'hover:bg-primary/10'}`}
            size="sm"
          >
            <Eraser size={18} className="mb-1" />
            <span className="text-xs font-medium">Erase</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Basic Shapes</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={addRectangle}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <Square size={18} className="mb-1" />
            <span className="text-xs font-medium">Rectangle</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addCircle}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <CircleIcon size={18} className="mb-1" />
            <span className="text-xs font-medium">Circle</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addTriangle}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <TriangleIcon size={18} className="mb-1" />
            <span className="text-xs font-medium">Triangle</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Elements</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={addHeart}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <Heart size={18} className="mb-1" />
            <span className="text-xs font-medium">Heart</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addStar}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <Star size={18} className="mb-1" />
            <span className="text-xs font-medium">Star</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addSpeechBubble}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <MessageCircle size={18} className="mb-1" />
            <span className="text-xs font-medium">Speech</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addText}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <Type size={18} className="mb-1" />
            <span className="text-xs font-medium">Text</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={triggerFileInput}
            className="flex flex-col items-center justify-center p-2 h-20 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <Image size={18} className="mb-1" />
            <span className="text-xs font-medium">Image</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Arrows</h3>
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            onClick={addArrowRight}
            className="flex flex-col items-center justify-center p-2 h-16 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <ArrowRight size={16} className="mb-1" />
            <span className="text-xs font-medium">Right</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowLeft}
            className="flex flex-col items-center justify-center p-2 h-16 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <ArrowLeft size={16} className="mb-1" />
            <span className="text-xs font-medium">Left</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowUp}
            className="flex flex-col items-center justify-center p-2 h-16 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <ArrowUp size={16} className="mb-1" />
            <span className="text-xs font-medium">Up</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowDown}
            className="flex flex-col items-center justify-center p-2 h-16 rounded-lg transition-all hover:bg-primary/10 border-dashed"
            size="sm"
          >
            <ArrowDown size={16} className="mb-1" />
            <span className="text-xs font-medium">Down</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Advanced</h3>
        <Button 
          variant="outline" 
          onClick={triggerBgRemoverInput}
          className="flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-all border border-primary/20 rounded-lg"
          size="sm"
          disabled={isProcessing}
        >
          <Scissors size={16} className="text-primary" />
          <span className="text-sm font-medium">Remove Background</span>
          {isProcessing && <span className="animate-spin ml-2">⏳</span>}
        </Button>
      </div>
    </div>
  );

  const renderStyles = () => (
    <div className="flex flex-col space-y-5">
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Colors</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="fill-color" className="text-xs font-medium mb-1.5 flex items-center">
              <div className="w-3 h-3 bg-primary/80 rounded-sm mr-1.5"></div>
              Fill Color
            </Label>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input 
                  id="fill-color"
                  type="color" 
                  value={fillColor} 
                  onChange={(e) => setFillColor(e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                />
                <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700" style={{ backgroundColor: fillColor }}></div>
              </div>
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="stroke-color" className="text-xs font-medium mb-1.5 flex items-center">
              <div className="w-3 h-3 border border-primary/80 rounded-sm mr-1.5"></div>
              Stroke Color
            </Label>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input 
                  id="stroke-color"
                  type="color" 
                  value={strokeColor} 
                  onChange={(e) => setStrokeColor(e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                />
                <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700" style={{ backgroundColor: strokeColor }}></div>
              </div>
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Appearance</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="stroke-width" className="text-xs font-medium">Stroke Width</Label>
              <span className="text-xs text-gray-500">{strokeWidth}px</span>
            </div>
            <Slider
              id="stroke-width"
              min={0}
              max={50}
              step={1}
              value={[strokeWidth]}
              onValueChange={(value) => setStrokeWidth(value[0])}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="opacity" className="text-xs font-medium">Opacity</Label>
              <span className="text-xs text-gray-500">{opacity}%</span>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Text Options</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="font-family" className="text-xs font-medium mb-1.5">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="font-family" className="h-8 text-xs">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Tahoma">Tahoma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="font-size" className="text-xs font-medium">Font Size</Label>
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>
            <Slider
              id="font-size"
              min={8}
              max={72}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="font-weight" className="text-xs font-medium mb-1.5">Font Weight</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger id="font-weight" className="h-8 text-xs">
                  <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="font-style" className="text-xs font-medium mb-1.5">Font Style</Label>
              <Select value={fontStyle} onValueChange={setFontStyle}>
                <SelectTrigger id="font-style" className="h-8 text-xs">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="italic">Italic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="text-align" className="text-xs font-medium mb-1.5">Text Align</Label>
            <Select value={textAlign} onValueChange={setTextAlign}>
              <SelectTrigger id="text-align" className="h-8 text-xs">
                <SelectValue placeholder="Alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayers = () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Layers</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowLayers(!showLayers)}>
          {showLayers ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </Button>
      </div>
      
      {showLayers && (
        <ScrollArea className="h-[180px] border border-gray-200 dark:border-gray-700 rounded-lg p-2">
          {layers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
              <Layers size={24} className="mb-2 opacity-50" />
              <p className="text-xs">No layers yet. Add elements to see them here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {[...layers].reverse().map((layer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => {
                    if (fabricCanvas) {
                      fabricCanvas.setActiveObject(layer);
                      fabricCanvas.renderAll();
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {layer instanceof Rect ? (
                        <Square size={12} />
                      ) : layer instanceof Circle ? (
                        <CircleIcon size={12} />
                      ) : layer instanceof Triangle ? (
                        <TriangleIcon size={12} />
                      ) : layer instanceof Text ? (
                        <Type size={12} />
                      ) : layer instanceof Path ? (
                        <Pencil size={12} />
                      ) : layer instanceof FabricImage ? (
                        <Image size={12} />
                      ) : (
                        <Square size={12} />
                      )}
                    </div>
                    <span className="text-xs truncate max-w-[120px]">
                      {layer instanceof Text
                        ? layer.text?.substring(0, 15) || 'Text'
                        : layer instanceof FabricImage
                        ? 'Image'
                        : layer instanceof Rect
                        ? 'Rectangle'
                        : layer instanceof Circle
                        ? 'Circle'
                        : layer instanceof Triangle
                        ? 'Triangle'
                        : layer instanceof Path
                        ? 'Path'
                        : 'Object'}
                      {index === 0 ? ' (Top)' : index === layers.length - 1 ? ' (Bottom)' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fabricCanvas) {
                          if (layer.visible === false) {
                            layer.visible = true;
                          } else {
                            layer.visible = false;
                          }
                          fabricCanvas.renderAll();
                        }
                      }}
                    >
                      <Eye size={12} className={layer.visible === false ? "opacity-30" : ""} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fabricCanvas) {
                          fabricCanvas.remove(layer);
                          saveToUndoStack();
                          fabricCanvas.renderAll();
                        }
                      }}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Actions</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={clearCanvas}
        >
          <Trash2 size={16} className="mb-1 text-red-500" />
          <span className="text-xs font-medium">Clear All</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={downloadImage}
        >
          <Download size={16} className="mb-1 text-green-500" />
          <span className="text-xs font-medium">Download</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={cloneSelected}
        >
          <Copy size={16} className="mb-1 text-blue-500" />
          <span className="text-xs font-medium">Duplicate</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={deleteSelected}
        >
          <Trash2 size={16} className="mb-1 text-red-500" />
          <span className="text-xs font-medium">Delete</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleUndo}
          disabled={undoStack.length === 0}
        >
          <Undo size={16} className="mb-1" />
          <span className="text-xs font-medium">Undo</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-2 h-[70px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleRedo}
          disabled={redoStack.length === 0}
        >
          <Redo size={16} className="mb-1" />
          <span className="text-xs font-medium">Redo</span>
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="border-none shadow-none">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Image Editor</h2>
        
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-gray-50 dark:bg-gray-900 p-4">
            <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="styles">Styles</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(100vh-220px)]">
                <TabsContent value="tools" className="p-0 border-none">
                  {renderToolbar()}
                </TabsContent>
                
                <TabsContent value="styles" className="p-0 border-none">
                  {renderStyles()}
                </TabsContent>
                
                <TabsContent value="layers" className="p-0 border-none space-y-6">
                  {renderLayers()}
                  {renderActions()}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </ResizablePanel>
          
          <ResizablePanel defaultSize={80}>
            <div className="h-full flex flex-col items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzas0IQAAAABJRU5ErkJggg==')] dark:bg-gray-900 dark:bg-opacity-40 p-6">
              <div className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} />
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                
                <input 
                  type="file" 
                  ref={bgRemoverInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleBgRemovalFileChange} 
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Card>
  );
};
