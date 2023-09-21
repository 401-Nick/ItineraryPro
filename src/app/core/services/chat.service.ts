import { Injectable, isDevMode } from '@angular/core';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { Router } from '@angular/router';
import { app } from '../../../main';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  db = getFirestore(app);

  constructor(private router: Router, private http: HttpClient) {
    this.db = getFirestore(app);

    // Point to Firestore emulator if in development mode
    if (isDevMode()) {
      console.log('Development mode!');
      connectFirestoreEmulator(this.db, 'localhost', 8080);
    } else {
      console.log('Production mode!');
    }
  }

  /**
   * callFirebaseFunction - Generalized method to call a Firebase Function.
   *
   * @param {string} endpoint - The specific function endpoint you want to hit (e.g., 'chatFunction').
   * @param {string} projectId - The Firebase project ID (e.g., 'itinerary-pro-project').
   * @param {any} additionalBody - Additional data to be sent in the request body.
   *
   * @returns {Promise<any>} - Returns a Promise that resolves to the server response or null.
   *                           If an error occurs, the Promise will be rejected.
   *
   * ### Example Usage:
   * 
   * ```typescript
   * const response = await this.callFirebaseFunction('chatFunction', 'itinerary-pro-project', { roomId: '123', newMessage: 'Hello' });
   * if (response) {
   *   // Handle the response
   * } else {
   *   // Handle no response
   * }
   * ```
   */
  private async callFirebaseFunction(
    endpoint: string,
    projectId: string,
    additionalBody: any
  ): Promise<any> {
    console.log(`Calling Firebase Function on endpoint: ${endpoint}`);

    let baseUrl: string;

    if (isDevMode()) {
      baseUrl = `http://127.0.0.1:5001/${projectId}/us-central1`;
    } else {
      baseUrl = `https://us-central1-${projectId}.cloudfunctions.net`;
    }

    const url = `${baseUrl}/${endpoint}`;
    const body = { projectId, ...additionalBody };

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, body).subscribe({
        next: (response) => {
          if (response) {
            console.log(`Received from Firebase Function: ${JSON.stringify(response)}`);
            resolve(response);
          } else {
            resolve(null);
          }
        },
        error: (error) => {
          console.error(`Error calling Firebase Function: ${JSON.stringify(error, null, 2)}`);
          reject(error);
        },
        complete: () => {
          console.log('Request completed.');
        }
      });
    });
  }

  async createChatRoom(): Promise<string> {
    const response = await this.callFirebaseFunction('createChatRoom', 'itinerary-pro-project', {});
    return response.roomId;
  }


  async sendMessage(roomId: string, newMessage: string): Promise<void> {
    if (!newMessage) {
      return;
    }
    await this.callFirebaseFunction('sendMessage', 'itinerary-pro-project', { roomId, newMessage });
  }
}