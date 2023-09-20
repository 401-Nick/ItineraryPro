import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    // this.setupVideo();
  }

  // setupVideo() {
  //   const video = this.el.nativeElement.querySelector('#bgVideo');
  //   const image = this.el.nativeElement.querySelector('#bgImage');

  //   if (video) {
  //     // Initially set the image as the higher layer

  //     if (image.style.zIndex !== '-3' && image.style.zIndex !== '-2') {
  //       image.style.zIndex = '-2';
  //       video.style.zIndex = '-3';
  //     };
  //     // Listen for the 'loadedmetadata' event to know when the video is ready
  //     video.addEventListener('loadedmetadata', () => {
  //       video.play().then(() => {
  //         // Successfully started playing the video, switch the layers
  //         image.style.zIndex = '-3';
  //         video.style.zIndex = '-2';
  //       }).catch((error: any | Error) => {
  //         console.error('Failed to play the video:', error);
  //       });
  //     });
  //   } else {
  //     console.error('Video element not found!');
  //   }
  // }
}
