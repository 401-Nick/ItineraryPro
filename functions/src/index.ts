// #######################
// ### Import Section ###
// #######################

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { ServiceAccount } from "firebase-admin";
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
const serviceAccount = require("../adminServiceAccount.json");
const {
    log,
    info,
    debug,
} = require("firebase-functions/logger");

console.log("Starting Firebase Function");

// ########################
// ### Initializations ###
// ########################

dotenv.config();

const serviceAccountCasted = serviceAccount as ServiceAccount;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountCasted),
});

const db = admin.firestore();
const chat = new ChatOpenAI({ temperature: 0 });
const corsHandler = cors({ origin: true });

// ####################
// ### Definitions ###
// ####################

const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Virtual Travel Assistant AI. Your primary role is to ...`],
    new MessagesPlaceholder("history"),
    ["human", "{input}"]
]);

const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat
});

// Message model to match Angular application
interface Message {
    author: string;
    content: string;
    type: 'user' | 'assistant';
}
// #########################
// ### Helper Functions ###
// #########################

const logAllChatRooms = async () => {
    const chatRoomsRef = db.collection('chatRooms');
    const snapshot = await chatRoomsRef.get();
    const chatRooms: any[] = [];
    snapshot.forEach(doc => {
        chatRooms.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    console.log("Available Chat Rooms:", chatRooms);
};

const updateChatRoomWithAIResponse = async (conversationId: string, aiResponse: string) => {
    const chatRoomRef = db.collection('chatRooms').doc(conversationId);
    const message: Message = {
        author: 'AI',
        content: aiResponse,
        type: 'assistant'
    };
    await chatRoomRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(message)
    });
};



const validateRequest = (req: any) => {
    if (req.method !== 'POST') {
        throw new Error('Method Not Allowed');
    }

    const { conversationId, userInput } = req.body;
    if (!conversationId || !userInput) {
        throw new Error('Missing parameters');
    }

    return { conversationId, userInput };
};
//Not needed for now
// const getConversation = async (conversationId: string) => {
//     const conversationRef = db.collection('chatRooms').doc(conversationId);
//     const conversation = await conversationRef.get();

//     if (!conversation.exists) {
//         throw new Error('Conversation not found');
//     }

//     return conversationRef;
// };

// #########################
// ### Firebase Function ###
// #########################

exports.chatFunction = functions.region('us-central1').runWith({ timeoutSeconds: 20 }).https.onRequest((req, res) => {
    log("Received a new request");  // General log
    debug("Request Body:", req.body);  // Debugging log

    corsHandler(req, res, async () => {
        try {
            const { conversationId, userInput } = validateRequest(req);
            info("Validated request parameters", { conversationId, userInput });  // Informational log

            const response = await chain.call({ input: userInput });
            info("Received response from chain.call", { response: response.response });  // Informational log

            await updateChatRoomWithAIResponse(conversationId, `AI: ${response.response}`);
            log("Updated Firestore chat room with AI response");  // General log

            return res.status(200).json({ response: `AI: ${response.response}` });
        } catch (error: any) {
            error("An error occurred", error);  // Error log
            return res.status(500).send(error.message);
        }
    });
});




logAllChatRooms().catch(err => console.error("Failed to log chat rooms:", err));
