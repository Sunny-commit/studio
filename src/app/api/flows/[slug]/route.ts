// This file is the bridge between your Next.js app and your Genkit flows.
'use server';

import {nextHandler} from '@genkit-ai/next';
import '@/ai/flows'; // Import all flows to ensure they are registered.

export const POST = nextHandler();
