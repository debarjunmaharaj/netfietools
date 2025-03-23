
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
  Copy,
  Layers,
  PanelLeft,
  PanelRight,
  ChevronDown,
  Heart,
  Star,
  Triangle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Palette,
  Move,
  Maximize,
  Minimize
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Canvas, Circle as FabricCircle, Rect, IText, Image } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ImageEditor: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<any | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'draw' | 'text' | 'shape' | 'crop'>('select');
  const [activeTemplate, setActiveTemplate] = useState<'shapes' | 'symbols' | 'designs' | 'fonts'>('shapes');
  const [showLayersPanel, setShowLayersPanel] = useState(true);

  const templates = {
    shapes: [
      { name: 'Rectangle', icon: <Square className="h-8 w-8" />, action: addRectangle },
      { name: 'Circle', icon: <Circle className="h-8 w-8" />, action: addCircle },
      { name: 'Triangle', icon: <Triangle className="h-8 w-8" />, action: addTriangle },
      { name: 'Heart', icon: <Heart className="h-8 w-8" />, action: addHeart },
      { name: 'Star', icon: <Star className="h-8 w-8" />, action: addStar },
    ],
    symbols: [
      { name: 'Arrow Right', icon: <ArrowRight className="h-8 w-8" />, action: addArrowRight },
      { name: 'Arrow Left', icon: <ArrowLeft className="h-8 w-8" />, action: addArrowLeft },
      { name: 'Arrow Up', icon: <ArrowUp className="h-8 w-8" />, action: addArrowUp },
      { name: 'Arrow Down', icon: <ArrowDown className="h-8 w-8" />, action: addArrowDown },
    ],
    designs: [
      { name: 'Speech Bubble', icon: <MessageSquare className="h-8 w-8" />, action: addSpeechBubble },
    ],
    fonts: [
      { name: 'Heading', text: 'Heading', style: { fontSize: 36 }, action: () => addText('Heading', 36) },
      { name: 'Subheading', text: 'Subheading', style: { fontSize: 24 }, action: () => addText('Subheading', 24) },
      { name: 'Body', text: 'Body text', style: { fontSize: 16 }, action: () => addText('Body text', 16) },
    ],
  };

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new Canvas(canvasRef.current, {
        backgroundColor: '#f0f0f0',
        width: 800,
        height: 600,
      });
      
      fabricCanvasRef.current.on('object:modified', saveState);
      fabricCanvasRef.current.on('object:added', saveState);
      fabricCanvasRef.current.on('object:removed', saveState);
      fabricCanvasRef.current.on('selection:created', handleSelectionCreated);
      fabricCanvasRef.current.on('selection:updated', handleSelectionCreated);
      fabricCanvasRef.current.on('selection:cleared', handleSelectionCleared);
      
      // Initial state
      saveState();
      
      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, []);

  const handleSelectionCreated = (e: any) => {
    setActiveObject(e.selected[0]);
  };

  const handleSelectionCleared = () => {
    setActiveObject(null);
  };

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
          Image.fromURL(event.target.result.toString(), (img) => {
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

  const addText = (defaultText = 'Double-click to edit', fontSize = 20) => {
    if (fabricCanvasRef.current) {
      const text = new IText(defaultText, {
        left: 200,
        top: 200,
        fill: '#000000',
        fontFamily: 'Arial',
        fontSize,
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      saveState();
    }
  };

  const addRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new Rect({
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
      const circle = new FabricCircle({
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

  const addTriangle = () => {
    if (fabricCanvasRef.current) {
      const triangle = new (window as any).fabric.Triangle({
        left: 200,
        top: 200,
        fill: '#f472b6',
        width: 100,
        height: 100,
        opacity: 0.7,
      });
      
      fabricCanvasRef.current.add(triangle);
      fabricCanvasRef.current.setActiveObject(triangle);
      saveState();
    }
  };

  const addHeart = () => {
    if (fabricCanvasRef.current) {
      // Add a custom heart shape using path
      const path = 'M 272.70141,238.71731 \
      C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 \
      C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
      C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
      C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 \
      C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
      C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731 z';
      
      const heart = new (window as any).fabric.Path(path, {
        left: 200,
        top: 200,
        fill: '#ef4444',
        scaleX: 0.2,
        scaleY: 0.2,
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(heart);
      fabricCanvasRef.current.setActiveObject(heart);
      saveState();
    }
  };

  const addStar = () => {
    if (fabricCanvasRef.current) {
      const star = new (window as any).fabric.Polygon([
        {x: 350, y: 75},
        {x: 380, y: 160},
        {x: 470, y: 160},
        {x: 400, y: 215},
        {x: 423, y: 300},
        {x: 350, y: 250},
        {x: 277, y: 300},
        {x: 300, y: 215},
        {x: 230, y: 160},
        {x: 320, y: 160}
      ], {
        left: 200,
        top: 200,
        fill: '#facc15',
        scaleX: 0.3,
        scaleY: 0.3,
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(star);
      fabricCanvasRef.current.setActiveObject(star);
      saveState();
    }
  };

  const addArrowRight = () => {
    if (fabricCanvasRef.current) {
      const arrow = new (window as any).fabric.Path('M 0 0 L 100 0 L 100 -10 L 120 10 L 100 30 L 100 20 L 0 20 Z', {
        left: 200,
        top: 200,
        fill: '#000000',
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(arrow);
      fabricCanvasRef.current.setActiveObject(arrow);
      saveState();
    }
  };

  const addArrowLeft = () => {
    if (fabricCanvasRef.current) {
      const arrow = new (window as any).fabric.Path('M 120 0 L 20 0 L 20 -10 L 0 10 L 20 30 L 20 20 L 120 20 Z', {
        left: 200,
        top: 200,
        fill: '#000000',
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(arrow);
      fabricCanvasRef.current.setActiveObject(arrow);
      saveState();
    }
  };

  const addArrowUp = () => {
    if (fabricCanvasRef.current) {
      const arrow = new (window as any).fabric.Path('M 0 120 L 0 20 L -10 20 L 10 0 L 30 20 L 20 20 L 20 120 Z', {
        left: 200,
        top: 200,
        fill: '#000000',
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(arrow);
      fabricCanvasRef.current.setActiveObject(arrow);
      saveState();
    }
  };

  const addArrowDown = () => {
    if (fabricCanvasRef.current) {
      const arrow = new (window as any).fabric.Path('M 0 0 L 0 100 L -10 100 L 10 120 L 30 100 L 20 100 L 20 0 Z', {
        left: 200,
        top: 200,
        fill: '#000000',
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(arrow);
      fabricCanvasRef.current.setActiveObject(arrow);
      saveState();
    }
  };

  const addSpeechBubble = () => {
    if (fabricCanvasRef.current) {
      // Speech bubble path
      const bubble = new (window as any).fabric.Path('M 10,0 C 4.5,0 0,4.5 0,10 v 80 c 0,5.5 4.5,10 10,10 h 60 c 5.5,0 10,-4.5 10,-10 V 60 l 20,20 V 40 L 80,60 V 10 C 80,4.5 75.5,0 70,0 Z', {
        left: 200,
        top: 200,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 0.8,
      });
      
      fabricCanvasRef.current.add(bubble);
      fabricCanvasRef.current.setActiveObject(bubble);
      saveState();
    }
  };

  const drawMode = () => {
    if (fabricCanvasRef.current) {
      setActiveTool('draw');
      fabricCanvasRef.current.isDrawingMode = true;
      
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.width = 5;
        fabricCanvasRef.current.freeDrawingBrush.color = '#000000';
        
        toast({
          title: "Draw Mode Activated",
          description: "Click and drag to draw on the canvas",
        });
      }
    }
  };

  const selectMode = () => {
    if (fabricCanvasRef.current) {
      setActiveTool('select');
      fabricCanvasRef.current.isDrawingMode = false;
      
      toast({
        title: "Select Mode Activated",
        description: "Click on objects to select them",
      });
    }
  };

  const moveMode = () => {
    if (fabricCanvasRef.current) {
      setActiveTool('move');
      fabricCanvasRef.current.isDrawingMode = false;
      
      toast({
        title: "Move Mode Activated",
        description: "Click and drag to pan the canvas",
      });
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
        if (obj.type === 'image') {
          const image = obj as any;
          image.filters = [
            new (window as any).fabric.Image.filters.Brightness({ brightness: (brightness - 100) / 100 }),
            new (window as any).fabric.Image.filters.Contrast({ contrast: contrast / 100 })
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
        activeObject.clone((cloned: any) => {
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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Image Editor</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Top Toolbar */}
        <div className="p-2 border-b flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900">
          <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
            <ImageIcon className="h-4 w-4 mr-1" />
            Open
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button onClick={selectMode} size="sm" variant={activeTool === 'select' ? 'default' : 'outline'}>
            Select
          </Button>
          
          <Button onClick={moveMode} size="sm" variant={activeTool === 'move' ? 'default' : 'outline'}>
            <Move className="h-4 w-4" />
          </Button>
          
          <Button onClick={drawMode} size="sm" variant={activeTool === 'draw' ? 'default' : 'outline'}>
            <Brush className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button onClick={undo} size="sm" variant="outline" disabled={undoStack.length <= 1}>
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button onClick={redo} size="sm" variant="outline" disabled={redoStack.length === 0}>
            <Redo className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button onClick={downloadImage} size="sm" variant="outline" disabled={!hasImage}>
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
        
        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel */}
          {leftPanelOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15}>
                <div className="h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-950 p-2">
                  <Tabs defaultValue="templates">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
                      <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="templates" className="h-[calc(100vh-260px)]">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs w-full justify-between">
                                {activeTemplate === 'shapes' && "Shapes"}
                                {activeTemplate === 'symbols' && "Symbols"}
                                {activeTemplate === 'designs' && "Designs"}
                                {activeTemplate === 'fonts' && "Text Styles"}
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setActiveTemplate('shapes')}>Shapes</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setActiveTemplate('symbols')}>Symbols</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setActiveTemplate('designs')}>Designs</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setActiveTemplate('fonts')}>Text Styles</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <ScrollArea className="flex-1">
                          <div className="grid grid-cols-2 gap-2">
                            {activeTemplate === 'shapes' && templates.shapes.map((shape, index) => (
                              <Button key={index} variant="outline" className="h-20 flex flex-col p-1" onClick={shape.action}>
                                {shape.icon}
                                <span className="mt-1 text-xs">{shape.name}</span>
                              </Button>
                            ))}
                            
                            {activeTemplate === 'symbols' && templates.symbols.map((symbol, index) => (
                              <Button key={index} variant="outline" className="h-20 flex flex-col p-1" onClick={symbol.action}>
                                {symbol.icon}
                                <span className="mt-1 text-xs">{symbol.name}</span>
                              </Button>
                            ))}
                            
                            {activeTemplate === 'designs' && templates.designs.map((design, index) => (
                              <Button key={index} variant="outline" className="h-20 flex flex-col p-1" onClick={design.action}>
                                {design.icon}
                                <span className="mt-1 text-xs">{design.name}</span>
                              </Button>
                            ))}
                            
                            {activeTemplate === 'fonts' && templates.fonts.map((font, index) => (
                              <Button key={index} variant="outline" className="h-20 flex flex-col justify-center p-1" onClick={font.action}>
                                <span style={{ fontSize: `${font.style.fontSize}px` }} className="truncate">{font.text}</span>
                                <span className="mt-1 text-xs">{font.name}</span>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="layers" className="h-[calc(100vh-260px)]">
                      <ScrollArea className="h-full">
                        <div className="space-y-1">
                          {/* Placeholder for layers panel */}
                          <div className="border rounded p-2 bg-white dark:bg-gray-800 text-sm">
                            Background
                          </div>
                          {hasImage && (
                            <div className="border rounded p-2 bg-white dark:bg-gray-800 text-sm">
                              Image Layer
                            </div>
                          )}
                          {/* We would need to implement proper layer management here */}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
            </>
          )}
          
          {/* Canvas */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-[calc(100vh-200px)] overflow-auto bg-gray-200 dark:bg-gray-700 flex justify-center items-center relative">
              {!leftPanelOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-2 bg-white dark:bg-gray-800 z-10"
                  onClick={() => setLeftPanelOpen(true)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
              
              {leftPanelOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-2 bg-white dark:bg-gray-800 z-10"
                  onClick={() => setLeftPanelOpen(false)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
              
              {!rightPanelOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 bg-white dark:bg-gray-800 z-10"
                  onClick={() => setRightPanelOpen(true)}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              )}
              
              <div className="relative">
                <canvas ref={canvasRef} className="shadow-lg" />
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button variant="outline" size="icon" className="h-6 w-6 bg-white dark:bg-gray-800">
                    <Maximize className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-6 w-6 bg-white dark:bg-gray-800">
                    <Minimize className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          {/* Right Panel */}
          {rightPanelOpen && (
            <>
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={20} minSize={15}>
                <div className="h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-950 p-2">
                  <Tabs defaultValue="properties">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                      <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="properties" className="h-[calc(100vh-260px)]">
                      <ScrollArea className="h-full">
                        <div className="space-y-4">
                          {activeObject ? (
                            <>
                              <div className="space-y-2">
                                <Label>Position</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label htmlFor="posX" className="text-xs">X</Label>
                                    <Input 
                                      id="posX" 
                                      value={Math.round(activeObject.left || 0)} 
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && fabricCanvasRef.current) {
                                          activeObject.set({ left: value });
                                          fabricCanvasRef.current.renderAll();
                                        }
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="posY" className="text-xs">Y</Label>
                                    <Input 
                                      id="posY" 
                                      value={Math.round(activeObject.top || 0)} 
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && fabricCanvasRef.current) {
                                          activeObject.set({ top: value });
                                          fabricCanvasRef.current.renderAll();
                                        }
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Size</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label htmlFor="width" className="text-xs">Width</Label>
                                    <Input 
                                      id="width" 
                                      value={Math.round((activeObject.width || 0) * (activeObject.scaleX || 1))} 
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && fabricCanvasRef.current && activeObject.width) {
                                          activeObject.set({ scaleX: value / activeObject.width });
                                          fabricCanvasRef.current.renderAll();
                                        }
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="height" className="text-xs">Height</Label>
                                    <Input 
                                      id="height" 
                                      value={Math.round((activeObject.height || 0) * (activeObject.scaleY || 1))} 
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && fabricCanvasRef.current && activeObject.height) {
                                          activeObject.set({ scaleY: value / activeObject.height });
                                          fabricCanvasRef.current.renderAll();
                                        }
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Appearance</Label>
                                <div className="grid grid-cols-2 gap-2 items-center">
                                  <Label htmlFor="color" className="text-xs">Fill Color</Label>
                                  <div className="flex items-center gap-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          className="w-8 h-8 p-0" 
                                          style={{ backgroundColor: activeObject.fill || '#000000' }} 
                                        />
                                      </PopoverTrigger>
                                      <PopoverContent side="right" className="w-80">
                                        <div className="grid grid-cols-5 gap-1">
                                          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
                                            '#00ffff', '#000000', '#ffffff', '#888888', '#f472b6',
                                            '#4ade80', '#60a5fa', '#f59e0b', '#8b5cf6', '#ef4444',
                                            '#10b981', '#3b82f6', '#f97316', '#a855f7', '#ec4899'].map((color) => (
                                            <Button 
                                              key={color} 
                                              variant="outline" 
                                              className="w-8 h-8 p-0 m-0" 
                                              style={{ backgroundColor: color }} 
                                              onClick={() => {
                                                if (fabricCanvasRef.current && activeObject) {
                                                  activeObject.set({ fill: color });
                                                  fabricCanvasRef.current.renderAll();
                                                }
                                              }}
                                            />
                                          ))}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <Input 
                                      id="color" 
                                      value={activeObject.fill || '#000000'} 
                                      onChange={(e) => {
                                        if (fabricCanvasRef.current) {
                                          activeObject.set({ fill: e.target.value });
                                          fabricCanvasRef.current.renderAll();
                                        }
                                      }}
                                      className="h-8 w-20"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Actions</Label>
                                <div className="flex gap-2">
                                  <Button onClick={duplicateSelectedObject} size="sm" variant="outline">
                                    <Copy className="h-4 w-4 mr-1" />
                                    Duplicate
                                  </Button>
                                  <Button onClick={deleteSelectedObject} size="sm" variant="outline" className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30">
                                    <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-gray-500 mt-8">
                              <p>Select an object to edit its properties</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="adjust" className="h-[calc(100vh-260px)]">
                      <ScrollArea className="h-full">
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
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
