import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../core/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../../../models/message.model';
import { Subscription, firstValueFrom, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit {
  // Properties
  roomId: string | null = null;
  messages: Message[] = [];
  newMessage: any;
  newAlias: string = '';
  newRoomLink: string = '';
  isVerified = false;
  messagesSubscription!: Subscription;

  // Constructor
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  // Lifecycle Hooks
  async ngOnInit(): Promise<void> {
    await this.initializeRoom();
    const buttonContent = this.route.snapshot.paramMap.get('buttonContent');
    const textContent = this.route.snapshot.paramMap.get('textContent');
    if (buttonContent) {
      //Disable text input
      await this.callFirebaseFunction('A user just selected the following button on a website designed to help them plan an itinerary: ' + buttonContent + ' <= Reference that like and ask further questions to help them plan their trip.');
      //Enable text input
    } else if (textContent) {
      //Disable text input
      await this.callFirebaseFunction('A user just entered the following text on a website designed to help them plan an itinerary. The prompt they were given was: "Give us every detail of your perfect trip!" they responded with: ' + textContent + ' <= Reference that like and ask further questions to help them plan their trip.');
      //Enable text input
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromMessages();
  }

  // Initialization
  private async initializeRoom(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (this.roomId) {
      this.isVerified = await this.chatService.verifyUser(this.roomId);
      if (this.isVerified) {
        await this.loadChatRoom(this.roomId);
        this.subscribeToMessages();
      }
    }
  }

  private subscribeToMessages(): void {
    this.messagesSubscription = this.chatService.messages$.subscribe((msgs: Message[]) => {
      this.messages = msgs;
    });
  }

  private unsubscribeFromMessages(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  // Messaging
  async handleSendMessage(): Promise<void> {
    let messageClone = this.newMessage;
    await this.sendMessage(this.newMessage);
    this.newMessage = '';
    await this.callFirebaseFunction(messageClone);
  }


  private async sendMessage(newMessage: string, author: string = "You"): Promise<void> {
    if (this.isVerified && this.roomId) {
      await this.chatService.sendMessage(this.roomId, author, newMessage, 'user');
    }
  }

  private async loadChatRoom(roomId: string): Promise<void> {
    if (this.isVerified) {
      await this.chatService.listenForMessages(roomId);
    }
  }

  // Firebase Function
  private async callFirebaseFunction(userInput: string): Promise<void> {

    console.log("Calling Firebase Function");

    const conversationId = this.roomId;
    const body = { conversationId, userInput };
    console.log(conversationId, body);


    console.log(body.conversationId, body.userInput);


    try {
      const observable = this.http.post<{ response: string }>(
        'https://us-central1-itinerary-pro-project.cloudfunctions.net/chatFunction',
        body,
      );
      const response = await firstValueFrom(observable);
      console.log(`Received from Firebase Function: ${response.response}`);
    } catch (error) {
      console.error(`Error calling Firebase Function: ${JSON.stringify(error, null, 2)}`);
    }
  }


}


