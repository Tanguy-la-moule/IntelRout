import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Simulation } from '../../models/Simulation';
import { Interaction } from '../../models/Interaction';

import { LocalStorageService } from '../../services/localStorageService/local-storage.service';
import { SocketIoService } from '../../services/socketIoService/socketio.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  @Input() simulation: Simulation;
  @Output() interactionAdded = new EventEmitter();

  sex: Number = 0;
  age: Number = 18;
  agent: Number = 1;
  salary: Number = 0;
  skill: number = 0;
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

  public sex_options: Array<Object> = [
    {id: 0, text: 'Male'},
    {id: 1, text: 'Non Binary'},
    {id: 2, text: 'Female'}
  ];

  public skill_options: Array<Object> = [
    {id: 0, text: 'Credit card loss'},
    {id: 1, text: 'Open a loan'},
    {id: 2, text: 'Acquire a credit card'},
    {id: 3, text: 'Order checks'},
    {id: 4, text: 'Request an appointment'},
    {id: 5, text: 'Others'},
  ];

  constructor(private localStorageService: LocalStorageService, private socketIoService: SocketIoService, private http: HttpClient){ }

  public addInteraction(){
    var new_interaction: Interaction = new Interaction(this.sex, this.age, this.salary, this.skill, this.year_of_arrival, this.agent, this.satisfaction)
    this.simulation.addInteraction(new_interaction);
    this.localStorageService.saveActiveSimulation(this.simulation);
    this.socketIoService.addInteractions(this.simulation.id.toString(), [new_interaction]);
    this.interactionAdded.emit();
  }

  public removeInteraction(id: number){
    this.simulation.removeInteraction(id);
    this.localStorageService.saveActiveSimulation(this.simulation);
    console.log('removing interaction');
  }

  populateDatabaseWithPokemons(){
    console.log('locating pokemons')
    this.http.get('http://localhost:4200/assets/Pokemon.json')
      .subscribe(data => {
        console.log(data)
        var i: number = 0;
        var shuffledData = this.shuffleArray(data)
        var pokemonTypes: Array<string> = new Array<string>();
        var pokemonInteractions = new Array<Interaction>();
        while(i<800){
          var pokemon = shuffledData[i];
          if(pokemonTypes.indexOf(pokemon['Type 1']) == -1){
            pokemonTypes.push(pokemon['Type 1'])
          }
          var skill = pokemon.Generation - 1;
          var sex = this.getSexFromHP(pokemon.HP);
          var age = Math.round((pokemon.Total - 180)*82/600 + 18);
          var year_of_arrival = Math.round((10 - pokemon['Sp. Atk'])*52/184 + 2019);
          var salary = this.getSalaryFromSpeedDef(pokemon['Sp. Def']) ;
          var agent = pokemonTypes.indexOf(pokemon['Type 1']) % 5 + 1;
          var satisfaction = this.getSatisfactionFromSpeed(pokemon.Speed);
          var new_interaction = new Interaction(sex, age, salary, skill, year_of_arrival, agent, satisfaction)
          this.simulation.addInteraction(new_interaction);
          pokemonInteractions.push(new_interaction)
          i++;
        }
        this.localStorageService.saveActiveSimulation(this.simulation);
        this.socketIoService.addInteractions(this.simulation.id.toString(), pokemonInteractions);
        this.interactionAdded.emit();
      });
  }

  public shuffleArray(array) {
    var dup_array = array.slice();
    for (var i = dup_array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = dup_array[i];
        dup_array[i] = dup_array[j];
        dup_array[j] = temp;
    }
    return dup_array;
}

  getSexFromHP(HP){
    if( 51.5 < HP && HP < 77.5){
      return 2
    } else if (26.5 < HP && HP < 100) {
      return 0
    } else {
      return 1
    }
  }

  getSatisfactionFromSpeed(s){
    if(s < 41 || s > 127){
      return 5
    } else if (s < 58) {
      return 4
    } else if (s < 75) {
      return 3
    } else if (s < 93) {
      return 2
    } else {
      return 1
    }
  }

  getSalaryFromSpeedDef(sd){
    if(sd < 42){
      return 0
    } else if (sd < 63) {
      return 1
    } else if (sd < 84) {
      return 2
    } else if (sd < 105) {
      return 3
    } else if (sd < 126) {
      return 4
    } else {
      return 5
    }
  }

  ngOnInit() {
    if(this.simulation.interactions.length == 0){
      this.populateDatabaseWithPokemons()
    }
  }
}
