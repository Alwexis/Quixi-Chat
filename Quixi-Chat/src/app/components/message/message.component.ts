import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  apiURL: string = environment.apiURL;
  @Input('message') message: any;
  @Input('chat') chat: any;
  user: any;
  loading: boolean = true;

  constructor(private _auth: AuthService) { }

  async ngOnInit() {
    this.message.author = this.message.author == 'System' ? this.message.author
      : this.chat.users.find((user: any) => user.username == this.message.author);
    this.message.date = new Date(this.message.createdAt).toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true })
    const attachments = this.message.attachments;
    const newAttachments = [];
    if (attachments.length > 0) {
      for (let attachment of attachments) {
        let newAttachment;
        if (typeof attachment == 'string') {
          newAttachment = attachment;
        } else {
          newAttachment = this.apiURL + '/' + attachment.file;
        }
        newAttachments.push(newAttachment);
      }
      this.message.fixedAttachments = newAttachments;
    }
    this.user = await this._auth.getSessionData();
    this.loading = false;
  }
}
