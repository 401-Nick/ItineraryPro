import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDoc, arrayUnion, query, onSnapshot } from 'firebase/firestore';
import { Router } from '@angular/router';
import { app } from '../../../main';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // State and Initialization
  db = getFirestore(app);
  private _messages = new BehaviorSubject<Message[]>([]);
  public messages$ = this._messages.asObservable();
  private lastChatRoomCreationTime: number | null = null;

  constructor(private router: Router, private http: HttpClient) { }

  // Navigation and Error Handling
  private forceUserToHome(errorCode: string): void {
    this.router.navigate(['/']);
    console.log(`Error: ${errorCode}`);
  }

  // Token Management
  private async generateToken(roomId: string): Promise<string> {
    const response = await fetch(`https://us-central1-securr-chat.cloudfunctions.net/generateToken?roomId=${roomId}`);
    const data = await response.json();
    return data.token;
  }

  // Firestore Listeners
  async listenForMessages(roomId: string): Promise<void> {
    const chatRoomRef = doc(this.db, 'chatRooms', roomId);
    onSnapshot(chatRoomRef, (snapshot) => this.handleSnapshot(roomId, snapshot));
  }

  private handleSnapshot(roomId: string, snapshot: any): void {
    if (!snapshot.exists()) {
      this.forceUserToHome(`No chat room found with ID ${roomId}`);
      return;
    }
    const data = snapshot.data();
    if (data && Array.isArray(data['messages'])) {
      this._messages.next(data['messages'] as Message[]);
    }
  }

  // User Verification
  async verifyUser(roomId: string): Promise<boolean> {
    return true; // Placeholder for real verification logic
  }

  // Chat Functionality
  async callChatFunction(conversationId: string, input: string): Promise<string> {
    const body = { conversationId, input };
    const response = await this.http.post<{ response: string }>('<Firebase Function URL>', body).toPromise();
    return `AI: ${response!.response}`;
  }

  async createChatRoom(): Promise<string> {
    const now = Date.now();
    if (this.lastChatRoomCreationTime && (now - this.lastChatRoomCreationTime) < 10000) {
      return '';
    }
    this.lastChatRoomCreationTime = now;
    const newChatroom = await addDoc(collection(this.db, 'chatRooms'), { messages: [], memory: {} });
    return newChatroom.id;
  }

  // Message Management
  async sendMessage(roomId: string, author: string, messageText: string, type: 'user' | 'assistant'): Promise<void> {
    if (!messageText) {
      return;
    }
    const message: Message = { author, content: messageText, type };
    const updatedMemory = await this.updateMemory(roomId, message);
    const chatRoomRef = doc(this.db, 'chatRooms', roomId);
    await updateDoc(chatRoomRef, {
      messages: arrayUnion(message),
      memory: updatedMemory
    });
  }

  async updateMemory(roomId: string, message: Message): Promise<any> {
    const chatRoomRef = doc(this.db, 'chatRooms', roomId);
    const snapshot = await getDoc(chatRoomRef);
    const existingMemory = snapshot.data()?.["memory"] || {};
    existingMemory.messages = existingMemory.messages || [];
    existingMemory.messages.push(message);
    return existingMemory;
  }
}
