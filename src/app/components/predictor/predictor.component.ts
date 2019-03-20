import { Component, OnInit, Input } from '@angular/core';
import { Simulation } from 'src/app/models/Simulation';
import { SocketIoService } from 'src/app/services/socketIoService/socketio.service';

@Component({
  selector: 'predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent implements OnInit {
  @Input() simulation: Simulation;

  sex: number = 0;
  age: number = 18;
  salary: number = 0;
  skill: number = 0;
  year_of_arrival: number = 2019;
  displayPredictionModal: boolean = false;
  displayCallModal: boolean = false;
  beginCall: boolean = false;
  prediction: number;

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

  constructor(private socketIoService: SocketIoService) {
    this.agentPredicted()
  }

  ngOnInit() {
  }

  public predictBestAgent(){
    this.socketIoService.predictBestAgent(this.simulation.id.toString(), this.sex, this.age, this.skill, this.year_of_arrival, this.salary);
  }


  public agentPredicted(): void {
    this.socketIoService.agentPredicted().subscribe(result => {
      console.log("agent predicted: "+ result);
      this.prediction = result;
      this.displayPredictionModal = true;
    })
  }

  public openCallModal(){
    this.displayCallModal = true;
    setTimeout(() => {
      this.beginCall = true;
      setTimeout(() => {
        this.beginCall = false;
        this.closeModals();
      }, 5000);
    }, 3000);
  }

  public closeModals(){
    this.displayPredictionModal = false;
    this.displayCallModal = false;
  }
}
