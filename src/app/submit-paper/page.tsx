
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, FileUp, Replace, Power } from 'lucide-react';
import { paperCache } from '@/lib/paper-cache';
import { uploadFile } from '@/services/drive-service';
import type { QuestionPaper } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

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
    const searchParams = new URLSearchParams(window.location.search);
    const isEditMode = !!searchParams.get('paperId');
    // File is not required in edit mode, but if it is provided, it must have a length > 0
    if (isEditMode) {
      return true;
    }
    // In create mode, file is required
    return files && files.length > 0;
  }, 'File is required.'),
});

const years = ['2024', '2023', '2022', '2021', '2020'];
const examTypes = ['mid1', 'mid2', 'mid3', 'Final Sem Exam'];
const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];
const campuses = ['RK Valley', 'Nuzvid', 'Srikakulam', 'Ongole'];
const yearsOfStudy = ['P1', 'P2', 'E1', 'E2', 'E3', 'E4'];
const semesters = ['1', '2'];

function SubmitPaperFormComponent() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const paperId = searchParams.get('paperId');
  const isEditMode = !!paperId;
  const { isAuthenticated } = useAuth();
  
  const existingPaper = isEditMode ? paperCache.getPaperById(paperId) : null;

  const form = useForm<z.infer<typeof paperSchema>>({
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
    }
  });
  
  useEffect(() => {
    const authed = searchParams.get('authed');
    if (authed) {
        toast({
            title: 'Google Drive Connected!',
            description: 'You can now upload files directly to your drive.',
        });
        const cleanUrl = paperId ? `/submit-paper?paperId=${paperId}` : '/submit-paper';
        router.replace(cleanUrl);
    }
  }, [searchParams, toast, router, paperId]);
  
  useEffect(() => {
    if (isEditMode && !existingPaper) {
        toast({ variant: 'destructive', title: 'Error', description: 'Paper not found.' });
        router.push('/dashboard');
    }
  }, [isEditMode, existingPaper, toast, router]);

  const onSubmit = async (values: z.infer<typeof paperSchema>) => {
    if (!isAuthenticated) {
        toast({
            variant: 'destructive',
            title: 'Not Authenticated',
            description: 'Please sign in with Google to submit a paper.',
        });
        return;
    }
    
    setIsSubmitting(true);

    try {
      let fileUrl = isEditMode ? existingPaper?.fileUrl : '';
      
      const fileInput = values.file?.[0];
      if (fileInput) {
         toast({
            title: 'Uploading File...',
            description: 'Please wait while we upload your file to Google Drive.',
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

      if (isEditMode && paperId) {
        paperCache.updatePaper(paperId, paperData);
        toast({
          title: 'Paper Replaced!',
          description: 'The question paper has been successfully updated.',
        });
        router.push(`/papers/${paperId}`);
      } else {
        const newPaper = paperCache.addPaper(paperData);
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
        description: 'Could not upload the paper. Please ensure you are signed in and have connected Google Drive.',
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

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle>Paper Details</CardTitle>
            <CardDescription>{isEditMode ? 'Edit the details and upload a new file if needed.' : 'Fill in the details below to upload a new question paper.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
             <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Please Sign In</h3>
                <p className="text-muted-foreground mb-6">You need to be signed in to submit or replace papers.</p>
                 <Button asChild>
                    <Link href={`/api/auth/google?redirect=/submit-paper`}>Sign In with Google</Link>
                </Button>
             </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Input type="number" placeholder="e.g., 8" {...field} />
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
                             {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                             <Input type="file" className="pl-9" accept="image/*,.pdf,.doc,.docx" onChange={(e) => onChange(e.target.files)} />
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center pt-2">
                   <Button type="button" variant="outline" asChild>
                     <Link href={`/api/auth/google?redirect=/submit-paper${paperId ? `?paperId=${paperId}` : ''}`}>
                       <Power className="mr-2 h-4 w-4" />
                       Connect Drive
                     </Link>
                   </Button>
                  <Button type="submit" disabled={isSubmitting} size="lg" className="font-bold">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buttonText}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubmitPaperPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitPaperFormComponent />
    </Suspense>
  );
}
