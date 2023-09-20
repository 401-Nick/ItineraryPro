import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { GptApiService } from '../../../../core/services/gpt-api.service';
import { ChatService } from '../../../../core/services/chat.service';



@Component({
  selector: 'app-landing-page-view',
  templateUrl: './landing-page-view.component.html',
  styleUrls: ['./landing-page-view.component.css']
})
export class LandingPageViewComponent {
  public textAreaContent: string = "";
  public buttonContent: string = "";
  public roomId: string;

  constructor(private chatService: ChatService, private router: Router) {
    this.roomId = '';
  }
  async generateChatRoom() {
    const roomId = await this.chatService.createChatRoom();
    this.roomId = roomId;
    return roomId;
  }



  async handleButtonClick(buttonContent: string) {
    try {
      console.log('buttonContent: ', buttonContent);
      const roomId = await this.generateChatRoom();
      if (roomId) {
        this.router.navigate(['/chatroom', roomId, { buttonContent: buttonContent }]);
      } else {
        console.error('Room ID is not generated.');
      }
    } catch (error) {
      console.error('An error occurred in handleButtonClick:', error);
    }
  }

  async handleTextArea(textContent: string) {
    try {
      console.log('textContent: ', textContent);
      const roomId = await this.generateChatRoom();
      if (roomId) {
        this.router.navigate(['/chatroom', roomId, { textContent: textContent }]);
      } else {
        console.error('Room ID is not generated.');
      }
    } catch (error) {
      console.error('An error occurred in handleTextArea:', error);
    }
  }


}