import { Injectable } from '@angular/core';

import { Interaction } from '../../models/Interaction'
import { Simulation } from '../../models/Simulation';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getCurrentSimulation(): Simulation{
    var parsedSimulation = JSON.parse(localStorage.getItem('CurrentSimulation'));
    var currentSimulation: Simulation = new Simulation(parseInt(parsedSimulation.id), parsedSimulation.date, parsedSimulation.name, parsedSimulation.isTrained, parsedSimulation.interactions)
    
    console.log('Getting current simulation :')
    console.log(currentSimulation)
    return currentSimulation
  }

  getSimulations(): Array<Simulation>{
    var parsedSimulations: Array<Simulation> = JSON.parse(localStorage.getItem('simulations'));
    console.log('Getting saved simulations')
    console.log(parsedSimulations);
    var simulations: Array<Simulation> = new Array<Simulation>();
    for (let simulation of parsedSimulations){
      simulations.push(new Simulation(simulation.id, simulation.date, simulation.name, simulation.isTrained, simulation.interactions))
    }    
    return simulations
  }
  saveActiveSimulation(simulation: Simulation): void{
    localStorage.setItem('CurrentSimulation', JSON.stringify(simulation));
    console.log('Saving simulation to current:')
  }

  saveSimulation(simulation: Simulation): void {
    var jsonSimulations: Array<Simulation> = JSON.parse(localStorage.getItem('simulations'));
    var i = 0;
    var found = false;
    while (i < jsonSimulations.length && !found){
      if(simulation.id == jsonSimulations[i].id){
        found = true
        jsonSimulations.splice(i, 1);
      } else {
        i += 1;
      }
    }
    jsonSimulations.unshift(simulation);
    localStorage.setItem('simulations', JSON.stringify(jsonSimulations));
    console.log('Saving simulation to Database:')
  }

  deleteSimulation(id: number): void {
    var jsonSimulations: Array<Simulation> = JSON.parse(localStorage.getItem('simulations'));
    var i = 0;
    var found = false;
    while (i < jsonSimulations.length && !found){
      if(id == jsonSimulations[i].id){
        found = true
        jsonSimulations.splice(i, 1);
      } else {
        i += 1;
      }
    }
    localStorage.setItem('simulations', JSON.stringify(jsonSimulations));
    console.log('Simulation deleted')
  }

  openSimulation(id: number): Simulation{
    var jsonSimulations: Array<Simulation> = JSON.parse(localStorage.getItem('simulations'));
    var i = 0;
    var found = false;
    while (i < jsonSimulations.length && !found){
      if(id == jsonSimulations[i].id){
        console.log('found same id')
        found = true
        jsonSimulations.unshift(jsonSimulations.splice(i, 1)[0]);
      } else {
        i += 1;
      }
    }
    localStorage.setItem('simulations', JSON.stringify(jsonSimulations));
    console.log('Opening the simulation:')
    return new Simulation((jsonSimulations[0].id), jsonSimulations[0].date, jsonSimulations[0].name, jsonSimulations[0].isTrained, jsonSimulations[0].interactions)
  }
}