import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent {
  @Input('attachments') attachments: [] = [];
  @Output('onAttachmentRemoved') onAttachmentRemoved: EventEmitter<number> = new EventEmitter();
}
