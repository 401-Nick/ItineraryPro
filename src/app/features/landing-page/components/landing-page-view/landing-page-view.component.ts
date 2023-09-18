import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GptApiService } from '../../../../core/services/gpt-api.service';


@Component({
  selector: 'app-landing-page-view',
  templateUrl: './landing-page-view.component.html',
  styleUrls: ['./landing-page-view.component.css']
})
export class LandingPageViewComponent {
  public textAreaContent: string = "";

  constructor(private router: Router, private gptApiService: GptApiService) { }

  handleButtonClick(buttonContent: string) {
    console.log('buttonContent: ', buttonContent);
    this.router.navigate(['/chatroom']);
  }

  handleTextArea(textContent: string) {
    console.log('textContent: ', textContent);
    this.router.navigate(['/chatroom']);
    // 
  }
}




//Old
// this.gptApiService.sendDataToGptApi(textContent)
//     //   .subscribe(response => {
//     //     // Handle GPT API response
        
//     //   });