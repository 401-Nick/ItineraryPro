import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GptApiService } from '../../../../core/services/gpt-api.service';
import { FormsModule } from '@angular/forms';
import { text } from 'express';


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
    this.gptApiService.sendDataToGptApi(buttonContent)
      .subscribe(response => {
        // Handle GPT API response
        this.router.navigate(['/next']);
      });
  }

  handleTextArea(textContent: string) {
    console.log('textContent: ', textContent);
    this.gptApiService.sendDataToGptApi(textContent)
      .subscribe(response => {
        // Handle GPT API response
        this.router.navigate(['/next']);
      });
  }
}