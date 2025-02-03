import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000/medicure/routes';
  private apiUrl = 'https://shared-server-cxer.onrender.com/medicure/routes';
  constructor(private http: HttpClient) {}
  // Send contact form
  //Generate Chatbot response
  generateResponse(prompt: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatbot`, { prompt });
  }
}
