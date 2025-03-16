
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Download, AlertTriangle, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSupported, setRecordingSupported] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if recording is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingSupported(false);
    }
    
    return () => {
      // Clean up on unmount
      stopRecording();
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setRecordingTime(0);
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
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
        setAudioURL(url);
        
        // Stop all tracks from the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
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
  
  const handlePlayPause = () => {
    if (!audioRef.current || !audioURL) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!recordingSupported) {
    return (
      <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-center space-x-3 mb-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-medium">Audio Recording Not Supported</h3>
        </div>
        <p>
          Your browser doesn't support audio recording. Try using a modern browser like Chrome, Edge, or Safari.
        </p>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Audio Recorder</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record high-quality audio using your microphone and download it
          </p>
        </div>
        
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all ${isRecording ? 'bg-red-100 dark:bg-red-900 animate-pulse' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Mic size={48} className={`${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
            </div>
            
            <div className="text-2xl font-mono mb-6">
              {formatTime(recordingTime)}
            </div>
            
            <div className="flex gap-4">
              {isRecording ? (
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={stopRecording}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={startRecording}
                  disabled={isPlaying}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              )}
            </div>
          </div>
        </Card>
        
        {audioURL && (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <div className="flex flex-col items-center">
              <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="w-full mb-4" controls />
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePlayPause}
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
                
                <Button asChild>
                  <a href={audioURL} download="recording.wav">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
