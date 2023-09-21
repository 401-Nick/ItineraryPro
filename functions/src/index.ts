import { OpenAI } from "langchain/llms/openai";
import { ChatMessageHistory, BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { HumanMessage } from "langchain/schema";  // Use HumanMessage instead of the deprecated HumanChatMessage
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { log } from 'console';
const cors = require('cors')({ origin: true }); // Initialize CORS with options

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Firestore Database
const db = admin.firestore();

// Access custom environment configuration
const environment = functions.config()["env"]?.mode || "dev"; // set "prod" as default

log(`Environment: ${environment}`);

export const createChatRoom = functions.https.onRequest(async (request, response) => {
    await cors(request, response, async () => {
        try {
            // Creating a new chat room in Firestore
            const newChatRoom = await db.collection('chatRooms').add({ roomMemory: [] });
            const roomId = newChatRoom.id;
            response.send({ success: true, roomId });
        } catch (error) {
            console.error(`Error creating chat room: ${JSON.stringify(error, null, 2)}`);
            response.status(500).send({ success: false, error: 'Internal server error' });
        };
    });
});

export const sendMessage = functions.https.onRequest(async (request, response) => {
    await cors(request, response, async () => {
        log('Request Body:', JSON.stringify(request.body, null, 2));
        const { roomId, newMessage } = request.body;
        log(`roomId: ${roomId}, newMessage: ${newMessage}`);

        try {
            const roomId = request.body.roomId;
            const newMessage = request.body.newMessage;

            if (!roomId || !newMessage) {
                response.status(400).send({ success: false, error: 'roomId and newMessage are required.' });
                return;
            } else {
                log(`roomId: ${roomId}, newMessage: ${newMessage}`);
            }

            const chatRoomRef = db.collection('chatRooms').doc(roomId);
            const chatRoomDoc = await chatRoomRef.get();

            if (!chatRoomDoc.exists) {

                response.status(404).send({ success: false, error: 'Chat room not found.' });
                return;
            }

            const roomMemory: string[] = chatRoomDoc.data()?.['roomMemory'] || [];
            const history = new ChatMessageHistory(roomMemory.map(msg => new HumanMessage(msg)));
            const memory = new BufferMemory({ chatHistory: history });

            // Initialize LangChain's ConversationChain
            const model = new OpenAI({});
            const chain = new ConversationChain({ llm: model, memory: memory });

            // Handle the new message
            const res = await chain.call({ input: newMessage });

            // Update the roomMemory and BufferMemory
            roomMemory.push(newMessage);  // Add human message
            roomMemory.push(res["response"]);  // Add AI response

            // Update Firestore
            await chatRoomRef.update({ roomMemory });

            response.send({ success: true, aiResponse: res["response"] });
        } catch (error) {
            console.error(`Error sending message: ${JSON.stringify(error, null, 2)}`);
            response.status(500).send({ success: false, error: 'Internal server error' });
        }
    });
});
