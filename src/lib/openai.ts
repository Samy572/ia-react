import OpenAI from 'openai';

const openAiKey = process.env.OPENAI_API_KEY;

if (!openAiKey) {
	throw new Error('open ai key is not defined');
}

export const openai = new OpenAI({
	apiKey: openAiKey,
});
