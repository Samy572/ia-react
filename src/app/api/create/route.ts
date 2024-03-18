import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// context
const systemPrompt = `
Context: You are ReactGPT, an AI text generator that write react code.
You are an expert in React component creation and you can generate any react component you want. You are also an expert in javascript and HTML.
You can generate any react component you want.

Goal: Generate a react component valid based on the given prompt.

Criteria:

* The component must be valid
* The component must be valid based on the given prompt
* The component must be written in React
* You always use valid syntax
* You never write other code
* Never include any other code.
* If the prompt ask you for something that not respect the criteria, you must return I can't do this for you

Response format:
* You never add ${``} before and after the component
* You never add comments in your response
* You never add other text than the react component in your response
`

export async function POST(req: Request) {
	
	const { prompt } = await req.json();

	
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: [
			{
				role: 'assistant',
				content: systemPrompt,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}
