
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileUp, FilePlus, FileX, FileDown, Layers, SeparatorHorizontal, Loader2 } from 'lucide-react';

export const PdfTools: React.FC = () => {
  const [mergeFiles, setMergeFiles] = useState<FileList | null>(null);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Handle file selection for merging
  const handleMergeFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMergeFiles(e.target.files);
    }
  };

  // Handle file selection for splitting
  const handleSplitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSplitFile(e.target.files[0]);
    }
  };

  // Handle file selection for compression
  const handleCompressFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompressFile(e.target.files[0]);
    }
  };

  // Simulate processing files
  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "PDF processing completed successfully.",
      });
      
      // For a real implementation, this would return a URL to download the processed file
      return 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to process PDF. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle merging PDFs
  const handleMergePdfs = async () => {
    if (!mergeFiles || mergeFiles.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least two PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    const result = await simulateProcessing();
    if (result) {
      // For a real implementation, you'd create a download link
      const link = document.createElement('a');
      link.href = result;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle splitting PDF
  const handleSplitPdf = async () => {
    if (!splitFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to split.",
        variant: "destructive",
      });
      return;
    }

    const result = await simulateProcessing();
    if (result) {
      // For a real implementation, you'd create a download link or a zip with multiple PDFs
      const link = document.createElement('a');
      link.href = result;
      link.download = 'split.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle compressing PDF
  const handleCompressPdf = async () => {
    if (!compressFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to compress.",
        variant: "destructive",
      });
      return;
    }

    const result = await simulateProcessing();
    if (result) {
      // For a real implementation, you'd create a download link
      const link = document.createElement('a');
      link.href = result;
      link.download = 'compressed.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">PDF Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Merge, split, compress, and convert PDF files easily
          </p>
        </div>

        <Tabs defaultValue="merge" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Split PDF</TabsTrigger>
            <TabsTrigger value="compress">Compress PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="merge" className="mt-4">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="merge-files" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Select PDFs to Merge
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Input
                      id="merge-files"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleMergeFilesChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="merge-files"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Drag & drop files here or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Select multiple PDF files)
                      </p>
                    </label>
                  </div>
                  {mergeFiles && mergeFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Selected files:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-4">
                        {Array.from(mergeFiles).map((file, index) => (
                          <li key={index} className="truncate">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleMergePdfs}
                  disabled={isProcessing || !mergeFiles || mergeFiles.length < 2}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Merge PDFs
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="split" className="mt-4">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="split-file" className="flex items-center gap-2">
                    <SeparatorHorizontal className="h-4 w-4" />
                    Select PDF to Split
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Input
                      id="split-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleSplitFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="split-file"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Drag & drop a PDF file here or click to browse
                      </p>
                    </label>
                  </div>
                  {splitFile && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Selected file:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {splitFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSplitPdf}
                  disabled={isProcessing || !splitFile}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileX className="mr-2 h-4 w-4" />
                      Split PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compress" className="mt-4">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="compress-file" className="flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Select PDF to Compress
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Input
                      id="compress-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleCompressFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="compress-file"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Drag & drop a PDF file here or click to browse
                      </p>
                    </label>
                  </div>
                  {compressFile && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Selected file:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {compressFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCompressPdf}
                  disabled={isProcessing || !compressFile}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Compress PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
