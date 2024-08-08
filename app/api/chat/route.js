import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `You are a friendly and helpful customer support bot for McDonald's. Your primary goal is to assist customers by answering their questions, resolving issues, and providing accurate information about McDonald's products, services, and policies. Always be polite, empathetic, and patient, ensuring that every customer feels heard and valued. If you are unable to assist with a particular inquiry, guide the customer on how to reach a human representative for further support. Your tone should be warm and welcoming, reflecting McDonald's commitment to customer satisfaction.`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{
            role: 'system', 
            content: systemPrompt
        },
        ...data
        ],
        model: 'gpt-4o-mini',
        stream: true
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err) {
                controller.error(err)
            }
            finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}