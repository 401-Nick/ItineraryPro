const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const logger = require('firebase-functions/v2/logger');
const readline = require('readline');
const { ConversationChain } = require('langchain/chains');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('langchain/prompts');
const { BufferMemory } = require('langchain/memory');
const dotenv = require('dotenv');

interface MyRequest {
    body: {
        conversationId: string;
        input: string;
    };
    // You can also define other properties here
}

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

// Environment Variables - consider using Firebase Functions config for production
dotenv.config();

// Initialize Langchain and OpenAI
const chat = new ChatOpenAI({ temperature: 0 });

// Create Prompt
const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    ["system", `You are a Virtual Travel Assistant AI. Your primary role is to ...`],
    new MessagesPlaceholder("history"),
    ["human", "{input}"]
]);

// Create Conversation Chain
const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat
});

exports.chatFunction = functions.https.onRequest(async (req: MyRequest, res: any) => {
    const conversationId = req.body.conversationId;  // Use optional chaining
    const userInput = req.body.input;  // Use optional chaining

    if (!conversationId || !userInput) {
        return res.status(400).send('Bad Request: Missing Parameters');
    }

    const conversationRef = db.collection('Conversations').doc(conversationId);
    const conversation = await conversationRef.get();

    if (!conversation.exists) {
        return res.status(404).send('Conversation not found');
    }

    const response = await chain.call({ input: userInput });

    await conversationRef.update({
        history: admin.firestore.FieldValue.arrayUnion(`AI: ${response.response}`)
    });

    return res.status(200).send(`AI: ${response.response}`);
});