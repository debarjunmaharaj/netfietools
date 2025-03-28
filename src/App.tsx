
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImageTools from "./pages/ImageTools";
import AudioTools from "./pages/AudioTools";
import TextTools from "./pages/TextTools";
import VideoTools from "./pages/VideoTools";
import BackgroundRemoverPage from "./pages/BackgroundRemoverPage";
import ImageConverterPage from "./pages/ImageConverterPage";
import ImageEditorPage from "./pages/ImageEditorPage";
import TextToSpeechPage from "./pages/TextToSpeechPage";
import TextSummarizerPage from "./pages/TextSummarizerPage";
import PdfToolsPage from "./pages/PdfToolsPage";
import AudioRecorderPage from "./pages/AudioRecorderPage";
import AudioConverterPage from "./pages/AudioConverterPage";
import VoiceChangerPage from "./pages/VoiceChangerPage";
import VideoEditorPage from "./pages/VideoEditorPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image" element={<ImageTools />} />
          <Route path="/audio" element={<AudioTools />} />
          <Route path="/text" element={<TextTools />} />
          <Route path="/video" element={<VideoTools />} />
          <Route path="/image/background-remover" element={<BackgroundRemoverPage />} />
          <Route path="/image/converter" element={<ImageConverterPage />} />
          <Route path="/image/editor" element={<ImageEditorPage />} />
          <Route path="/text/text-to-speech" element={<TextToSpeechPage />} />
          <Route path="/text/summarizer" element={<TextSummarizerPage />} />
          <Route path="/text/pdf-tools" element={<PdfToolsPage />} />
          <Route path="/audio/recorder" element={<AudioRecorderPage />} />
          <Route path="/audio/converter" element={<AudioConverterPage />} />
          <Route path="/audio/voice-changer" element={<VoiceChangerPage />} />
          <Route path="/video/editor" element={<VideoEditorPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
