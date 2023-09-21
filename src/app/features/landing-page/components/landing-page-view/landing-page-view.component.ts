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

  buttonTexts: string[] = [
    'Which skyline would you like to see from your window?',
    'If you could sail to any island, which one would it be?',
    'What\'s a landmark you\'ve only seen in pictures but want to visit?',
    'If you could join any historical expedition, what would it be?',
    'What\'s the most exotic beach you wish you were lounging on?',
    'What\'s one place you\'d return to, just for the food?'
  ];

  async handleButtonClick(buttonContent: string) {
    try {
      console.log('buttonContent: ', buttonContent);
      const roomId = await this.chatService.createChatRoom();
      if (roomId) {
        this.router.navigate(['/chatroom', roomId]);
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
      const roomId = await this.chatService.createChatRoom();
      if (roomId) {
        this.router.navigate(['/chatroom', roomId]);
      } else {
        console.error('Room ID is not generated.');
      }
    } catch (error) {
      console.error('An error occurred in handleTextArea:', error);
    }
  }


}