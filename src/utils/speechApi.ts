
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
      // Chrome sometimes needs a callback to get voices
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

// Record audio from Web Speech API
export const recordSpeech = async (params: TextToSpeechParams): Promise<Blob | null> => {
  try {
    // Unfortunately, Web Speech API doesn't have a built-in way to get audio data
    // This is a limitation, we can only play the audio but not download it directly
    
    // For now, let's just play the speech
    await generateSpeech(params);
    
    // Return null since we can't get the audio data from Web Speech API directly
    // We'll handle this in the UI to show appropriate messages
    return null;
  } catch (error) {
    console.error("Error recording speech:", error);
    return null;
  }
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
