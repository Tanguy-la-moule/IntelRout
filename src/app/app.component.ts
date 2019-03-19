import { Component } from '@angular/core';

import { Simulation } from './models/Simulation';
import { Interaction } from './models/Interaction';

import { LocalStorageService } from './services/localStorageService/local-storage.service';
import { SocketIoService } from './services/socketIoService/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'IntelRout';
  simulation: Simulation;
  simulations: Array<Simulation>;
  displayModal: boolean = false;

  constructor(private localStorageService: LocalStorageService, private socketIoService: SocketIoService){
    if(localStorage.getItem('id') == undefined){
      localStorage.clear();
      localStorage.setItem('id', '0');
      localStorage.setItem('simulations', '[]');
      console.log('localStorage cleared');
    }
    if (localStorage.getItem('CurrentSimulation') == undefined){
      this.simulation = new Simulation(0, '' ,'', new Array<Interaction>());
      this.localStorageService.saveActiveSimulation(this.simulation);
      this.socketIoService.initiateModel(this.simulation.id.toString());
//      this.socketIoService.addInteractions(this.simulation.id.toString(), this.simulation.interactions);
    } else {
      this.simulation = localStorageService.getCurrentSimulation();
      this.socketIoService.initiateModel(this.simulation.id.toString())
    }
    if(localStorage.getItem('simulations') == undefined){
      localStorage.setItem('simulations', '[]');
    } else {
      this.simulations = this.localStorageService.getSimulations();
    }

    this.getInitiated();
    this.interactionAdded();
    this.modelTrained();
  }

  onDiscard(save: boolean) {
    console.log('discard ' + save);
    if(save){
      this.localStorageService.saveSimulation(this.simulation);
    }
    this.simulation = new Simulation(0, '' ,'', new Array<Interaction>());
    this.localStorageService.saveActiveSimulation(this.simulation);
    this.socketIoService.initiateModel(this.simulation.id.toString());
  }

  onSave() {
    this.localStorageService.saveSimulation(this.simulation);
    this.simulations = this.localStorageService.getSimulations();
  }

  onUpload() {
    this.openUploadModal();
  }

  onOpen([discard, id]: [boolean, number]){
    if(!discard){
      this.localStorageService.saveSimulation(this.simulation);
    }
    this.simulation = this.localStorageService.openSimulation(id)
    this.socketIoService.initiateModel(this.simulation.id.toString());
    this.localStorageService.saveActiveSimulation(this.simulation);
    this.simulations = this.localStorageService.getSimulations();
  }

  onDelete(id: number){
    this.localStorageService.deleteSimulation(id);
    this.simulations = this.localStorageService.getSimulations();
  }

  public triggerDownload(){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('simulations'));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "simulations.json");
    dlAnchorElem.click();
  }

  public openUploadModal(){
    this.displayModal = true;
  }

  public closeModals(){
    this.displayModal = false;
  }

  public onFileChange(event){
    var reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  public onReaderLoad(event){
    var simulations = JSON.parse(event.target.result)
    var max_id = 0;
    for (var simulation of simulations){
      max_id = Math.max(max_id, simulation.id)
    }
    localStorage.clear();
    localStorage.setItem('id', max_id.toString());
    localStorage.setItem('simulations', event.target.result);
    location.reload();
  }

  getInitiated(): void {
    this.socketIoService.getInitiated().subscribe(bool => {
      if(bool){
        console.log("model initiated, trying to add interactions");
        this.socketIoService.addInteractions(this.simulation.id.toString(), this.simulation.interactions);
      }
    })
  }

  interactionAdded(): void {
    this.socketIoService.interactionAdded().subscribe(bool => {
      if(bool){
        console.log("interactions added");
        this.socketIoService.trainModel(this.simulation.id.toString())
      }
    })
  }

  modelTrained(): void {
    this.socketIoService.modelTrained().subscribe(bool => {
      if(bool){
        console.log("model trained");
      }
    })
  }
}
