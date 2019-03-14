import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket: SocketIOClient.Socket

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  sendMessage() {
    console.log('trying to send')
    this.socket.emit('connect');
  }
}