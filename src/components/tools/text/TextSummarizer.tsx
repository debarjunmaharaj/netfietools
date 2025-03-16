
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, Copy } from 'lucide-react';

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [summarizedText, setSummarizedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [length, setLength] = useState<number[]>([30]);
  const [style, setStyle] = useState<string>('concise');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const simulateSummarization = async (text: string, length: number, style: string) => {
    // This is a placeholder for a real API call
    // In a production app, you'd integrate with OpenAI, Perplexity, or another text summarization API
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const firstSentence = text.split('.')[0];
        resolve(`Summarized version of: "${firstSentence}..." (${length}% length, ${style} style) - This is a simulated summary. In a production environment, this would be generated using an AI model like GPT-4 or similar.`);
      }, 1500);
    });
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const summary = await simulateSummarization(text, length[0], style);
      setSummarizedText(summary);
      toast({
        title: "Success",
        description: "Text summarized successfully!",
      });
    } catch (error) {
      console.error("Error summarizing text:", error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summarizedText);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Text Summarizer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform long articles and documents into concise summaries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Original Text
                </Label>
                <Textarea
                  id="input-text"
                  placeholder="Paste your article or long text here..."
                  className="min-h-[300px] mt-2"
                  value={text}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="length-slider">Summary Length</Label>
                    <span className="text-sm text-gray-500">{length[0]}%</span>
                  </div>
                  <Slider
                    id="length-slider"
                    min={10}
                    max={50}
                    step={5}
                    value={length}
                    onValueChange={setLength}
                  />
                </div>

                <div>
                  <Label htmlFor="style-select">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style-select" className="mt-2">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="bullet">Bullet Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSummarize} 
                  disabled={isLoading || !text.trim()} 
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    "Summarize Text"
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="summary-text">
                  Summarized Text
                </Label>
                {summarizedText && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="summary-text"
                  className="min-h-[300px] mt-2"
                  value={summarizedText}
                  readOnly
                  placeholder="Your summary will appear here..."
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm">Creating your summary...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
