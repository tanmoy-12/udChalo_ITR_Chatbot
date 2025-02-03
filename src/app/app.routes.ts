import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: '**', redirectTo: '' }
];
