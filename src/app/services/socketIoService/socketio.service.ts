import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { Interaction } from 'src/app/models/Interaction';

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

  initiateModel(id: string){
    console.log('initiating model with id: ' + id)
    var json = {"model_title": id,
      "categorical_features": {"sex": [0, 1, 2],"agent_ID": [1, 2, 3, 4, 5], "salary": [0, 1, 2, 3, 4, 5], "skill": [0, 1, 2, 3, 4, 5]},
      "features":["sex", "age", "salary", "skill", "year_of_arrival", "agent_ID", "satisfaction"]};
    this.socket.emit('initiate_model', json);
  }

  getInitiated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.on('initiate_model_result', (message) => {
        observer.next(true);
      });
    });
  }

  addInteractions(id: string, interactions: Array<Interaction>){
    var json = {"interactions_list_title": id, "interactions": interactions};
    this.socket.emit('add_interactions', json);
  }

  interactionAdded(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.on('add_interactions_result', (interactions) => {
        console.log(interactions)
        observer.next(true);
      });
    });
  }

  trainModel(id: string){
    var json = {"interactions_list_title": id};
    this.socket.emit('train_model', json);
  }

  modelTrained(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.on('retrain_model_result', (result) => {
        console.log(result)
        observer.next(true);
      });
    });
  }

  predictBestAgent(id: string, sex: number, age: number, skill: number, year_of_arrival: number, salary: number){
    var data = {"sex": sex, "age": age, "salary": salary, "skill": skill, "year_of_arrival": year_of_arrival}
    var json = {"model_title": id, "data": data};
    this.socket.emit('predict_best_agent', json);
  }

  agentPredicted(): Observable<number> {
    return new Observable<number>((observer) => {
      this.socket.on('predict_best_agent_result', (result) => {
        console.log(result)
        observer.next(result.best_agent);
      });
    });
  }

  callArriving(): Observable<Object> {
    return new Observable<Object>((observer) => {
      this.socket.on('new_call', (result) => {
        console.log(result)
        observer.next(result);
      });
    });
  }

  satisfactionArriving(): Observable<Object> {
    return new Observable<Object>((observer) => {
      this.socket.on('rating_added', (result) => {
        observer.next(result);
      });
    });
  }
}