import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from '../../../environments/environment';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { HomeComponent } from 'src/app/views/home/home.component';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  apiURL: string = environment.apiURL;
  @Input('activeChat') activeChat: any;
  @ViewChild('AttachmentInput') attachmentInput: any;
  chat: any = {};
  messages: any = [];
  message: string = '';
  loading: boolean = true;
  images: any = [];

  constructor(private _chat: ChatService, private _socket: WebSocketService,
    private _home: HomeComponent) { }

  async ngOnInit() {
    await this.loadMessages();
    this._chat.onChatChange.subscribe(async (chatId: string) => {
      if (chatId == '') return;
      this.loading = true;
      this.activeChat = chatId;
      await this.loadMessages();
    });
    this._socket.on('new-message', (rawData: any) => {
      const data = JSON.parse(rawData);
      if (data.chat.id != this.activeChat) return;
      this.messages.push(data);
      setTimeout(() => {
        this.scrollToLastMessage();
      }, 100);
    });
  }

  closeChat() {
    this._home.closeChat();
  }

  scrollToLastMessage() {
    const elemento = document.querySelector('#messages div');
    if (elemento) {
      elemento.scrollTo({
        top: elemento.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  async loadMessages() {
    const response = await this._chat.getChatMessages(this.activeChat);
    this.chat = response.chat;
    this.messages = response.messages;
    this.loading = false;
    setTimeout(() => {
      this.scrollToLastMessage();
    }, 200)
  }

  async sendMessage() {
    if (this.message == '') return;
    await this._chat.sendMessage(this.message, this.images);
    this.message = '';
    this.clearAttachments();
  }

  /* Attachments */
  removeAttachment(index: number) {
    this.images.splice(index, 1);
    if (this.images.length == 0) {
      this.clearAttachments();
    }
  }

  async changeImage(event: any) {
    const files = event.target.files;
    if (files.length == 0) this.clearAttachments();
    const imageMaxSize = 10 * 1048576;
    const videoGifMaxSize = 200 * 1048576;
    for (let file of files) {
      if ((file.type != "image/gif" && file.size <= imageMaxSize) || (file.type == "image/gif" && file.size <= videoGifMaxSize)) {
        this.images.push(await this.getBase64(file));
      }
    }
  }

  clearAttachments() {
    this.images = [];
    if (this.attachmentInput) {
      this.attachmentInput.nativeElement.value = '';
    }
  }

  async getBase64(file: File) {
    return new Promise((resolve: any, reject: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
