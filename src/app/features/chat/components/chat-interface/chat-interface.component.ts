import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../core/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../../../models/message.model';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit {

  roomId: string | null = null;
  messages: Message[] = [];
  // public message: string = '';
  newMessage: any;
  newAlias: string = '';
  newRoomLink: string = '';
  isVerified = false;
  messagesSubscription!: Subscription;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (this.roomId) {
      this.isVerified = await this.chatService.verifyUser(this.roomId);
      console.log(`Verified: ${this.isVerified}`);
      if (this.isVerified) {
        await this.loadChatRoom(this.roomId);
        this.messagesSubscription = this.chatService.messages$.subscribe((msgs: Message[]) => {
          this.messages = msgs;
        });
      }

    }
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
  async sendMessage(newMessage: string, author: string = "You"): Promise<void> {
    if (this.isVerified && this.roomId) {
      await this.chatService.sendMessage(this.roomId, author, newMessage, 'user');  // Added 'user' as type
      this.newMessage = '';
    }
  }


  async loadChatRoom(roomId: string): Promise<void> {
    if (this.isVerified) {
      await this.chatService.listenForMessages(roomId);
    }
  }

  // async setAlias(): Promise<void> {
  //   await this.chatService.setAlias(this.newAlias);
  //   this.newAlias = '';

  // }

  // async generateLink(): Promise<void> {
  //   this.newRoomLink = await this.chatService.generateLink(this.roomId!);;
  // }

  // async deleteRoom(): Promise<void> {
  //   if (!this.roomId) return;
  //   await this.chatService.deleteRoom(this.roomId);
  // }
}
