import { NgZone } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../core/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { Message } from '../../../../models/message.model';
import { Subscription, debounceTime, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit {
  // Properties
  isSending: boolean = false;  // Add this line
  roomId: string | null = null;
  messages: Message[] = [];
  newMessage: any;
  newAlias: string = '';
  newRoomLink: string = '';
  isVerified = false;
  messagesSubscription!: Subscription;
  private sendMessageSubject = new Subject<string>(); // Step 2: Add a Subject


  // Constructor
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone // Inject NgZone
  ) { }

  // Lifecycle Hooks


  // This cant be on init because it'll repass the old message even in the middle of an already started conversation.
  async ngOnInit(): Promise<void> {
    await this.initializeRoom();

    // Step 4: Subscribe to the sendMessageSubject with debounceTime
    this.sendMessageSubject.pipe(
      debounceTime(1000)
    ).subscribe((newMessage) => {
      this.ngZone.run(() => {
        this.performSendMessage(newMessage);
      });
    });
  }




  ngOnDestroy(): void {
    // this.unsubscribeFromMessages();
  };

  // Initialization
  private async initializeRoom(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (this.roomId) {
      // Initialize Firestore
      const db = getFirestore(); // Using getFirestore function

      // Reference to the chat room document
      const chatRoomRef = doc(db, "chatRooms", this.roomId);

      // Listen for real-time updates
      onSnapshot(chatRoomRef, (doc) => {
        if (doc.exists()) {
          // Fetch the 'roomMemory' array from the document
          const roomMemory = doc.data()["roomMemory"];

          // Update the UI within Angular's zone to ensure changes are detected
          this.ngZone.run(() => {
            this.updateUI(roomMemory);
          });
        }
      });
    };
  };

  private updateUI(roomMemory: string[]) {
    // Your logic to convert roomMemory into your Message[] array
    // For simplicity, assuming Message has a 'content' property
    this.messages = roomMemory.map((messageContent, index) => {
      return { content: messageContent } as Message;
    });
  };

  async performSendMessage(newMessage: string): Promise<void> {
    this.isSending = true;  // Disable the input

    console.log("Room ID: ", this.roomId);
    console.log("Message: ", newMessage);
    let message = newMessage;
    this.newMessage = '';

    await this.chatService.sendMessage(this.roomId!, message);

    this.isSending = false;  // Enable the input
  }




  async sendMessage(newMessage: string): Promise<void> {
    if (this.isSending) {
      console.log('Sending in progress. Please wait.');
      return;
    }

    if (!newMessage) {
      console.log('No message to send');
      return;
    }

    this.sendMessageSubject.next(newMessage); // Push the new message into the Subject
  }
}

