
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Canvas, Rect, Circle, Triangle, IEvent, Path, Point, Group, 
  FabricObject, util, Text, Image as FabricImage, loadSVGFromURL
} from 'fabric';
import { 
  Move, Pencil, Square, Circle as CircleIcon, Triangle as TriangleIcon, 
  Heart, Star, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  MessageCircle, Type, Image, Eraser, Trash2, Download, Undo, Redo,
  SlidersHorizontal, Copy, Scissors, RotateCw, Layers, Palette, Plus, Minus
} from 'lucide-react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const { toast } = useToast();

  // Define the shape and template functions first so they can be used in the JSX
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
  };

  // Tool functions
  const addText = () => {
    if (!fabricCanvas) return;
    const text = new Text('Double click to edit', {
      left: 100,
      top: 100,
      fill: fillColor,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textAlign: textAlign as any,
      stroke: strokeColor,
      strokeWidth: strokeWidth / 10,
      opacity: opacity / 100,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    saveToUndoStack();
    fabricCanvas.renderAll();
  };

  const saveToUndoStack = () => {
    if (!fabricCanvas) return;
    const json = fabricCanvas.toJSON();
    setUndoStack(prev => [...prev, json]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (!fabricCanvas || undoStack.length === 0) return;
    const currentState = fabricCanvas.toJSON();
    setRedoStack(prev => [...prev, currentState]);
    
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    fabricCanvas.loadFromJSON(previousState, fabricCanvas.renderAll.bind(fabricCanvas));
  };

  const handleRedo = () => {
    if (!fabricCanvas || redoStack.length === 0) return;
    const currentState = fabricCanvas.toJSON();
    setUndoStack(prev => [...prev, currentState]);
    
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    fabricCanvas.loadFromJSON(nextState, fabricCanvas.renderAll.bind(fabricCanvas));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
      const imgData = ev.target?.result as string;
      FabricImage.fromURL(imgData, (img) => {
        // Scale down large images
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    // Confirm before clearing
    if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      saveToUndoStack();
      fabricCanvas.clear();
      fabricCanvas.setBackgroundColor('#ffffff', fabricCanvas.renderAll.bind(fabricCanvas));
      setImageUploaded(false);
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
    
    // Clone the object(s)
    activeObject.clone((cloned: FabricObject) => {
      fabricCanvas.discardActiveObject();
      
      if (cloned.left && cloned.top) {
        // Offset the clone slightly so it's visible
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10,
        });
      }
      
      if ((cloned as any).forEachObject) {
        // If it's a group/multiple selection
        (cloned as any).forEachObject((object: FabricObject) => {
          fabricCanvas.add(object);
        });
      } else {
        // Single object
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
    toast({
      title: "Object deleted",
      description: "The selected object has been deleted.",
    });
  };

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
    });
    
    setFabricCanvas(canvas);
    
    // Set up event listeners
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
  
  // Set the active tool behavior
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Reset mode
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.defaultCursor = 'default';
    fabricCanvas.hoverCursor = 'move';
    
    // Set tool-specific behaviors
    switch (activeTool) {
      case 'select':
        fabricCanvas.selection = true;
        break;
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = fillColor;
        fabricCanvas.freeDrawingBrush.width = strokeWidth;
        break;
      case 'erase':
        // Using custom eraser logic would require more complex handling
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = '#ffffff';
        fabricCanvas.freeDrawingBrush.width = strokeWidth * 2;
        break;
      default:
        break;
    }
  }, [activeTool, fillColor, strokeWidth, fabricCanvas]);

  // Update properties for selected object
  useEffect(() => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    // Apply common properties
    const updates: any = {
      opacity: opacity / 100,
    };
    
    // Apply fill if object supports it
    if ('fill' in activeObject) {
      updates.fill = fillColor;
    }
    
    // Apply stroke properties
    if ('stroke' in activeObject) {
      updates.stroke = strokeColor;
      updates.strokeWidth = strokeWidth;
    }
    
    // Apply text-specific properties
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

  // UI panels
  const renderToolbar = () => (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant={activeTool === 'select' ? "default" : "outline"} 
          onClick={() => setActiveTool('select')}
          className="flex flex-col items-center p-2"
          size="sm"
        >
          <Move size={16} />
          <span className="text-xs mt-1">Select</span>
        </Button>
        
        <Button 
          variant={activeTool === 'draw' ? "default" : "outline"} 
          onClick={() => setActiveTool('draw')}
          className="flex flex-col items-center p-2"
          size="sm"
        >
          <Pencil size={16} />
          <span className="text-xs mt-1">Draw</span>
        </Button>
        
        <Button 
          variant={activeTool === 'erase' ? "default" : "outline"} 
          onClick={() => setActiveTool('erase')}
          className="flex flex-col items-center p-2"
          size="sm"
        >
          <Eraser size={16} />
          <span className="text-xs mt-1">Erase</span>
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Shapes</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={addRectangle}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <Square size={16} />
            <span className="text-xs mt-1">Rectangle</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addCircle}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <CircleIcon size={16} />
            <span className="text-xs mt-1">Circle</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addTriangle}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <TriangleIcon size={16} />
            <span className="text-xs mt-1">Triangle</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addHeart}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <Heart size={16} />
            <span className="text-xs mt-1">Heart</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addStar}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <Star size={16} />
            <span className="text-xs mt-1">Star</span>
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Arrows</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={addArrowRight}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <ArrowRight size={16} />
            <span className="text-xs mt-1">Right</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowLeft}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <ArrowLeft size={16} />
            <span className="text-xs mt-1">Left</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowUp}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <ArrowUp size={16} />
            <span className="text-xs mt-1">Up</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addArrowDown}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <ArrowDown size={16} />
            <span className="text-xs mt-1">Down</span>
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Elements</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={addSpeechBubble}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <MessageCircle size={16} />
            <span className="text-xs mt-1">Speech</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={addText}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <Type size={16} />
            <span className="text-xs mt-1">Text</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={triggerFileInput}
            className="flex flex-col items-center p-2"
            size="sm"
          >
            <Image size={16} />
            <span className="text-xs mt-1">Image</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStyles = () => (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="font-medium mb-2">Fill</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="color" 
            value={fillColor} 
            onChange={(e) => setFillColor(e.target.value)} 
            className="w-8 h-8 rounded-md cursor-pointer"
          />
          <Input 
            value={fillColor} 
            onChange={(e) => setFillColor(e.target.value)} 
            className="w-24"
          />
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Stroke</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="color" 
            value={strokeColor} 
            onChange={(e) => setStrokeColor(e.target.value)} 
            className="w-8 h-8 rounded-md cursor-pointer"
          />
          <Input 
            value={strokeColor} 
            onChange={(e) => setStrokeColor(e.target.value)} 
            className="w-24"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Stroke Width</h3>
          <span className="text-xs text-gray-500">{strokeWidth}px</span>
        </div>
        <Slider 
          value={[strokeWidth]} 
          onValueChange={(value) => setStrokeWidth(value[0])} 
          min={1} 
          max={50} 
          step={1}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Opacity</h3>
          <span className="text-xs text-gray-500">{opacity}%</span>
        </div>
        <Slider 
          value={[opacity]} 
          onValueChange={(value) => setOpacity(value[0])} 
          min={0} 
          max={100} 
          step={1}
        />
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Text Settings</h3>
        <div className="space-y-2">
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>
            <Slider 
              id="font-size"
              value={[fontSize]} 
              onValueChange={(value) => setFontSize(value[0])} 
              min={8} 
              max={100} 
              step={1}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="font-weight">Weight</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger>
                  <SelectValue placeholder="Font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="font-style">Style</Label>
              <Select value={fontStyle} onValueChange={setFontStyle}>
                <SelectTrigger>
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
            <Label htmlFor="text-align">Text Align</Label>
            <Select value={textAlign} onValueChange={setTextAlign}>
              <SelectTrigger>
                <SelectValue placeholder="Text align" />
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

  const renderTemplates = () => (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="font-medium mb-2">Canvas Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="canvas-width">Width</Label>
            <div className="flex items-center">
              <Input 
                id="canvas-width"
                type="number" 
                value={canvasWidth} 
                onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 800)} 
                className="w-full"
                min={100}
                max={3000}
              />
              <span className="ml-2 text-sm text-gray-500">px</span>
            </div>
          </div>
          <div>
            <Label htmlFor="canvas-height">Height</Label>
            <div className="flex items-center">
              <Input 
                id="canvas-height"
                type="number" 
                value={canvasHeight} 
                onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 600)} 
                className="w-full"
                min={100}
                max={3000}
              />
              <span className="ml-2 text-sm text-gray-500">px</span>
            </div>
          </div>
        </div>
        <Button className="mt-2 w-full" size="sm" onClick={() => {
          if (fabricCanvas) {
            fabricCanvas.setDimensions({width: canvasWidth, height: canvasHeight});
            fabricCanvas.renderAll();
          }
        }}>Apply Size</Button>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Templates</h3>
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
            className="h-auto py-2"
            size="sm"
          >
            Social Media Post
            <span className="text-xs block text-gray-500">1200 x 628 px</span>
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
            className="h-auto py-2"
            size="sm"
          >
            Instagram Post
            <span className="text-xs block text-gray-500">800 x 800 px</span>
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
            className="h-auto py-2"
            size="sm"
          >
            HD Video Cover
            <span className="text-xs block text-gray-500">1280 x 720 px</span>
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
            className="h-auto py-2"
            size="sm"
          >
            Instagram Story
            <span className="text-xs block text-gray-500">1080 x 1920 px</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Image Editor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit your image with professional Photoshop-like tools
        </p>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {/* Left sidebar - Tools panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white dark:bg-gray-800">
          <div className="p-3 h-full">
            <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="styles">Styles</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(100vh-220px)]">
                <TabsContent value="tools" className="mt-0">
                  {renderToolbar()}
                </TabsContent>
                
                <TabsContent value="styles" className="mt-0">
                  {renderStyles()}
                </TabsContent>
                
                <TabsContent value="templates" className="mt-0">
                  {renderTemplates()}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </ResizablePanel>
        
        {/* Main canvas area */}
        <ResizablePanel defaultSize={60}>
          <div className="relative h-full flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Canvas toolbar */}
            <div className="p-2 bg-white dark:bg-gray-800 border-b flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleUndo} 
                  disabled={undoStack.length === 0}
                  title="Undo"
                >
                  <Undo size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRedo} 
                  disabled={redoStack.length === 0}
                  title="Redo"
                >
                  <Redo size={18} />
                </Button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={cloneSelected}
                  title="Duplicate"
                >
                  <Copy size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={deleteSelected}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
              
              <div className="flex items-center">
                <div className="mr-2 flex items-center space-x-1">
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
                  >
                    <Plus size={18} />
                  </Button>
                  <span className="text-sm">{zoom}%</span>
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
                  >
                    <Minus size={18} />
                  </Button>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={clearCanvas}
                >
                  Clear
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="ml-2" 
                  onClick={downloadImage}
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Canvas container */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <div className="shadow-lg rounded-sm bg-white">
                <canvas ref={canvasRef}></canvas>
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </ResizablePanel>
        
        {/* Right sidebar - Properties and layers panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white dark:bg-gray-800">
          <div className="p-3 h-full flex flex-col">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Properties</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowProperties(!showProperties)}
                  className="h-6 w-6"
                >
                  {showProperties ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              </div>
              
              {showProperties && (
                <div className="space-y-2">
                  <div>
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="text-xs mr-1">X:</span>
                        <Input type="number" placeholder="X" className="h-8" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-1">Y:</span>
                        <Input type="number" placeholder="Y" className="h-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="text-xs mr-1">W:</span>
                        <Input type="number" placeholder="Width" className="h-8" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-1">H:</span>
                        <Input type="number" placeholder="Height" className="h-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Rotation</Label>
                    <div className="flex items-center">
                      <Input type="number" placeholder="0°" className="h-8" />
                      <span className="ml-1 text-xs">°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-3 mt-2 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Layers</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowLayers(!showLayers)}
                  className="h-6 w-6"
                >
                  {showLayers ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              </div>
              
              {showLayers && (
                <div className="border rounded-md h-[calc(100%-30px)]">
                  <div className="p-2 text-center text-gray-500 text-sm">
                    Object layers will appear here
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

// Additional import for ChevronDown and ChevronRight
import { ChevronDown, ChevronRight } from 'lucide-react';
