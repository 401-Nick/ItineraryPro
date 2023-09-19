import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the components
import { ChatInterfaceComponent } from './features/chat/components/chat-interface/chat-interface.component';
import { ItineraryViewComponent } from './features/itinerary/components/itinerary-view/itinerary-view.component';
import { ProfileSettingsComponent } from './features/user-profile/components/profile-settings/profile-settings.component';
import { LandingPageViewComponent } from './features/landing-page/components/landing-page-view/landing-page-view.component';

const routes: Routes = [
  { path: '', component: LandingPageViewComponent, pathMatch: 'full' },  // Set the landing page as the default route
  {
    path: 'chatroom/:roomId',
    component: ChatInterfaceComponent // replace with your chat component
  },
  {
    path: 'itinerary',  // Itinerary path
    component: ItineraryViewComponent  // Itinerary View component
  },
  {
    path: 'profile',  // User profile path
    component: ProfileSettingsComponent  // Profile Settings component
  },
  // { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
