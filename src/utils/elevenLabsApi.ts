
interface TextToSpeechParams {
  text: string;
  voice_id: string;
  model_id: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export const generateSpeech = async (
  apiKey: string,
  params: TextToSpeechParams
): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${params.voice_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: params.text,
          model_id: params.model_id,
          voice_settings: params.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs API Error:", errorData);
      return null;
    }

    return await response.blob();
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

// List of available voices with their IDs
export const voices = {
  english: {
    male: [
      { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
      { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
      { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum" },
    ],
    female: [
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
      { id: "D38z5RcWu1voky8WS1ja", name: "Emily" },
    ],
  },
  bengali: {
    male: [
      { id: "pNInz6obpgDQGcFmaJgB", name: "Rahul" },
      { id: "N2lVS1w4EtoT3dr4eOWO", name: "Amit" },
    ],
    female: [
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Priya" },
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Sonia" },
    ],
  },
};

// List of available models
export const models = [
  { id: "eleven_multilingual_v2", name: "Multilingual v2 (High Quality)" },
  { id: "eleven_turbo_v2", name: "Turbo v2 (Faster)" },
];
