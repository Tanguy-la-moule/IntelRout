import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Simulation } from 'src/app/models/Simulation';

import { LocalStorageService } from '../../services/localStorageService/local-storage.service';

@Component({
  selector: 'simulation-picker',
  templateUrl: './simulation-picker.component.html',
  styleUrls: ['./simulation-picker.component.css']
})
export class SimulationPickerComponent implements OnInit {
  @Input() simulations: Array<Simulation>;
  @Input() currentSimulation: Simulation;
  @Output() discard = new EventEmitter<boolean>();
  @Output() save = new EventEmitter();
  @Output() open = new EventEmitter<[boolean, number]>();
  @Output() delete = new EventEmitter<number>();

  displayDiscardModal: boolean = false;
  displayOpenModal: boolean = false;
  displayDeleteModal: boolean = false;
  idToDelete: number = -1;
  idToOpen: number = -1;

  constructor(private localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {}

  openDiscardModal(): void{
    this.displayDiscardModal = true;
  }
  openOpenModal(id: number): void{
    this.displayOpenModal = true;
    this.idToOpen = id;
  }
  openDeleteModal(id: number): void{
    this.displayDeleteModal = true;
    console.log(id)
    this.idToDelete = id;
  }
  closeModals(): void{
    this.displayDiscardModal = false;
    this.displayOpenModal = false;
    this.displayDeleteModal = false;
    this.idToOpen = -1;
    this.idToDelete = -1;
  }

  sendDiscardOrder(save: boolean): void{
    this.discard.emit(save);
    this.closeModals();
  }
  sendOpenOrder(discard: boolean): void{
    if(this.idToOpen > 0){
      this.open.emit([discard, this.idToOpen]);
      this.closeModals();
    } else {
      console.log("logical problem")
    }
  }
  sendDeleteOrder(): void{
    if(this.idToDelete > 0){
      this.delete.emit(this.idToDelete);
      this.closeModals();
    } else {
      console.log("logical problem")
    }
  }
  sendSaveOrder(){
    this.save.emit(true);
  }
}