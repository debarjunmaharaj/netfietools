import React, { useState, useRef, useEffect } from 'react';
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
import { Play, Pause, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getAvailableVoices,
  generateSpeech,
  stopSpeech,
  getVoicesByLanguage,
  languageNames,
  TextToSpeechParams,
  recordSpeech,
  createDownloadLink
} from '@/utils/speechApi';

interface VoiceOption {
  id: string;
  name: string;
  lang: string;
}

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Record<string, VoiceOption[]>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voicesByLanguage = await getVoicesByLanguage();
        setVoices(voicesByLanguage);
        
        const languages = Object.keys(voicesByLanguage);
        setAvailableLanguages(languages);
        
        if (languages.length > 0) {
          const defaultLang = languages.includes('en') ? 'en' : languages[0];
          setSelectedLanguage(defaultLang);
          
          if (voicesByLanguage[defaultLang]?.length > 0) {
            setSelectedVoice(voicesByLanguage[defaultLang][0].id);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load voices:", error);
        toast({
          title: "Error",
          description: "Failed to load available voices. Your browser may not support speech synthesis.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadVoices();
    
    return () => {
      stopSpeech();
    };
  }, [toast]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 10000) {
      setText(newText);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } else {
      toast({
        title: "Character limit reached",
        description: "The maximum allowed text length is 10,000 characters.",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    
    if (voices[value]?.length > 0) {
      setSelectedVoice(voices[value][0].id);
    } else {
      setSelectedVoice('');
    }
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
  };
  
  const handlePlayPause = async () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }
    
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "Please select a voice.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPlaying(true);
    
    try {
      const params: TextToSpeechParams = {
        text,
        voice: selectedVoice,
        pitch: pitch[0],
        rate: speed[0]
      };

      await generateSpeech(params);
      
      setIsPlaying(false);
      
      toast({
        title: "Success!",
        description: "Speech playback complete.",
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to generate speech. Your browser may not fully support speech synthesis.",
        variant: "destructive",
      });
    }
  };
  
  const handleRecordAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "Please select a voice.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRecording(true);
    
    try {
      const params: TextToSpeechParams = {
        text,
        voice: selectedVoice,
        pitch: pitch[0],
        rate: speed[0]
      };

      const audioBlob = await recordSpeech(params);
      
      if (audioBlob) {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        const url = createDownloadLink(audioBlob, "speech.wav");
        setAudioUrl(url);
        
        toast({
          title: "Success!",
          description: "Audio recorded successfully. You can now download it.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to record audio. Your browser may not support this feature.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recording audio:", error);
      toast({
        title: "Error",
        description: "Failed to record audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Text to Speech</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert text to natural-sounding speech using your browser's built-in speech synthesis
          </p>
        </div>
        
        {isLoading ? (
          <Card className="p-6 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="spinner mb-4 mx-auto"></div>
              <p>Loading available voices...</p>
            </div>
          </Card>
        ) : Object.keys(voices).length === 0 ? (
          <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-3 mb-3 text-amber-700 dark:text-amber-400">
              <AlertTriangle size={20} />
              <h3 className="text-lg font-medium">Speech Synthesis Not Available</h3>
            </div>
            <p className="mb-2">
              Your browser doesn't support the Web Speech API or no voices are available.
            </p>
            <p>
              Try using a modern browser like Chrome, Edge, or Safari for the best experience.
            </p>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="input" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Text Input</TabsTrigger>
                <TabsTrigger value="settings">Voice Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="input" className="mt-4">
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="text-input">Enter text to convert to speech</Label>
                        <span className="text-sm text-gray-500">{text.length}/10000</span>
                      </div>
                      <Textarea
                        id="text-input"
                        placeholder="Type or paste your text here (up to 10,000 characters)..."
                        value={text}
                        onChange={handleTextChange}
                        className="min-h-[200px] mt-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language-select">Language</Label>
                        <Select
                          value={selectedLanguage}
                          onValueChange={handleLanguageChange}
                        >
                          <SelectTrigger id="language-select" className="mt-2">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableLanguages.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {languageNames[lang] || lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="voice-select">Voice</Label>
                        <Select
                          value={selectedVoice}
                          onValueChange={handleVoiceChange}
                        >
                          <SelectTrigger id="voice-select" className="mt-2">
                            <SelectValue placeholder="Select voice" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedLanguage && voices[selectedLanguage] ? 
                              voices[selectedLanguage].map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                  {voice.name}
                                </SelectItem>
                              )) : 
                              <SelectItem value="" disabled>No voices available</SelectItem>
                            }
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
                        max={2.0}
                        step={0.1}
                        value={speed}
                        onValueChange={setSpeed}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="pitch-slider">Pitch</Label>
                        <span className="text-sm text-gray-500">{pitch[0]}</span>
                      </div>
                      <Slider
                        id="pitch-slider"
                        min={0.5}
                        max={2.0}
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
                onClick={handlePlayPause} 
                disabled={!text.trim() || !selectedVoice || isRecording}
                className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Speak
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleRecordAudio}
                disabled={!text.trim() || !selectedVoice || isPlaying || isRecording}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {isRecording ? "Recording..." : "Generate Audio"}
              </Button>
              
              {audioUrl && (
                <Button 
                  variant="secondary"
                  asChild
                >
                  <a href={audioUrl} download="speech.wav">
                    <Download className="mr-2 h-4 w-4" />
                    Download Audio
                  </a>
                </Button>
              )}
            </div>
            
            {!audioUrl && (
              <div className="mt-8 text-center">
                <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                  <div className="flex flex-col items-center space-y-2">
                    <Download className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click "Generate Audio" to create a downloadable audio file from your text.
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
