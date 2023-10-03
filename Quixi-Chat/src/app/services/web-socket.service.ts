import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(private _socket: Socket, private _cookie: CookieService) {
    
    this._socket.ioSocket._opts.extraHeaders.Authorization = this._cookie.get('token');
    this._socket.connect();
    this._socket.on('connect', () => {
      console.log('Conectado al servidor');
    });
    this._socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });
  }
}
