
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { runFlow } from '@genkit-ai/next/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, FileUp, Replace, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { paperCache } from '@/lib/paper-cache';
import { uploadFile } from '@/services/drive-service';
import type { Question, QuestionPaper } from '@/lib/types';
import { extractQuestionsFromPaper } from '@/ai/flows/extract-questions-flow';
import { Textarea } from './ui/textarea';

const questionSchema = z.object({
  id: z.string().optional(),
  questionNumber: z.string().min(1, 'Question number is required.'),
  text: z.string().min(3, 'Question text is required.'),
});

const paperSchema = z.object({
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters long.' }),
  year: z.string({ required_error: 'Please select a year.' }),
  examType: z.string({ required_error: 'Please select an exam type.' }),
  branch: z.string({ required_error: 'Please select a branch.' }),
  campus: z.string({ required_error: 'Please select a campus.' }),
  yearOfStudy: z.string({ required_error: 'Please select the year of study.' }),
  semester: z.string({ required_error: 'Please select a semester.' }),
  totalQuestions: z.string().min(1, {message: 'Please enter the total number of questions.'}).regex(/^\d+$/, { message: "Please enter a valid number."}),
  file: z.any().refine((files) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const isEditMode = !!searchParams.get('paperId');
    if (isEditMode) {
      return true; // File is not required in edit mode unless provided
    }
    return files && files.length > 0;
  }, 'File is required.'),
  questions: z.array(questionSchema).optional(),
});

type PaperFormValues = z.infer<typeof paperSchema>;

const years = ['2024', '2023', '2022', '2021', '2020'];
const examTypes = ['mid1', 'mid2', 'mid3', 'Final Sem Exam'];
const branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'common'];
const campuses = ['RK Valley', 'Nuzvid', 'Srikakulam', 'Ongole'];
const yearsOfStudy = ['P1', 'P2', 'E1', 'E2', 'E3', 'E4'];
const semesters = ['1', '2'];

export function SubmitPaperFormComponent() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const paperId = searchParams.get('paperId');
  const isEditMode = !!paperId;
  
  const existingPaper = isEditMode ? paperCache.getPaperById(paperId) : null;

  const form = useForm<PaperFormValues>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      subject: existingPaper?.subject ?? '',
      year: existingPaper?.year?.toString() ?? '',
      examType: existingPaper?.examType ?? '',
      branch: existingPaper?.branch ?? '',
      campus: existingPaper?.campus ?? '',
      yearOfStudy: existingPaper?.yearOfStudy ?? '',
      semester: existingPaper?.semester?.toString() ?? '',
      totalQuestions: existingPaper?.totalQuestions?.toString() ?? '',
      file: undefined,
      questions: existingPaper?.questions ?? [],
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const yearOfStudy = form.watch('yearOfStudy');
  const questions = form.watch('questions');
  const isBranchHidden = ['P1', 'P2'].includes(yearOfStudy);

  useEffect(() => {
    if (isBranchHidden) {
      form.setValue('branch', 'common');
    }
  }, [isBranchHidden, form]);
  
  useEffect(() => {
    if (isEditMode && !existingPaper) {
        toast({ variant: 'destructive', title: 'Error', description: 'Paper not found.' });
        router.push('/dashboard');
    }
  }, [isEditMode, existingPaper, toast, router]);

  useEffect(() => {
    if (questions) {
      form.setValue('totalQuestions', questions.length.toString());
    }
  }, [questions, form]);
  
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
  });

  const handleExtractQuestions = async () => {
    if (!uploadedFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file first to use the AI extraction feature.',
      });
      return;
    }
    
    setIsExtracting(true);
    toast({
        title: 'AI Extraction Started',
        description: 'The AI is analyzing your document. This might take a moment.',
    });

    try {
      const paperDataUri = await toBase64(uploadedFile);
      const result = await runFlow(extractQuestionsFromPaper, { paperDataUri });

      if (result.questions && result.questions.length > 0) {
        replace(result.questions); // Replace existing questions with extracted ones
        toast({
          title: 'Extraction Successful!',
          description: `${result.questions.length} questions have been extracted. Please review them below.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Extraction Failed',
          description: 'The AI could not find any questions in the document. Please add them manually.',
        });
      }
    } catch (error) {
       console.error("Question extraction failed", error);
       toast({
        variant: 'destructive',
        title: 'Extraction Error',
        description: 'An unexpected error occurred during AI extraction.',
      });
    } finally {
       setIsExtracting(false);
    }
  };

  const onSubmit = async (values: PaperFormValues) => {
    setIsSubmitting(true);

    try {
      let fileUrl = isEditMode ? existingPaper?.fileUrl : '';
      
      const fileInput = values.file?.[0];
      if (fileInput) {
         toast({
            title: 'Uploading File...',
            description: 'Please wait while we upload your file. This may take a moment.',
          });
        fileUrl = await uploadFile(fileInput); 
      } else if (!isEditMode) {
         toast({
            variant: 'destructive',
            title: 'File Required',
            description: 'You must upload a question paper file.',
          });
         setIsSubmitting(false);
         return;
      }
      
      const paperData: Omit<QuestionPaper, 'id' | 'questions'> = {
          subject: values.subject,
          year: parseInt(values.year, 10),
          examType: values.examType as QuestionPaper['examType'],
          branch: values.branch as QuestionPaper['branch'],
          campus: values.campus as QuestionPaper['campus'],
          yearOfStudy: values.yearOfStudy as QuestionPaper['yearOfStudy'],
          semester: parseInt(values.semester, 10) as QuestionPaper['semester'],
          totalQuestions: parseInt(values.totalQuestions, 10),
          fileUrl: fileUrl || 'https://www.africau.edu/images/default/sample.pdf',
      };
      
      const questionsData = values.questions?.map(q => ({...q, id: `q${Date.now()}${Math.random()}`, solutions: []})) ?? [];

      if (isEditMode && paperId) {
        paperCache.updatePaper(paperId, {...paperData, questions: questionsData });
        toast({
          title: 'Paper Replaced!',
          description: 'The question paper has been successfully updated.',
        });
        router.push(`/papers/${paperId}`);
      } else {
        const newPaper = paperCache.addPaper(paperData, questionsData);
        toast({
          title: 'Paper Submitted!',
          description: 'Thank you for your contribution.',
        });
        router.push(`/papers/${newPaper.id}`);
      }
    } catch (error) {
       console.error("Submission failed", error);
       toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not upload the paper. Please try again.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const PageIcon = isEditMode ? Replace : FileUp;
  const pageTitle = isEditMode ? 'Replace Paper' : 'Submit a Paper';
  const pageDescription = isEditMode ? 'Update an existing question paper with a new file or corrected details.' : 'Help the community grow by sharing past question papers.';
  const buttonText = isEditMode ? 'Replace Paper' : 'Submit Paper';

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-3">
          <PageIcon className="h-10 w-10 text-primary" />
          {pageTitle}
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          {pageDescription}
        </p>
      </section>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Paper Details</CardTitle>
                <CardDescription>{isEditMode ? 'Edit the details and upload a new file if needed.' : 'Fill in the details below to upload a new question paper.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Engineering Mathematics-II" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="totalQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Questions</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 8" {...field} readOnly className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                           <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select exam type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {examTypes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isBranchHidden && (
                     <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.filter(b => b !== 'common').map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="campus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                           <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {campuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Study</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select year of study" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearsOfStudy.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                             <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                 <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Question Paper File {isEditMode && '(Optional: only if you want to replace it)'}</FormLabel>
                      <FormControl>
                         <div className="relative">
                             <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input type="file" className="pl-9" accept="application/pdf,image/*" onChange={(e) => {
                                onChange(e.target.files);
                                setUploadedFile(e.target.files ? e.target.files[0] : null);
                             }} />
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>

            <div className="border-t border-b">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>
                        Use the AI to extract questions, or add them manually.
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={handleExtractQuestions} disabled={isExtracting || !uploadedFile}>
                      {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      AI Extract Questions
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.length > 0 ? (
                  fields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/30">
                       <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
                          <FormField
                            control={form.control}
                            name={`questions.${index}.questionNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Q. Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g. 1(a)" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`questions.${index}.text`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between items-center">
                                  <FormLabel>Question Text</FormLabel>
                                  <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                                <FormControl>
                                  <Textarea {...field} placeholder="Enter the full question text" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No questions yet. Upload a paper and use the AI extractor, or add one manually.
                  </div>
                )}
                <div className="flex justify-end">
                   <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ questionNumber: '', text: '' })}
                    >
                      Add Question Manually
                    </Button>
                </div>
              </CardContent>
            </div>

            <CardContent className="pt-6">
              <div className="flex justify-end items-center">
                <Button type="submit" disabled={isSubmitting} size="lg" className="font-bold">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {buttonText}
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
