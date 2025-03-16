
interface VoiceOption {
  id: string;
  name: string;
}

export interface TextToSpeechParams {
  text: string;
  voice: string;
  languageCode: string;
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  audioConfig: {
    audioEncoding: string;
    pitch: number;
    speakingRate: number;
  };
}

export const generateSpeech = async (
  apiKey: string,
  params: TextToSpeechParams
): Promise<Blob | null> => {
  try {
    const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    
    const requestBody = {
      input: {
        text: params.text
      },
      voice: {
        languageCode: params.languageCode,
        name: params.voice,
        ssmlGender: params.ssmlGender
      },
      audioConfig: params.audioConfig
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google TTS API Error:", errorData);
      return null;
    }

    const data = await response.json();
    
    // Convert base64 audio content to Blob
    const binaryString = atob(data.audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'audio/mp3' });
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

// Available voices by language
export const voices = {
  english: {
    male: [
      { id: "en-US-Standard-B", name: "Standard Male B" },
      { id: "en-US-Standard-D", name: "Standard Male D" },
      { id: "en-US-Wavenet-B", name: "Wavenet Male B" },
      { id: "en-US-Wavenet-D", name: "Wavenet Male D" }
    ],
    female: [
      { id: "en-US-Standard-A", name: "Standard Female A" },
      { id: "en-US-Standard-C", name: "Standard Female C" },
      { id: "en-US-Wavenet-A", name: "Wavenet Female A" },
      { id: "en-US-Wavenet-C", name: "Wavenet Female C" }
    ]
  },
  bengali: {
    male: [
      { id: "bn-IN-Standard-B", name: "Standard Male" },
      { id: "bn-IN-Wavenet-B", name: "Wavenet Male" }
    ],
    female: [
      { id: "bn-IN-Standard-A", name: "Standard Female" },
      { id: "bn-IN-Wavenet-A", name: "Wavenet Female" }
    ]
  }
};

// Voice models
export const models = [
  { id: "Standard", name: "Standard (Balanced quality)" },
  { id: "Wavenet", name: "Wavenet (Premium quality)" }
];

// Language codes
export const languageCodes = {
  english: "en-US",
  bengali: "bn-IN"
};
