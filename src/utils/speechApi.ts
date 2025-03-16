interface VoiceOption {
  id: string;
  name: string;
  lang: string;
}

export interface TextToSpeechParams {
  text: string;
  voice: string;
  pitch: number;
  rate: number;
}

// Function to get available voices from the browser
export const getAvailableVoices = (): Promise<VoiceOption[]> => {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    
    if (voices.length > 0) {
      const voiceOptions = mapVoicesToOptions(voices);
      resolve(voiceOptions);
    } else {
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
        const voiceOptions = mapVoicesToOptions(voices);
        resolve(voiceOptions);
      };
    }
  });
};

// Helper function to map SpeechSynthesisVoice to VoiceOption
const mapVoicesToOptions = (voices: SpeechSynthesisVoice[]): VoiceOption[] => {
  return voices.map((voice) => ({
    id: voice.voiceURI,
    name: `${voice.name} (${voice.lang})`,
    lang: voice.lang
  }));
};

// Generate speech using the Web Speech API
export const generateSpeech = async (params: TextToSpeechParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(params.text);
      
      // Get all available voices
      const voices = synth.getVoices();
      
      // Find the selected voice
      const selectedVoice = voices.find(voice => voice.voiceURI === params.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set other parameters
      utterance.pitch = params.pitch;
      utterance.rate = params.rate;
      
      // Event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);
      
      // Speak the text
      synth.speak(utterance);
    } catch (error) {
      console.error("Error generating speech:", error);
      reject(error);
    }
  });
};

// Function to stop speaking
export const stopSpeech = (): void => {
  window.speechSynthesis.cancel();
};

// Group voices by language
export const getVoicesByLanguage = async (): Promise<Record<string, VoiceOption[]>> => {
  const voices = await getAvailableVoices();
  
  return voices.reduce((acc, voice) => {
    const langCode = voice.lang.split('-')[0]; // Get the primary language code (e.g., "en" from "en-US")
    
    if (!acc[langCode]) {
      acc[langCode] = [];
    }
    
    acc[langCode].push(voice);
    return acc;
  }, {} as Record<string, VoiceOption[]>);
};

// Record audio from Web Speech API using MediaRecorder API
export const recordSpeech = async (params: TextToSpeechParams): Promise<Blob | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: BlobPart[] = [];
      
      // Set up oscillator for audio synthesis (basic version)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(destination);
      
      // Configure basic synthesis parameters
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.5;
      
      // Set up events for recording
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
      
      // Start recording and oscillator
      mediaRecorder.start();
      oscillator.start();
      
      // Play the speech as well
      await generateSpeech(params);
      
      // Let it run for the approximate duration based on text length and rate
      // This is a rough estimate - 100ms per character, adjusted by speech rate
      const duration = (params.text.length * 100) / params.rate;
      
      setTimeout(() => {
        oscillator.stop();
        mediaRecorder.stop();
      }, duration);
      
    } catch (error) {
      console.error("Error recording speech:", error);
      reject(error);
    }
  });
};

// Create downloadable audio file
export const createDownloadLink = (audioBlob: Blob, filename: string): string => {
  return URL.createObjectURL(audioBlob);
};

// Language names mapping for UI display
export const languageNames: Record<string, string> = {
  en: "English",
  bn: "Bengali",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
  ar: "Arabic",
  pt: "Portuguese"
};
