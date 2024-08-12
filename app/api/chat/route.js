// pages/api/chat.js or similar file
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';

import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';


const TEMPLATE = `You are an assistant that answers questions based on the following context. Use the context to provide accurate answers.

==============================
Context: {context}
==============================

User Question: {question}

Instructions:
1. **Finding Values:** If the question involves finding the lowest or highest value in a dataset, analyze the context to determine the required data point and provide a precise answer, if a premium or a vehicle valueis 0 ignore it.
2. **Prediction:** If asked for predictions, use the context to identify patterns and make a prediction based on available data. For example, if predicting premiums based on vehicle values, refer to the dataset to find the closest matching data and provide a prediction based on that.

Examples:
- If asked for the lowest premium based on the data, find the smallest premium value and provide it.
- If asked to predict a premium based on a vehicle value, use historical data to estimate the premium for the given vehicle value.`;

const loader = new JSONLoader('src/data/auto_insurance.json');

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
                streaming: false,
                verbose: false,
            }),
        ]);

        const completion = await chain.invoke({
            question: currentMessageContent,
        });

        // Assuming the completion object contains the response content.
        console.log("Completion object:", completion);

        // Extract content from the completion object
        const responseContent = completion.content || "No response content available";
        return NextResponse.json({ content: responseContent });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
