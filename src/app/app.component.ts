import { Component } from '@angular/core';

import { Simulation } from './models/Simulation';
import { Interaction } from './models/Interaction';
import { LocalStorageService } from './services/localStorageService/local-storage.service';

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

  constructor(private localStorageService: LocalStorageService){
    if(localStorage.getItem('id') == undefined){
      localStorage.clear();
      localStorage.setItem('id', '0');
      localStorage.setItem('simulations', '[]');
      console.log('localStorage cleared');
    }
    if (localStorage.getItem('CurrentSimulation') == undefined){
      this.simulation = new Simulation(0, '' ,'', new Array<Interaction>());
      this.localStorageService.saveActiveSimulation(this.simulation);
    } else {
      this.simulation = localStorageService.getCurrentSimulation();
    }
    if(localStorage.getItem('simulations') == undefined){
      localStorage.setItem('simulations', '[]');
    } else {
      this.simulations = this.localStorageService.getSimulations();
      console.log('main page saved simulations')
      console.log(this.simulations)
    }
  }

  onDiscard(save: boolean) {
    console.log('discard ' + save);
    if(save){
      this.localStorageService.saveSimulation(this.simulation);
    }
    this.simulation = new Simulation(0, '' ,'', new Array<Interaction>());
    this.localStorageService.saveActiveSimulation(this.simulation);
  }

  onSave() {
    this.localStorageService.saveSimulation(this.simulation);
    this.simulations = this.localStorageService.getSimulations();
  }

  onOpen([discard, id]: [boolean, number]){
    if(!discard){
      this.localStorageService.saveSimulation(this.simulation);
    }
    this.simulation = this.localStorageService.openSimulation(id)
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
}
