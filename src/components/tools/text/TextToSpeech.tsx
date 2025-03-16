
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Language = 'english' | 'bengali';
type Voice = 'male' | 'female';

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [voice, setVoice] = useState<Voice>('female');
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate TTS generation for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll fake an audio URL
      setAudioUrl('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABQgJAUHQQAB4AAAAwVuWNvnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
      
      toast({
        title: "Success!",
        description: "Speech generated successfully.",
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In the future, this would control an audio player
    if (!isPlaying) {
      toast({
        title: "Playing audio",
        description: "Audio playback started.",
      });
    } else {
      toast({
        title: "Paused audio",
        description: "Audio playback paused.",
      });
    }
  };
  
  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speech-${language}-${voice}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success!",
      description: "Audio downloaded successfully.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Text to Speech</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert text to natural-sounding speech in multiple languages
          </p>
        </div>
        
        <Tabs defaultValue="input" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Text Input</TabsTrigger>
            <TabsTrigger value="settings">Voice Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-4">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Enter text to convert to speech</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={handleTextChange}
                    className="min-h-[200px] mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language-select">Language</Label>
                    <Select
                      value={language}
                      onValueChange={(value) => setLanguage(value as Language)}
                    >
                      <SelectTrigger id="language-select" className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="voice-select">Voice</Label>
                    <Select
                      value={voice}
                      onValueChange={(value) => setVoice(value as Voice)}
                    >
                      <SelectTrigger id="voice-select" className="mt-2">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="speed-slider">Speed</Label>
                    <span className="text-sm text-gray-500">{speed[0]}x</span>
                  </div>
                  <Slider
                    id="speed-slider"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={speed}
                    onValueChange={setSpeed}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="pitch-slider">Pitch</Label>
                    <span className="text-sm text-gray-500">{pitch[0]}x</span>
                  </div>
                  <Slider
                    id="pitch-slider"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={pitch}
                    onValueChange={setPitch}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !text.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Speech"
            )}
          </Button>
          
          {audioUrl && (
            <>
              <Button 
                onClick={handlePlayPause}
                variant="outline"
                className="border-primary text-primary"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </div>
        
        {audioUrl && (
          <div className="mt-8">
            <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <audio 
                controls 
                className="w-full"
                src={audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
