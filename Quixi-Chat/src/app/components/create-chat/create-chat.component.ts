import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'create-group',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.css']
})
export class CreateChatComponent {
  apiURL: string = environment.apiURL;
  chatInfo: any = {
    name: '',
    users: [],
    image: '',
  };
  error: string = '';
  @ViewChild('ChatImg') chatImg: any;
  @ViewChild('AddUser') addUserInput: any;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onCreate: EventEmitter<any> = new EventEmitter();
  @Input('user') user: any = {
    username: '',
    alias: '',
    profile_picture: '',
  }

  constructor(private _auth: AuthService, private _chats: ChatService) { }

  async addUser(user: any) {
    if (this.user.username == user) {
      return this.error = 'No puedes agregarte a ti mismo';
    }
    const doesExist = await this._auth.userExists(user);
    if (doesExist) {
      this.error = '';
      if (this.addUserInput) {
        this.addUserInput.nativeElement.value = '';
      }
      return this.chatInfo.users.push(doesExist);
    }
    this.error = 'El usuario no existe';
  }

  async createChat() {
    if (this.chatInfo.users.length == 0) return;
    if (this.chatInfo.users.length > 1 && this.chatInfo.name == '') return;
    try {
      const chat: any = await this._chats.createChat(this.chatInfo);
      this.onCreate.emit(chat.chat);
    } catch (error) {
      this.onCancel.emit();
    }
  }
  
  async changeImage(event: any) {
    const file = event.target.files[0];
    // Si es que hay archivo y que el tamaño sea menor a 1MB
    if (file && file.size <= 1048576) {
      this.chatInfo.image = await this.getBase64(file);
    } else {
      this.clearImage();
    }
  }

  clearImage() {
    this.chatInfo.image = '';
    if (this.chatImg) {
      this.chatImg.nativeElement.value = '';
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
