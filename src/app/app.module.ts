import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
// import { routes } from './app-routing.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Add the import statement for the LandingPageModule
import { LandingPageModule } from './features/landing-page/landing-page.module';
import { ChatModule } from './features/chat/chat.module';

@NgModule({
  declarations: [
    AppComponent
    // Remove LandingPageViewComponent from here
  ],
  imports: [
    // RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    ChatModule,
    FormsModule,  // You can keep this here for global availability
    HttpClientModule,
    LandingPageModule  // Add LandingPageModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

