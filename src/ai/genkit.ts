
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';

configureGenkit({
  plugins: [
    googleAI(),
    next({
      // We are telling Genkit to create the API route for us.
      // The API route will be created at src/app/api/flows/route.ts
      // in this case.
      api: '/api/flows',
    }),
  ],
  // Log errors to the console.
  logLevel: 'error',
  // Perform OpenTelemetry instrumentation and enable traces.
  enableTracing: true,
});

export const ai = genkit;
