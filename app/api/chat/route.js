import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';

import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';

const TEMPLATE = `Answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.:
==============================
Context: {context}
==============================

user: {question}
assistant:`;

const loader = new JSONLoader(
    'src/data/states.json',
    [
        '/state',
        '/code',
        '/nickname',
        '/website',
        '/admission_date',
        '/admission_number',
        '/capital_city',
        '/capital_url',
        '/population',
        '/population_rank',
        '/constitution_url',
        '/twitter_url',
    ],
);

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const data = await req.json();

        const currentMessageContent = data[data.length - 1].content;
        const docs = await loader.load();

        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        const chain = RunnableSequence.from([
            {
                question: () => currentMessageContent,
                context: () => formatDocumentsAsString(docs),
            },
            prompt,
            new ChatOpenAI({
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4o-mini',
                temperature: 0,
                streaming: false,  // Disable streaming
                verbose: true,
            }),
        ]);

        const completion = await chain.invoke({
            question: currentMessageContent,
        });

        // Assuming the completion object contains the response content.
        const content = completion.response; 

        return NextResponse.json({ content });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
