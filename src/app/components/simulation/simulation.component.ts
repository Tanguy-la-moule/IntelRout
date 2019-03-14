import { Component, OnInit, Input } from '@angular/core';

import { Simulation } from '../../models/Simulation';
import { Interaction } from '../../models/Interaction';

import { LocalStorageService } from '../../services/localStorageService/local-storage.service';
import { SocketIoService } from '../../services/socketIoService/socketio.service';
@Component({
  selector: 'simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  @Input() simulation: Simulation;

  sex: boolean = true;
  age: Number = 18;
  agent: Number = 1;
  salary: Number = 1;
  skill: number = 1;
  year_of_arrival: Number = 2019;
  satisfaction: Number = 3;

  public salary_options: Array<Object> = [
      {id: 0, text: 'Lower than $10.000'},
      {id: 1, text: '$10.000 to $30.000'},
      {id: 2, text: '$30.000 to $50.000'},
      {id: 3, text: '$50.000 to $100.000'},
      {id: 4, text: '$100.000 to $200.000'},
      {id: 5, text: 'More than $200.000'},
  ];

  public skill_options: Array<Object> = [
    {id: 0, text: 'Credit card loss'},
    {id: 1, text: 'Open a loan'},
    {id: 2, text: 'Acquire a credit card'},
    {id: 3, text: 'Order checks'},
    {id: 4, text: 'Request an appointment'},
    {id: 5, text: 'Others'},
];

  public sex_options: Array<Object> = [
    {id: 1, text: 'Male'},
    {id: 2, text: 'Female'},
];

  constructor(private localStorageService: LocalStorageService, private socketIoService: SocketIoService){
    this.socketIoService.sendMessage()
  }

  public addInteraction(){
    var new_interaction: Interaction = new Interaction(this.sex, this.age, this.salary, this.skill, this.year_of_arrival, this.agent, this.satisfaction)
    this.simulation.addInteraction(new_interaction);
    this.localStorageService.saveActiveSimulation(this.simulation);
    console.log(this.simulation.interactions, this.simulation.interactions.length);
  }
  ngOnInit() {
  }

}
