import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _apiURL: string = environment.apiURL;
  private _chats: any = [];

  constructor(private _http: HttpClient, private _cookie: CookieService) { }
 
  async getChats() {
    this._chats = await new Promise((resolve, reject) => {
      this._http.get(`${this._apiURL}/api/chats`, {
        headers: {
          Authorization: this._cookie.get('token')
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      })
    });
    return this._chats;
  }

  async createChat(chatInfo: any) {
    return await new Promise((resolve, reject) => {
      this._http.post(`${this._apiURL}/api/chats`, chatInfo, {
        headers: {
          Authorization: this._cookie.get('token')
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      })
    });
  }

  async getChatMessages(chatId: string) {
    const messages = await new Promise((resolve, reject) => {
      this._http.get(`${this._apiURL}/api/messages/${chatId}`, {
        headers: {
          Authorization: this._cookie.get('token')
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      });
    });
    const chat = this._chats.find((chat: any) => chat.id === chatId);
    return { chat, messages }
  }
}
