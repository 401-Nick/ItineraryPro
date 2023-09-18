import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Add the import statement for the LandingPageModule
import { LandingPageModule } from './features/landing-page/landing-page.module';

@NgModule({
  declarations: [
    AppComponent
    // Remove LandingPageViewComponent from here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  // You can keep this here for global availability
    HttpClientModule,
    LandingPageModule  // Add LandingPageModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

