import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatInterfaceComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ChatModule { }
