
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import next from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    // The next() plugin is used to configure Genkit for use with Next.js.
    // By leaving it empty, it will automatically handle API route creation
    // when the handler is exported from a route file.
    next(),
  ],
  // Log errors to the console.
  logLevel: 'error',
  // Perform OpenTelemetry instrumentation and enable traces.
  enableTracing: true,
});
