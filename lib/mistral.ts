import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  console.warn('MISTRAL_API_KEY is not defined in environment variables');
}

export const mistral = new Mistral({
  apiKey: apiKey || '',
});
