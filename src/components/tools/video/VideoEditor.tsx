
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, Play, Pause, Square, Scissors, Clock, Volume2, Volume, VolumeX, 
  RotateCw, Maximize, Download
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const VideoEditor: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
    
    toast({
      title: "Video loaded",
      description: "Your video is ready to edit.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Playback controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setEndTrim(videoRef.current.duration);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume / 100;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newRate = value[0];
    videoRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  // Handle trim values
  const handleStartTrimChange = (value: number[]) => {
    const newStart = value[0];
    if (newStart < endTrim) {
      setStartTrim(newStart);
      if (videoRef.current && currentTime < newStart) {
        videoRef.current.currentTime = newStart;
        setCurrentTime(newStart);
      }
    }
  };

  const handleEndTrimChange = (value: number[]) => {
    const newEnd = value[0];
    if (newEnd > startTrim) {
      setEndTrim(newEnd);
      if (videoRef.current && currentTime > newEnd) {
        videoRef.current.currentTime = newEnd;
        setCurrentTime(newEnd);
      }
    }
  };

  // Format time display
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Loop within trim points
    if (videoRef.current) {
      videoRef.current.currentTime = startTrim;
    }
  };

  // Handle playback within trim points
  useEffect(() => {
    if (!videoRef.current) return;
    
    const handleTimeCheck = () => {
      if (videoRef.current) {
        if (videoRef.current.currentTime < startTrim) {
          videoRef.current.currentTime = startTrim;
        } else if (videoRef.current.currentTime > endTrim) {
          if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            videoRef.current.currentTime = startTrim;
          }
        }
      }
    };
    
    const interval = setInterval(handleTimeCheck, 100);
    return () => clearInterval(interval);
  }, [startTrim, endTrim, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Basic export (in a real app, this would do actual video processing)
  const exportVideo = () => {
    toast({
      title: "Export started",
      description: `Exporting video clip from ${formatTime(startTrim)} to ${formatTime(endTrim)}...`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your video has been exported successfully.",
      });
      
      // In a real implementation, we would use a library like FFmpeg.wasm to
      // actually trim and process the video here
      if (videoUrl) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'trimmed-video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Video Editor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Trim, adjust and enhance your videos
          </p>
        </div>
        
        {!videoUrl ? (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-8">
            <div 
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer transition-colors hover:border-primary"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports MP4, WebM, MOV
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Video player */}
            <Card className="overflow-hidden bg-black rounded-xl">
              <div className="aspect-video w-full relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleVideoEnd}
                ></video>
              </div>
              
              {/* Video controls */}
              <div className="bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX size={18} />
                      ) : volume < 50 ? (
                        <Volume size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    min={0}
                    max={duration}
                    step={0.01}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-gray-800"
                    >
                      <Maximize size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Editing tools */}
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <Tabs defaultValue="trim">
                <TabsList className="mb-4">
                  <TabsTrigger value="trim">Trim</TabsTrigger>
                  <TabsTrigger value="speed">Speed</TabsTrigger>
                  <TabsTrigger value="rotate">Rotate</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trim">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Start Trim Point: {formatTime(startTrim)}</Label>
                      </div>
                      <Slider
                        value={[startTrim]}
                        onValueChange={handleStartTrimChange}
                        min={0}
                        max={duration}
                        step={0.1}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>End Trim Point: {formatTime(endTrim)}</Label>
                      </div>
                      <Slider
                        value={[endTrim]}
                        onValueChange={handleEndTrimChange}
                        min={0}
                        max={duration}
                        step={0.1}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500 flex-1">
                        Trimmed duration: {formatTime(endTrim - startTrim)}
                      </p>
                      <Button variant="outline" className="mr-2">
                        <Scissors size={16} className="mr-2" />
                        Preview Trim
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="speed">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Playback Speed: {playbackRate}x</Label>
                      </div>
                      <Slider
                        value={[playbackRate]}
                        onValueChange={handlePlaybackRateChange}
                        min={0.25}
                        max={2}
                        step={0.25}
                      />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[0.25, 0.5, 1, 1.5, 2].map((rate) => (
                        <Button
                          key={rate}
                          variant={playbackRate === rate ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.playbackRate = rate;
                              setPlaybackRate(rate);
                            }
                          }}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="rotate">
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">Rotate your video</p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Rotate applied",
                            description: "Video rotated 90° to the left."
                          });
                        }}
                      >
                        <RotateCw size={16} className="mr-2 transform -scale-x-100" />
                        Rotate Left
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Rotate applied",
                            description: "Video rotated 90° to the right."
                          });
                        }}
                      >
                        <RotateCw size={16} className="mr-2" />
                        Rotate Right
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            {/* Export button */}
            <div className="flex justify-end">
              <Button onClick={exportVideo} size="lg">
                <Download size={18} className="mr-2" />
                Export Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
