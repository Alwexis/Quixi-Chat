import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from '../../../environments/environment';
import { CreateChatComponent } from 'src/app/components/create-chat/create-chat.component';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = {}
  chats: any = [];
  apiURL: string = environment.apiURL;
  activeChat: string = '';

  constructor(private _auth: AuthService, private _chats: ChatService,
    private _containerRef: ViewContainerRef) { }

  async ngOnInit() {
    this.user = await this._auth.getUserData();
    this.chats = await this._chats.getChats();
    this.loadChats();
  }

  loadChats() {
    this.chats.forEach((chat: any) => {
      if (chat.users.length == 2) {
        chat.image = chat.users.find((user: any) => user.username != this.user.username).profile_picture;
        chat.name = chat.users.find((user: any) => user.username != this.user.username).username;
      }
    });
  }

  async openChat(chat: string) {
    this.activeChat = chat;
    console.log(this.activeChat)
  }

  async openGroupModal() {
    this._containerRef.clear();
    const createChatRef = this._containerRef.createComponent(CreateChatComponent);
    createChatRef.instance.user = this.user;
    createChatRef.instance.onCancel.subscribe(() => {
      createChatRef.destroy();
    });
    createChatRef.instance.onCreate.subscribe(async (chat: any) => {
      createChatRef.destroy();
      this.showAlert('success', 'Grupo creado', `El grupo ${chat.name} ha sido creado con éxito`);
      this.chats.push(chat);
      setTimeout(() => {
        this.loadChats();
      }, 200);
    });
  }

  showAlert(type: 'info' | 'success' | 'danger' | 'warning' | null = null, title: string, content: string) {
    const alertRef = this._containerRef.createComponent(AlertComponent);
    alertRef.instance.type = type;
    alertRef.instance.title = title;
    alertRef.instance.messages = [content];
    alertRef.instance.onClose.subscribe(() => {
      alertRef.destroy();
    });
  }
}
