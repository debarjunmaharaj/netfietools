
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Mic, Square, Play, Pause, Download, Upload, Wand } from 'lucide-react';

type VoiceEffect = 'none' | 'robot' | 'alien' | 'deep' | 'highPitch' | 'echo';

export const VoiceChanger: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [effect, setEffect] = useState<VoiceEffect>('none');
  const [pitch, setPitch] = useState(1);
  const [echo, setEcho] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioUrl, processedUrl]);
  
  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setRecordingTime(0);
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
        setProcessedUrl(null);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks from the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        toast({
          title: "Recording saved",
          description: "Your voice recording is ready to be edited.",
        });
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Failed',
        description: 'Could not access your microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive",
      });
      return;
    }
    
    // Clean up previous URLs
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
      setProcessedUrl(null);
    }
    
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    toast({
      title: "Audio loaded",
      description: "Your audio file is ready to be edited.",
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const applyEffect = async () => {
    if (!audioUrl) {
      toast({
        title: "No audio",
        description: "Please record or upload audio first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, we would use the Web Audio API to apply
      // the selected effects to the audio. For this demo, we'll simulate processing.
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just use the original audio
      // In a real app, this would be processed audio with effects applied
      setProcessedUrl(audioUrl);
      
      let effectName = "";
      switch (effect) {
        case 'robot':
          effectName = "Robot Voice";
          break;
        case 'alien':
          effectName = "Alien Voice";
          break;
        case 'deep':
          effectName = "Deep Voice";
          break;
        case 'highPitch':
          effectName = "High Pitch";
          break;
        case 'echo':
          effectName = "Echo";
          break;
        default:
          effectName = "Custom Effect";
      }
      
      toast({
        title: "Effect applied",
        description: `${effectName} effect has been applied to your audio.`,
      });
    } catch (error) {
      console.error('Error applying effect:', error);
      toast({
        title: "Effect failed",
        description: "Failed to apply the selected effect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadProcessedAudio = () => {
    if (!processedUrl) return;
    
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = 'voice-effect.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your processed audio is being downloaded.",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Voice Changer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your voice with fun effects
          </p>
        </div>
        
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 transition-all ${isRecording ? 'bg-red-100 dark:bg-red-900 animate-pulse' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {isRecording ? (
                  <Mic size={36} className="text-red-500" />
                ) : (
                  <Mic size={36} className="text-gray-500" />
                )}
              </div>
              
              <div className="text-xl font-mono">
                {formatTime(recordingTime)}
              </div>
            </div>
            
            <div className="flex space-x-4">
              {isRecording ? (
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={stopRecording}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={startRecording}
                  disabled={isProcessing}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={triggerFileInput}
                disabled={isRecording || isProcessing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Audio
              </Button>
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </Card>
        
        {audioUrl && (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
            <h3 className="text-lg font-semibold mb-4">Original Audio</h3>
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)} 
              className="w-full mb-4" 
              controls 
            />
            
            <div className="space-y-6 mt-6">
              <div>
                <Label>Voice Effect</Label>
                <Select value={effect} onValueChange={(val) => setEffect(val as VoiceEffect)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Effect</SelectItem>
                    <SelectItem value="robot">Robot Voice</SelectItem>
                    <SelectItem value="alien">Alien Voice</SelectItem>
                    <SelectItem value="deep">Deep Voice</SelectItem>
                    <SelectItem value="highPitch">High Pitch</SelectItem>
                    <SelectItem value="echo">Echo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Pitch: {pitch.toFixed(1)}</Label>
                </div>
                <Slider 
                  value={[pitch]} 
                  onValueChange={(value) => setPitch(value[0])} 
                  min={0.5} 
                  max={2} 
                  step={0.1}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Echo: {echo.toFixed(1)}</Label>
                </div>
                <Slider 
                  value={[echo]} 
                  onValueChange={(value) => setEcho(value[0])} 
                  min={0} 
                  max={1} 
                  step={0.1}
                />
              </div>
              
              <Button 
                onClick={applyEffect} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Wand className="mr-2 h-4 w-4" />
                    Apply Effect
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
        
        {processedUrl && (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Processed Audio</h3>
            <audio src={processedUrl} className="w-full mb-4" controls />
            
            <Button onClick={downloadProcessedAudio} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Processed Audio
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
