import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageViewComponent } from './components/landing-page-view/landing-page-view.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LandingPageViewComponent
  ],
  imports: [
    FormsModule,
    CommonModule

  ]
})
export class LandingPageModule { }
