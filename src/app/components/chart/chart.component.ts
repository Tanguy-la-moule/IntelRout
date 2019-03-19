import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import Plotly from 'plotly.js-dist';
import { Simulation } from 'src/app/models/Simulation';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() simulation: Simulation;
  @Input() refresher: Number;

  layout: Object = {}

  constructor() { }

  ngOnInit() {
    this.generateGraph();
  }

  ngOnChanges(changes: SimpleChange) {
    this.generateGraph()
  }

  generateGraph(){
    var data = [{
      type: 'parcoords',
      line  : {
        showscale: true,
        color: this.unpack(this.simulation.interactions, 'satisfaction'),
        colorscale: [[0, '#FF0000'], [0.6, '#FFFF00'], [0.66, '#FFFF00'], [1, '#00FF00']]
  //      color: 'hsl(345.5, 97.1%, 59.8%)'
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
        range: [0,2],
        label: 'Sex',
        values: this.unpack(this.simulation.interactions, 'sex')
      }, {
        tickvals: [18, 20, 40, 60, 80, 100],
        ticktext: ['18', '20', '40', '60', '80', '100'],
        range: [18,100],
        label: 'Age',
        values: this.unpack(this.simulation.interactions, 'age')
      }, {
        tickvals: [1970, 1980, 1990, 2000, 2010, 2020],
        ticktext: ['1970', '1980', '1990', '2000', '2010', '2020'],
        range: [1970,2019],
        label: 'Arrival',
        values: this.unpack(this.simulation.interactions, 'year_of_arrival')
      }, {
        tickvals: [0, 1, 2, 3, 4, 5],
        ticktext: ['< $10k', '$10k - $30k', '$30k - $50k', '$50k - $100k', '$100k - $200k', '> $200k'],
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

  Plotly.newPlot('graphDiv', data, this.layout);
  }

  unpack(rows, key) {
    return rows.map(function(row) {
      return row[key]; 
    });
  }
}
