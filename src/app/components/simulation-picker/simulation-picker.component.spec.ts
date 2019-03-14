import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationPickerComponent } from './simulation-picker.component';

describe('SimulationPickerComponent', () => {
  let component: SimulationPickerComponent;
  let fixture: ComponentFixture<SimulationPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
