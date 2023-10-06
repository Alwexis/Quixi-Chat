import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket {
  private _socket: any;
  onMessage: EventEmitter<any> = new EventEmitter();

  constructor(private _cookie: CookieService) {
    super({
      url: 'http://localhost:3000',
      options: {
        extraHeaders: {
          authorization: _cookie.get('token')
        }
      }
    });
    this._socket = this.ioSocket;
    this._socket.connect();
    this._socket.on('connect', () => {
      console.log('Conectado al servidor');
    });
    this._socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });
  }

  getEventEmitter() {
    return this.onMessage;
  }

  send(event_name: string, rawData: any) {
    const parsedData = JSON.stringify(rawData);
    this._socket.emit(event_name, parsedData);
  }
}
