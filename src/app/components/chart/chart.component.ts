import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor() {
    /*var trace: Plotly.Data[] = [{
      type: 'parcoords',
      line: {
        color: 'blue'
      },
      
      dimensions: [{
        range: [1, 5],
        constraintrange: [1, 2],
        label: 'A',
        values: [1,4]
      }, {    
        range: [1,5],
        label: 'B',
        values: [3,1.5],
        tickvals: [1.5,3,4.5]
      }, {
        range: [1, 5],
        label: 'C',
        values: [2,4],
        tickvals: [1,2,4,5],
        ticktext: ['text 1','text 2','text 4','text 5']
      }, {
        range: [1, 5],
        label: 'D',
        values: [4,2]
      }]
    }];
        
    Plotly.plot('graphDiv', trace);
    */
  }

  ngOnInit() {
  }

}
