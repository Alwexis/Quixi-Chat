import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input({ required: true }) type: 'info' | 'success' | 'danger' | 'warning' | null = null;
  @Input() title: string | null = null;
  @Input({ required: true }) messages: string[] = [];
  @Output() onClose = new EventEmitter<void>();
  closing: boolean = false;

  closeAlert() {
    this.closing = true;
    setTimeout(() => {
      this.onClose.emit();
    }, 500);
  }
}
