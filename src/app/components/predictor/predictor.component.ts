import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Simulation } from 'src/app/models/Simulation';
import { SocketIoService } from 'src/app/services/socketIoService/socketio.service';
import Plotly from 'plotly.js-dist';
import { observable } from 'rxjs';

@Component({
  selector: 'predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit {
  @Input() simulation: Simulation;
  @Input() isModelTrained: number;
  @Output() train = new EventEmitter();

  sex: number = 0;
  age: number = 18;
  salary: number = 0;
  skill: number = 0;
  year_of_arrival: number = 2019;
  displayPredictionModal: boolean = false;
  prediction: number;
  loading: boolean = false;
  stars: Array<boolean> = [false, false, false, false, false];
  displaySatisfaction: boolean = false;
  satisfactionObservable: any;
  

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

  public layout = {
    title: {
      text:"Past interactions used to train the routing algorithm:",
    },
  };

  constructor(private socketIoService: SocketIoService) {
    
  }

  ngOnInit() {
    this.trained();
    this.getCall();
    this.agentPredicted();
  }

  public predictBestAgent(){
    this.socketIoService.predictBestAgent(this.simulation.id.toString(), this.sex, this.age, this.skill, this.year_of_arrival, this.salary);
  }

  public trained(): void {
    this.socketIoService.modelTrained().subscribe(result => {
      console.log("agent predicted: "+ result);
      this.loading = false;
    })
  }

  public agentPredicted(): void {
    this.socketIoService.agentPredicted().subscribe(result => {
      console.log("agent predicted: "+ result);
      this.prediction = result;
      this.displayPredictionModal = true;
      setTimeout(() => {
        this.generateGraph();
      }, 1);
    })
  }

  public chargeSatisfaction(i: number): void{
    this.stars = [false, false,false, false, false];
    for(let a = 1; a < i+1  ; a++){
      this.modifyStars(a)
    }
  }

  public modifyStars(i: number){
    setTimeout(() => {
      this.stars = [i>0, i>1, i>2, i>3, i>4];
    }, i*200 + 600);
  }

  public getCall(): void {
    this.socketIoService.callArriving().subscribe(result => {
      this.prediction = result['agent_ID'];
      this.skill = parseInt(result['intent']) - 1;
      this.age = result['customer']['user_fields']['age'];
      this.sex = result['customer']['user_fields']['gender'];
      this.year_of_arrival = result['customer']['user_fields']['client_since'];
      this.salary = this.getSalaryFromZendeskSalary(result['customer']['user_fields']['salary']);
      this.satisfactionObservable = this.getSatisfaction();
      this.displayPredictionModal = true;
      setTimeout(() => {
        this.generateGraph();
      }, 1);
    })
  }

  public getSatisfaction(): void {
    this.socketIoService.satisfactionArriving().subscribe(result => {
      this.displaySatisfaction = true;
      this.chargeSatisfaction(result['rating']);
    })
  }

  public getSalaryFromZendeskSalary(salary: number){
    if (salary < 10000){return 0}
    else if (salary < 30000){return 1}
    else if (salary < 50000){return 2}
    else if (salary < 100000){return 3}
    else if (salary < 200000){return 4}
    else {return 5}
  }

  public trainModel(){
    this.train.emit();
    this.loading = true;
  }

  public closeModals(){
    this.displayPredictionModal = false;
    if(this.satisfactionObservable){this.satisfactionObservable.unsubscribe();}
    this.displaySatisfaction = false;
  }

  generateGraph(){
    var data = [{
      type: 'parcoords',
      line  : {
        showscale: true,
        color: this.unpack(this.simulation.interactions, 'satisfaction'),
        colorscale: [[0, '#FF0000'], [0.6, '#FFFF00'], [0.66, '#FFFF00'], [1, '#00FF00']]
      },

      dimensions: [{
        tickvals: [5,4,3,2,1,0],
        ticktext: ['Other', 'Appointment', 'Checks', 'New card', 'Loan', 'Card loss'],
        range: [0,5],
        label: 'Skill',
        values: this.unpack(this.simulation.interactions, 'skill')
      }, {
        tickvals: [0, 1, 2],
        ticktext: ['Male', 'Non Binary', 'Female'],
        //constraintrange: [this.sex - 0.5, this.sex + 0.5],
        constraintrange: this.getSexConstraint(this.sex),
        range: [0,2],
        label: 'Sex',
        values: this.unpack(this.simulation.interactions, 'sex')
      }, {
        tickvals: [18, 20, 40, 60, 80, 100],
        ticktext: ['18', '20', '40', '60', '80', '100'],
        constraintrange: [this.age - 10, this.age + 10],
        range: [18,100],
        label: 'Age',
        values: this.unpack(this.simulation.interactions, 'age')
      }, {
        tickvals: [1970, 1980, 1990, 2000, 2010, 2020],
        ticktext: ['1970', '1980', '1990', '2000', '2010', '2020'],
        constraintrange: [this.year_of_arrival - 10, this.year_of_arrival + 10],
        range: [1970,2019],
        label: 'Arrival',
        values: this.unpack(this.simulation.interactions, 'year_of_arrival')
      }, {
        tickvals: [0, 1, 2, 3, 4, 5],
        ticktext: ['< $10k', '$10k - $30k', '$30k - $50k', '$50k - $100k', '$100k - $200k', '> $200k'],
        constraintrange: [this.salary - 0.5, this.salary + 0.5],
        range: [0,5],
        label: 'Salary',
        values: this.unpack(this.simulation.interactions, 'salary')
      }, {
        tickvals: [1, 2, 3, 4, 5],
        ticktext: ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4', 'Agent 5'],
        range: [1,5],
        label: 'Agent',
        values: this.unpack(this.simulation.interactions, 'agent_ID')
      }, {
        range: [1,5],
        label: 'Satisfaction',
        values: this.unpack(this.simulation.interactions, 'satisfaction')
      }]
    }];

    Plotly.newPlot('graphDiv2', data, this.layout, {responsive: true});
  }

  getSexConstraint(sex: number){
    if(sex == 0){return [0, 0.5]};
    if(sex == 1){return [0.5, 1.5]};
    if(sex == 2){return [1.5, 2]};
  }

  unpack(rows, key) {
    return rows.map(function(row) {
      return row[key]; 
    });
  }
}
