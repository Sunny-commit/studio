
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import next from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    next({
      // We are telling Genkit to create the API route for us.
      // The API route will be created at src/app/api/flows/[slug]/route.ts
      // in this case.
      api: '/api/flows/[slug]',
    }),
  ],
  // Log errors to the console.
  logLevel: 'error',
  // Perform OpenTelemetry instrumentation and enable traces.
  enableTracing: true,
});
