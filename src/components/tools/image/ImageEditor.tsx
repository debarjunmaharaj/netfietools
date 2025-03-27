
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
      
      FabricImage.fromURL(imgData, (img) => {
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
      
      FabricImage.fromURL(url, (img) => {
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
    
    activeObject.clone((clonedObj: any) => {
      fabricCanvas.discardActiveObject();
      
      if (clonedObj.left !== undefined && clonedObj.top !== undefined) {
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
        });
      }
      
      if (clonedObj.forEachObject) {
        clonedObj.forEachObject(function(obj: any) {
          fabricCanvas.add(obj);
        });
      } else {
        fabricCanvas.add(clonedObj);
      }
      
      fabricCanvas.setActiveObject(clonedObj);
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
                <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700" style={{backgroundColor: fillColor}}></div>
              </div>
              <Input 
                value={fillColor} 
                onChange={(e) => setFillColor(e.target.value)} 
                className="w-24 h-8 text-xs"
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
                <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700" style={{backgroundColor: strokeColor}}></div>
              </div>
              <Input 
                value={strokeColor} 
                onChange={(e) => setStrokeColor(e.target.value)} 
                className="w-24 h-8 text-xs"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1.5 mt-2">
          {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080']
            .map(color => (
            <button 
              key={color} 
              className="w-full h-6 rounded border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setFillColor(color)}
              aria-label={`Set color to ${color}`}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="stroke-width" className="text-xs font-medium">Stroke Width</Label>
            <span className="text-xs text-gray-500">{strokeWidth}px</span>
          </div>
          <Slider 
            id="stroke-width"
            value={[strokeWidth]} 
            onValueChange={(value) => setStrokeWidth(value[0])} 
            min={1} 
            max={50} 
            step={1}
            className="py-1"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="opacity-slider" className="text-xs font-medium">Opacity</Label>
            <span className="text-xs text-gray-500">{opacity}%</span>
          </div>
          <Slider 
            id="opacity-slider"
            value={[opacity]} 
            onValueChange={(value) => setOpacity(value[0])} 
            min={0} 
            max={100} 
            step={1}
            className="py-1"
          />
        </div>
      </div>
      
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Text Settings</h3>
          <Info size={14} className="text-gray-400" />
        </div>
        
        <div className="space-y-2.5">
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
                <SelectItem value="Impact">Impact</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                <SelectItem value="Tahoma">Tahoma</SelectItem>
                <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                <SelectItem value="Lucida Sans">Lucida Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="font-size" className="text-xs font-medium">Font Size</Label>
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>
            <Slider 
              id="font-size"
              value={[fontSize]} 
              onValueChange={(value) => setFontSize(value[0])} 
              min={8} 
              max={100} 
              step={1}
              className="py-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="font-weight" className="text-xs font-medium mb-1.5">Weight</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger id="font-weight" className="h-8 text-xs">
                  <SelectValue placeholder="Font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="font-style" className="text-xs font-medium mb-1.5">Style</Label>
              <Select value={fontStyle} onValueChange={setFontStyle}>
                <SelectTrigger id="font-style" className="h-8 text-xs">
                  <SelectValue placeholder="Font style" />
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
            <div className="flex space-x-1">
              <Button 
                variant={textAlign === 'left' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1 h-8"
                onClick={() => setTextAlign('left')}
              >
                <span className="text-xs">Left</span>
              </Button>
              <Button 
                variant={textAlign === 'center' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1 h-8"
                onClick={() => setTextAlign('center')}
              >
                <span className="text-xs">Center</span>
              </Button>
              <Button 
                variant={textAlign === 'right' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1 h-8"
                onClick={() => setTextAlign('right')}
              >
                <span className="text-xs">Right</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="flex flex-col space-y-5">
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Canvas Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="canvas-width" className="text-xs font-medium mb-1.5">Width</Label>
            <div className="flex items-center">
              <Input 
                id="canvas-width"
                type="number" 
                value={canvasWidth} 
                onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 800)} 
                className="w-full h-8 text-xs"
                min={100}
                max={3000}
              />
              <span className="ml-2 text-xs text-gray-500">px</span>
            </div>
          </div>
          <div>
            <Label htmlFor="canvas-height" className="text-xs font-medium mb-1.5">Height</Label>
            <div className="flex items-center">
              <Input 
                id="canvas-height"
                type="number" 
                value={canvasHeight} 
                onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 600)} 
                className="w-full h-8 text-xs"
                min={100}
                max={3000}
              />
              <span className="ml-2 text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>
        <Button 
          className="mt-2 w-full h-8 text-xs" 
          size="sm" 
          onClick={() => {
            if (fabricCanvas) {
              fabricCanvas.setDimensions({width: canvasWidth, height: canvasHeight});
              fabricCanvas.renderAll();
            }
          }}
        >
          Apply Size
        </Button>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(1200);
              setCanvasHeight(628);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 1200, height: 628});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">Social Media Post</span>
            <span className="text-[10px] text-gray-500">1200 x 628 px</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(800);
              setCanvasHeight(800);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 800, height: 800});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">Instagram Post</span>
            <span className="text-[10px] text-gray-500">800 x 800 px</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(1280);
              setCanvasHeight(720);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 1280, height: 720});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">HD Video Cover</span>
            <span className="text-[10px] text-gray-500">1280 x 720 px</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(1080);
              setCanvasHeight(1920);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 1080, height: 1920});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">Instagram Story</span>
            <span className="text-[10px] text-gray-500">1080 x 1920 px</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(1500);
              setCanvasHeight(500);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 1500, height: 500});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">Website Banner</span>
            <span className="text-[10px] text-gray-500">1500 x 500 px</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCanvasWidth(1024);
              setCanvasHeight(1024);
              if (fabricCanvas) {
                fabricCanvas.setDimensions({width: 1024, height: 1024});
                fabricCanvas.renderAll();
              }
            }}
            className="h-auto py-2 flex flex-col items-start justify-center text-left"
            size="sm"
          >
            <span className="text-xs font-medium">NFT Artwork</span>
            <span className="text-[10px] text-gray-500">1024 x 1024 px</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Background Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {['#ffffff', '#000000', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#4361ee', '#4cc9f0', '#4895ef', '#560bad', '#f72585', '#b5179e', '#3a0ca3', '#4cc9f0', '#4361ee'].map((color) => (
            <button
              key={color}
              className="w-full h-8 rounded-md border border-gray-300 hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: color }}
              onClick={() => {
                if (fabricCanvas) {
                  fabricCanvas.backgroundColor = color;
                  fabricCanvas.renderAll();
                }
              }}
              aria-label={`Set background to ${color}`}
            />
          ))}
        </div>
        
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">Background Gradients</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="w-full h-12 rounded-md border border-gray-300 hover:scale-105 transition-transform shadow-sm"
              style={{ background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' }}
              onClick={() => {
                if (fabricCanvas) {
                  // Apply a gradient background
                  const gradient = new (window as any).fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight },
                    colorStops: [
                      { offset: 0, color: '#ff9a9e' },
                      { offset: 1, color: '#fad0c4' }
                    ]
                  });
                  fabricCanvas.setBackgroundColor(gradient, fabricCanvas.renderAll.bind(fabricCanvas));
                }
              }}
              aria-label="Set gradient background"
            />
            <button
              className="w-full h-12 rounded-md border border-gray-300 hover:scale-105 transition-transform shadow-sm"
              style={{ background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' }}
              onClick={() => {
                if (fabricCanvas) {
                  // Apply a gradient background
                  const gradient = new (window as any).fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight },
                    colorStops: [
                      { offset: 0, color: '#84fab0' },
                      { offset: 1, color: '#8fd3f4' }
                    ]
                  });
                  fabricCanvas.setBackgroundColor(gradient, fabricCanvas.renderAll.bind(fabricCanvas));
                }
              }}
              aria-label="Set gradient background"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Professional Image Editor</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create professional-grade designs with our advanced editing tools. Perfect for social media, marketing materials, and digital art.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-[700px]">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                  <TabsTrigger value="styles" className="text-xs">Styles</TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-grow pr-3">
                  <TabsContent value="tools" className="mt-0 h-full">
                    {renderToolbar()}
                  </TabsContent>
                  
                  <TabsContent value="styles" className="mt-0 h-full">
                    {renderStyles()}
                  </TabsContent>
                  
                  <TabsContent value="templates" className="mt-0 h-full">
                    {renderTemplates()}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </ResizablePanel>
          
          <ResizablePanel defaultSize={60}>
            <div className="relative h-full flex flex-col bg-gray-100 dark:bg-gray-900">
              <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleUndo} 
                    disabled={undoStack.length === 0}
                    title="Undo"
                    className="h-8 w-8 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Undo size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRedo} 
                    disabled={redoStack.length === 0}
                    title="Redo"
                    className="h-8 w-8 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Redo size={16} />
                  </Button>
                  <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={cloneSelected}
                    title="Duplicate"
                    className="h-8 w-8 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Copy size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={deleteSelected}
                    title="Delete"
                    className="h-8 w-8 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-2 flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (fabricCanvas && zoom < 400) {
                          const newZoom = zoom + 25;
                          setZoom(newZoom);
                          fabricCanvas.setZoom(newZoom / 100);
                          fabricCanvas.renderAll();
                        }
                      }}
                      title="Zoom In"
                      className="h-6 w-6 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Plus size={14} />
                    </Button>
                    <span className="text-xs font-medium mx-1.5">{zoom}%</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (fabricCanvas && zoom > 25) {
                          const newZoom = zoom - 25;
                          setZoom(newZoom);
                          fabricCanvas.setZoom(newZoom / 100);
                          fabricCanvas.renderAll();
                        }
                      }}
                      title="Zoom Out"
                      className="h-6 w-6 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Minus size={14} />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCanvas}
                    className="h-8 text-xs font-medium mr-1.5 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 text-xs font-medium" 
                    onClick={downloadImage}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] bg-neutral-100 dark:bg-neutral-900">
                <div className="shadow-xl rounded-md bg-white">
                  <canvas ref={canvasRef}></canvas>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <input
                type="file"
                ref={bgRemoverInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBgRemovalFileChange}
              />
            </div>
          </ResizablePanel>
          
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <div className="p-4 h-full flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowProperties(!showProperties)}
                    className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  >
                    <SlidersHorizontal size={16} className="mr-1.5" />
                    Properties
                    {showProperties ? (
                      <ChevronDown size={16} className="ml-1" />
                    ) : (
                      <ChevronRight size={16} className="ml-1" />
                    )}
                  </button>
                </div>
                
                {showProperties && (
                  <div className="space-y-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div>
                      <Label className="text-xs font-medium mb-1.5">Position</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <span className="text-xs mr-1 w-3">X:</span>
                          <Input type="number" placeholder="X" className="h-7 text-xs" />
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs mr-1 w-3">Y:</span>
                          <Input type="number" placeholder="Y" className="h-7 text-xs" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium mb-1.5">Size</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <span className="text-xs mr-1 w-3">W:</span>
                          <Input type="number" placeholder="Width" className="h-7 text-xs" />
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs mr-1 w-3">H:</span>
                          <Input type="number" placeholder="Height" className="h-7 text-xs" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium mb-1.5">Rotation</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" placeholder="0°" className="h-7 text-xs" />
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <RotateCw size={14} />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <FlipHorizontal size={14} />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <FlipVertical size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Checkbox id="lock-ratio" />
                        <label htmlFor="lock-ratio" className="text-xs font-medium">Lock ratio</label>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Checkbox id="show-grid" />
                        <label htmlFor="show-grid" className="text-xs font-medium">Show grid</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowLayers(!showLayers)}
                    className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                  >
                    <Layers size={16} className="mr-1.5" />
                    Layers
                    {showLayers ? (
                      <ChevronDown size={16} className="ml-1" />
                    ) : (
                      <ChevronRight size={16} className="ml-1" />
                    )}
                  </button>
                </div>
                
                {showLayers && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg h-[calc(100%-30px)] bg-white dark:bg-gray-800 shadow-sm">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/80 rounded-t-lg">
                      <span className="text-xs font-medium">Layer Name</span>
                      <span className="text-xs font-medium">Visibility</span>
                    </div>
                    <ScrollArea className="h-[calc(100%-36px)]">
                      {layers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-xs">
                          <FileImage size={24} className="mx-auto mb-2 text-gray-400" />
                          No objects on canvas
                          <p className="mt-1 text-[10px] text-gray-400">Add shapes, text, or images to see them here</p>
                        </div>
                      ) : (
                        <div className="p-1">
                          {layers.map((obj, index) => {
                            let name = "Object";
                            if (obj instanceof Rect) name = "Rectangle";
                            else if (obj instanceof Circle) name = "Circle";
                            else if (obj instanceof Triangle) name = "Triangle";
                            else if (obj instanceof Text) name = `Text: "${(obj as Text).text?.substring(0, 10)}${(obj as Text).text && (obj as Text).text.length > 10 ? '...' : ''}"`;
                            else if (obj instanceof Path) name = "Shape";
                            else if (obj instanceof FabricImage) name = "Image";

                            return (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer border-b border-gray-100 dark:border-gray-700/50"
                                onClick={() => {
                                  if (fabricCanvas) {
                                    fabricCanvas.setActiveObject(obj);
                                    fabricCanvas.renderAll();
                                  }
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                  <span className="text-xs truncate max-w-[120px]">{name}</span>
                                </div>
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (obj.visible) {
                                        obj.set('visible', false);
                                      } else {
                                        obj.set('visible', true);
                                      }
                                      if (fabricCanvas) {
                                        fabricCanvas.renderAll();
                                      }
                                    }}
                                  >
                                    <Eye size={14} className={obj.visible === false ? "text-gray-400" : "text-gray-700"} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6 text-gray-500 hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (fabricCanvas) {
                                        fabricCanvas.remove(obj);
                                        fabricCanvas.renderAll();
                                        updateLayers();
                                      }
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
