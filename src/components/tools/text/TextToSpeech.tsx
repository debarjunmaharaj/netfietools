
import React, { useState, useRef } from 'react';
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
import { Play, Pause, Save, Loader2, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { generateSpeech, voices, models } from '@/utils/elevenLabsApi';

type Language = 'english' | 'bengali';
type Voice = 'male' | 'female';
type VoiceOption = { id: string; name: string };

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [voice, setVoice] = useState<Voice>('female');
  const [selectedVoice, setSelectedVoice] = useState<string>(voices.english.female[0].id);
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [stability, setStability] = useState([0.5]);
  const [similarityBoost, setSimilarityBoost] = useState([0.75]);
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    // Reset selected voice when language changes
    setSelectedVoice(voices[value][voice][0].id);
  };

  const handleVoiceTypeChange = (value: Voice) => {
    setVoice(value);
    setSelectedVoice(voices[language][value][0].id);
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
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

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your ElevenLabs API key.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const speechBlob = await generateSpeech(apiKey, {
        text,
        voice_id: selectedVoice,
        model_id: selectedModel,
        voice_settings: {
          stability: stability[0],
          similarity_boost: similarityBoost[0],
        },
      });
      
      if (speechBlob) {
        const url = URL.createObjectURL(speechBlob);
        setAudioUrl(url);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = speed[0];
          // We'll handle pitch adjustment in a real implementation
        }
        
        toast({
          title: "Success!",
          description: "Speech generated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate speech. Check your API key and try again.",
          variant: "destructive",
        });
      }
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
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
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

  // Get available voices based on selected language and voice type
  const availableVoices: VoiceOption[] = voices[language][voice];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Text to Speech</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert text to natural-sounding speech in multiple languages
          </p>
        </div>
        
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-6">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="api-key">ElevenLabs API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toast({
                    title: "API Key Info",
                    description: "Get your API key from elevenlabs.io/account",
                  });
                }}
              >
                <Key className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Your API key is only stored in your browser and is never sent to our servers.
            </p>
          </div>
        </Card>
        
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
                      onValueChange={(value) => handleLanguageChange(value as Language)}
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
                    <Label htmlFor="voice-select">Voice Type</Label>
                    <Select
                      value={voice}
                      onValueChange={(value) => handleVoiceTypeChange(value as Voice)}
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

                <div>
                  <Label htmlFor="specific-voice">Specific Voice</Label>
                  <Select
                    value={selectedVoice}
                    onValueChange={handleVoiceChange}
                  >
                    <SelectTrigger id="specific-voice" className="mt-2">
                      <SelectValue placeholder="Select specific voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((voiceOption) => (
                        <SelectItem key={voiceOption.id} value={voiceOption.id}>
                          {voiceOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model-select">Model</Label>
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger id="model-select" className="mt-2">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="stability-slider">Stability</Label>
                    <span className="text-sm text-gray-500">{stability[0]}</span>
                  </div>
                  <Slider
                    id="stability-slider"
                    min={0}
                    max={1}
                    step={0.05}
                    value={stability}
                    onValueChange={setStability}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher values make voice more consistent but may sound less natural
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="similarity-slider">Similarity Boost</Label>
                    <span className="text-sm text-gray-500">{similarityBoost[0]}</span>
                  </div>
                  <Slider
                    id="similarity-slider"
                    min={0}
                    max={1}
                    step={0.05}
                    value={similarityBoost}
                    onValueChange={setSimilarityBoost}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher values make voice sound more like the reference
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !text.trim() || !apiKey}
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
                ref={audioRef}
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
