// src/ai/flows/smart-add-on-suggestions.ts
'use server';
/**
 * @fileOverview AI-powered tool for recommending suitable policy add-ons based on individual client circumstances.
 *
 * - recommendAddOns - A function that takes selected coverage as input and returns a list of recommended policy add-ons by fetching the user's profile.
 * - RecommendAddOnsInput - The input type for the recommendAddOns function.
 * - RecommendAddOnsOutput - The return type for the recommendAddOns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getUserProfile } from '@/services/userService';

// This schema is for the flow's public input
const RecommendAddOnsInputSchema = z.object({
  selectedCoverage: z.object({
    policyType: z.string().describe('Type of insurance policy selected (e.g., auto, health, life, property)'),
    coverageAmount: z.number().describe('Amount of coverage selected'),
    deductible: z.number().describe('Deductible amount chosen by the user'),
  }).describe('Details of the selected insurance coverage'),
});
export type RecommendAddOnsInput = z.infer<typeof RecommendAddOnsInputSchema>;

const RecommendAddOnsOutputSchema = z.object({
  recommendedAddOns: z.array(z.string()).describe('List of recommended policy add-ons tailored to the user.'),
});
export type RecommendAddOnsOutput = z.infer<typeof RecommendAddOnsOutputSchema>;

export async function recommendAddOns(input: RecommendAddOnsInput): Promise<RecommendAddOnsOutput> {
  return recommendAddOnsFlow(input);
}

// This internal schema is what the LLM prompt actually needs
const SmartAddOnsPromptInputSchema = z.object({
    userProfile: z.object({
      age: z.number().describe('Age of the user'),
      location: z.string().describe('Location of the user'),
      familySize: z.number().describe('Number of family members'),
      occupation: z.string().describe('Occupation of the user'),
    }).describe('User profile information'),
    selectedCoverage: z.object({
      policyType: z.string().describe('Type of insurance policy selected (e.g., auto, health, life, property)'),
      coverageAmount: z.number().describe('Amount of coverage selected'),
      deductible: z.number().describe('Deductible amount chosen by the user'),
    }).describe('Details of the selected insurance coverage'),
});


const prompt = ai.definePrompt({
  name: 'recommendAddOnsPrompt',
  input: {schema: SmartAddOnsPromptInputSchema},
  output: {schema: RecommendAddOnsOutputSchema},
  prompt: `Based on the user's profile and selected coverage, recommend relevant policy add-ons to customize their insurance and ensure optimal protection.

User Profile:
Age: {{{userProfile.age}}}
Location: {{{userProfile.location}}}
Family Size: {{{userProfile.familySize}}}
Occupation: {{{userProfile.occupation}}}

Selected Coverage:
Policy Type: {{{selectedCoverage.policyType}}}
Coverage Amount: {{{selectedCoverage.coverageAmount}}}
Deductible: {{{selectedCoverage.deductible}}}

Recommended Add-ons:`,
});

const recommendAddOnsFlow = ai.defineFlow(
  {
    name: 'recommendAddOnsFlow',
    inputSchema: RecommendAddOnsInputSchema,
    outputSchema: RecommendAddOnsOutputSchema,
  },
  async (input) => {
    const userProfile = await getUserProfile();
    
    const promptInput = {
        userProfile: {
            age: userProfile.age,
            location: userProfile.location,
            familySize: userProfile.familySize,
            occupation: userProfile.occupation,
        },
        selectedCoverage: input.selectedCoverage,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
