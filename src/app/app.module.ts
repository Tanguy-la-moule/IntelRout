import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SimulationComponent } from './components/simulation/simulation.component';
import { LocalStorageService } from './services/localStorageService/local-storage.service';
import { SocketIoService } from './services/socketIoService/socketio.service'
import { SimulationPickerComponent } from './components/simulation-picker/simulation-picker.component';
import { ChartComponent } from './components/chart/chart.component';
import { PredictorComponent } from './components/predictor/predictor.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulationComponent,
    SimulationPickerComponent,
    ChartComponent,
    PredictorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    LocalStorageService,
    SocketIoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
