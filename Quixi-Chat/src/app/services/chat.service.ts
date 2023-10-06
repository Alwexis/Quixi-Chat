import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _apiURL: string = environment.apiURL;
  private _chats: any = [];
  private _activeChat: string = '';
  onChatChange: EventEmitter<string> = new EventEmitter();

  constructor(private _http: HttpClient, private _auth: AuthService) { }


  async getChats() {
    const token = await this._auth.getToken();
    this._chats = await new Promise((resolve, reject) => {
      this._http.get(`${this._apiURL}/api/chats`, {
        headers: {
          Authorization: token
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      })
    });
    return this._chats;
  }

  async createChat(chatInfo: any) {
    const token = await this._auth.getToken();
    return await new Promise((resolve, reject) => {
      this._http.post(`${this._apiURL}/api/chats`, chatInfo, {
        headers: {
          Authorization: token
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      })
    });
  }

  async changeActiveChat(chatId: string) {
    this._activeChat = chatId;
    this.onChatChange.emit(chatId);
  }

  async getChatMessages(chatId: string) {
    const token = await this._auth.getToken();
    const messages = await new Promise((resolve, reject) => {
      this._http.get(`${this._apiURL}/api/messages/${chatId}`, {
        headers: {
          Authorization: token
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      });
    });
    const chat = this._chats.find((chat: any) => chat.id === chatId);
    return { chat, messages }
  }

  async sendMessage(message: string, attachments: []) {
    const token = await this._auth.getToken();
    const activeChat = this._chats.find((chat: any) => chat.id === this._activeChat);
    return await new Promise((resolve, reject) => {
      this._http.post(`${this._apiURL}/api/messages/${activeChat.id}`,
      { message, attachments, chatId: this._activeChat }, {
        headers: {
          Authorization: token
        }
      }).subscribe({
        next: data => { resolve(data) },
        error: error => { reject(error) }
      });
    });
  }

  getActiveChat() {
    return this._activeChat;
  }
}
