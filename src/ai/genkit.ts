
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import next from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    next({
      // The Genkit Next.js plugin will automatically create the API routes.
      // We are creating them manually in src/app/api/flows/[slug]/route.ts
      // so we leave this empty.
    }),
  ],
  // Log errors to the console.
  logLevel: 'error',
  // Perform OpenTelemetry instrumentation and enable traces.
  enableTracing: true,
});
