'use client';

import { Suspense } from 'react';
import { SubmitPaperFormComponent } from '@/components/submit-paper-form';
import dynamic from 'next/dynamic';

const DynamicSubmitPaperForm = dynamic(
  () => import('@/components/submit-paper-form').then(mod => mod.SubmitPaperFormComponent),
  { ssr: false, loading: () => <div className="text-center p-8">Loading form...</div> }
);

export default function SubmitPaperPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <DynamicSubmitPaperForm />
    </Suspense>
  );
}
