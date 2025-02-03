import { Component, ElementRef, inject, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NgClass, NgIf, FormsModule, NgForOf, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userInput = ''; // Input from the user
  isLoading = false; // Show loader when fetching response
  messages: { sender: 'user' | 'bot'; text: string }[] = []; // Chat messages

  @ViewChild('chatbotMessages') chatbotMessages!: ElementRef;

  suggestions: string[] = [
    "How to file ITR?",
    "What documents are required for ITR?",
    "Best tax-saving investments?",
    "How to check my tax refund status?"
  ]; // Suggested questions

  constructor(private authService: AuthService) {}
  ngOnInit(){
    this.messages.length = 0;
  }
  sendMessage(): void {
    const prompt = this.userInput.trim();
    if (prompt) {
      this.addMessage('user', prompt);
      this.isLoading = true;

      this.authService.generateResponse(prompt).subscribe({
        next: (response) => {
          this.isLoading = false;
          const formattedText = this.formatBotResponse(response.text);
          this.addMessage('bot', formattedText);
        },
        error: () => {
          this.isLoading = false;
          this.addMessage('bot', 'Error: Unable to fetch response.');
        },
      });

      this.userInput = ''; // Clear input
    }
  }
  formatBotResponse(response: string): string {
    // Remove single `#` characters used for markdown headers
    response = response.replace(/[#]/g, '');

    // Replace **text** with <b>text</b> for bold formatting
    response = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Replace *text* with <i>text</i> for italic formatting
    response = response.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // Replace line breaks (\n) with <br> for proper HTML rendering
    response = response.replace(/\n/g, '<br>');

    // Replace URLs with clickable links
    response = response.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    );

    return response;
  }

  sendSuggestion(suggestion: string): void {
    this.userInput = suggestion;
    this.sendMessage();
  }

  addMessage(sender: 'user' | 'bot', text: string): void {
    this.messages.push({ sender, text });
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom(): void {
    const messagesContainer = this.chatbotMessages.nativeElement;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
