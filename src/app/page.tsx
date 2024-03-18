'use client';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function Home() {
	const [codeHtml, setCodeHtml] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setCodeHtml('');
		setLoading(true);
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const prompt = formData.get('prompt');
		const result = await fetch('api/create', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt,
			}),
		});
		const body = result.body;
		if (!body) {
			setLoading(false);
			return;
		}
		const reader = body.getReader();
		const readChunk = async () => {
			const { done, value } = await reader.read();
			if (done) {
				setLoading(false);
				event.currentTarget.reset();
				return;
			}
			const chunk = new TextDecoder('utf-8').decode(value);
			setCodeHtml((prev) => prev + chunk);
			await readChunk(); 
		};
		await readChunk();
	};

	return (
		<div className="bg-stone-800 text-white flex flex-col h-full min-h-[100vh] md:px-7 px-4 py-12">
			<div className="flex-grow flex justify-center items-center">
				{loading ? <Spinner /> : null}
				{codeHtml === '' ? (
					<h1 className="text-2xl">Créer votre composant react facilement !</h1>
				) : null}
				{codeHtml && (
					<div className="bg-black md:w-7/12 w-full p-5 relative opacity-80">
						<span className="absolute top-2 right-3 cursor-pointer opacity-100">
							copy
						</span>
						<pre>{codeHtml && codeHtml}</pre>
					</div>
				)}
			</div>
			<form
				action="submit"
				className="flex justify-center"
				onSubmit={(event) => handleSubmit(event)}
			>
				<div className="w-full md:w-7/12 flex items-center fixed bottom-10">
					<Textarea
						name="prompt"
						className=" resize-none  "
						placeholder="decrivez votre composant react ..."
					/>
					<Button className=" absolute right-5">Créer</Button>
				</div>
			</form>
		</div>
	);
}
