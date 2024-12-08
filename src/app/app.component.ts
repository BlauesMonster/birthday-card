import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CandleBlowerComponent} from './candle-blower/candle-blower.component';

@Component({
  selector: 'app-root',
  imports: [CandleBlowerComponent],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'birthday-card';
}
