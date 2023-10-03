import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  apiURL: string = environment.apiURL;
  @Input('activeChat') activeChat: any;
  chat: any = {};
  messages: any = []
  loading: boolean = true;

  constructor(private _chat: ChatService) {}

  async ngOnInit() {
    const response = await this._chat.getChatMessages(this.activeChat);
    this.chat = response.chat;
    console.log(this.chat)
    this.messages = response.messages;
    this.loading = false;
  }
}
