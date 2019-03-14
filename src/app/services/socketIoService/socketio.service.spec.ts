import { TestBed } from '@angular/core/testing';

import { SocketIoService } from './socketio.service';

describe('SocketioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketIoService = TestBed.get(SocketIoService);
    expect(service).toBeTruthy();
  });
});
