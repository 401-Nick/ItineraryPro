import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private el: ElementRef) { }

  startVideo() {
    console.log('Checking if video exists');
    const video = this.el.nativeElement.querySelector('#bgVideo');
    if (video) {
      if (video.paused) {
        console.log('Video is paused, playing it now...');
        video.play().catch((error: any | Error) => {
          console.error('Failed to play the video:', error);
        });
      }
    } else {
      console.error('Video element not found!');
    }
  }
}
