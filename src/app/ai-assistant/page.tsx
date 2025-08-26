
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { runFlow } from '@genkit-ai/next/client';
import { Bot, Loader2, Paperclip, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { privateChat } from '@/ai/flows/private-chat-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const chatSchema = z.object({
  questionText: z.string().min(1, 'Please enter a question.'),
  mediaFile: z.any().optional(),
});

type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

export default function AIAssistantPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      questionText: '',
    },
  });

  //const fileRef = form.register('mediaFile');

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    setIsSubmitting(true);
    const userMessage: ChatMessage = { sender: 'user', text: values.questionText };
    setChatHistory((prev) => [...prev, userMessage]);
    form.reset({ questionText: '' });
    setMediaPreview(null); // Clear preview after sending

    try {
      let mediaDataUri: string | undefined = undefined;
      if (values.mediaFile && values.mediaFile[0]) {
        mediaDataUri = await toBase64(values.mediaFile[0]);
      }
      
      const result = await runFlow(privateChat, {
        questionText: values.questionText,
        mediaDataUri: mediaDataUri,
      });

      const aiMessage: ChatMessage = { sender: 'ai', text: result.answer };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setChatHistory((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Failed',
        description: 'Something went wrong while getting a response.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaPreview(file.name);
    } else {
      setMediaPreview(null);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex h-[calc(100vh-8rem)] justify-center">
      <Card className="w-full max-w-3xl flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-3 font-headline text-2xl">
            <Bot className="h-8 w-8 text-primary" />
            Your Private AI Assistant
          </CardTitle>
          <CardDescription>
            Get one-on-one help. Upload a paper or ask a question directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {chatHistory.length === 0 ? (
                 <div className="text-center text-muted-foreground">Ask a question to start the conversation.</div>
              ) : (
                chatHistory.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-md rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                     {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
               {isSubmitting && chatHistory.at(-1)?.sender === 'user' && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                     <div className="max-w-md rounded-lg p-3 bg-muted flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4 bg-background/80">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type your question or describe the problem in the upload..."
                          {...field}
                          autoComplete="off"
                          disabled={isSubmitting}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={form.control}
                  name="mediaFile"
                  render={({ field }) => (
                    <Button asChild variant="outline" size="icon" className="relative shrink-0">
                      <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Paperclip />
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,image/*"
                      //    {...fileRef}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleFileChange(e);
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    </Button>
                  )}
                />

                <Button type="submit" size="icon" disabled={isSubmitting} className="shrink-0">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </Form>
            {mediaPreview && (
                <div className="text-xs text-muted-foreground mt-2 px-1 flex items-center gap-2">
                    <Paperclip className="h-3 w-3" />
                    <span>{mediaPreview}</span>
                     <button onClick={() => {
                        form.setValue('mediaFile', null);
                        setMediaPreview(null);
                     }} className="text-destructive hover:underline text-xs">(remove)</button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
