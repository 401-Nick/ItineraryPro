//This is broken

// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import { ConversationChain } from 'langchain/chains';
// import { ChatOpenAI } from 'langchain/chat_models/openai';
// import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
// import { BufferMemory } from 'langchain/memory';
// import * as dotenv from 'dotenv';


// interface MyRequest {
//     body: {
//         conversationId: string;
//         input: string;
//     };
//     // You can also define other properties here
// }

// // Initialize Firebase Admin SDK
// admin.initializeApp();

// // Initialize Firestore
// const db = admin.firestore();

// // Environment Variables - consider using Firebase Functions config for production
// dotenv.config();

// // Initialize Langchain and OpenAI
// const chat = new ChatOpenAI({ temperature: 0 });

// // Create Prompt
// const chatPrompt = ChatPromptTemplate.fromPromptMessages([
//     ["system", `You are a Virtual Travel Assistant AI. Your primary role is to ...`],
//     new MessagesPlaceholder("history"),
//     ["human", "{input}"]
// ]);

// // Create Conversation Chain
// const chain = new ConversationChain({
//     memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
//     prompt: chatPrompt,
//     llm: chat
// });

// exports.chatFunction = functions.https.onRequest(async (req: MyRequest, res: any) => {
//     const conversationId = req.body.conversationId;
//     const userInput = req.body.input;

//     if (!conversationId || !userInput) {
//         return res.status(400).send('Bad Request: Missing Parameters');
//     }

//     const conversationRef = db.collection('chatRooms').doc(conversationId);
//     const conversation = await conversationRef.get();

//     if (!conversation.exists) {
//         return res.status(404).send('Conversation not found');
//     }

//     const response = await chain.call({ input: userInput });

//     await conversationRef.update({
//         history: admin.firestore.FieldValue.arrayUnion(`AI: ${response.response}`)
//     });

//     return res.status(200).send(`AI: ${response.response}`);
// });