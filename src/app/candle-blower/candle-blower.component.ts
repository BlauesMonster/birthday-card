import { Component } from '@angular/core';
import {CommonModule, NgFor, NgForOf, NgIf} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-candle-blower',
  imports: [
    NgIf,
    NgFor
  ],
  standalone:true,
  animations: [
    trigger('blowOut', [
      state('blown', style({ opacity: 1, transform: 'translateY(-50px)' })),
      transition('* => blown', [
        animate('1s ease-in-out', style({ opacity: 0, transform: 'translateY(-50px)' })),
      ]),
    ]),
  ],

  template: `
    <div>
      <h1>Blow Out the Candles!</h1>
      <div class="circle">
        <div
          *ngFor="let candle of candles; let i = index"
          class="candle"
          [style.transform]="calculatePosition(i).transform"
          [style.zIndex]="calculatePosition(i).zIndex"
        >
          <div class="body"></div>
          <div class="wick" *ngIf="candle.blownOut"></div>
          <div class="flame" *ngIf="!candle.blownOut"></div>
          <div class="smoke" *ngIf="candle.blownOut" [@blowOut]="'blown'"></div>
        </div>
      </div>
      <button (click)="addCandle()">Add Candle</button>
      <button (click)="startListening()">{{ listening ? 'Restart' : 'Start' }}</button>
      <p>{{candlesCount}}</p>
    </div>
  `,
  styles: [


    `

      .circle {
        position: relative;
        width: 300px;
        height: 300px;
        margin: 0 auto;
        border-radius: 50%;
      }

      .candle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: center;
        width: 20px; /* Add width to ensure visibility */
        height: 100px; /* Add height if missing */
      }


      .candle .body {
        width: 20px; /* Adjust width for visibility */
        height: 100px; /* Adjust height to look like a candle */
        background: linear-gradient(to bottom, white, #ff5c5c);
        border-radius: 5px;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }


      .candle .flame {
        width: 10px;
        height: 20px;
        background: radial-gradient(circle, yellow 60%, orange 85%, transparent 100%);
        border-radius: 50%;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        animation: flicker 0.2s infinite alternate;
      }

      .candle .smoke {
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(100, 100, 100, 0.5) 0%, transparent 100%);
        border-radius: 50%;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        animation: smoke-rise 1s infinite;
        opacity: 0;
      }

      .candle .wick {
        width: 2px;
        height: 10px;
        background-color: black;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }


      .candle .smoke::after {
        content: '';
        width: 15px;
        height: 15px;
        background: radial-gradient(circle, rgba(100, 100, 100, 0.3) 0%, transparent 100%);
        border-radius: 50%;
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
      }

      @keyframes flicker {
        0% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) scale(1.2);
          opacity: 0.8;
        }
      }

      @keyframes smoke-rise {
        0% {
          transform: translateX(-50%) translateY(0);
          opacity: 0.7;
        }
        100% {
          transform: translateX(-50%) translateY(-50px);
          opacity: 0;
        }
      }

    `,
  ],
})
export class CandleBlowerComponent {
  candles = [
    { id: 1, blownOut: false, threshold: 100 },
    { id: 2, blownOut: false, threshold: 150 },
    { id: 3, blownOut: false, threshold: 254 },
  ];


  addCandle() {
    const newCandle = {
      id: this.candles.length + 1,
      blownOut: false,
      threshold: Math.random() * 50 + 80, // Random threshold
    };
    this.candles.push(newCandle);
    this.candlesCount = this.candles.length;
  }


  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private microphone!: MediaStreamAudioSourceNode;
  private dataArray!: Uint8Array;

  ngOnInit(): void {}

  async startListening() {
    if (this.listening) {
      this.resetCandles();
      return;
    }

    this.listening = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();

      this.microphone.connect(this.analyser);
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.listenToBlows();
    } catch (err) {
      console.error('Microphone access denied!', err);
    }
  }

  candlesCount = this.candles.length

  listenToBlows() {
    this.analyser.getByteFrequencyData(this.dataArray);

    // Check for a blowing sound based on volume threshold
    const maxVolume = Math.max(...this.dataArray);
    console.log(maxVolume);

    this.blowOutCandle(maxVolume);


    requestAnimationFrame(() => this.listenToBlows());
  }

  blowOutCandle(maxVolume: number) {
    const candle = this.candles.find((c) => !c.blownOut && maxVolume > c.threshold);
    if (candle) {
      candle.blownOut = true;
      console.log(candle, candle.blownOut);
    }
  }

  listening = false;
  resetCandles() {
    this.candles.forEach((c) => (c.blownOut = false));
  }

  calculatePosition(index: number): { transform: string; zIndex: number } {
    const totalCandles = this.candles.length;
    const angle = (index / totalCandles) * 360;
    const radius = 120;

    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    // Invert the zIndex logic: Higher Y (closer to bottom) should have lower zIndex
    const zIndex = Math.round(100 + y); // Larger Y gets a smaller zIndex

    return {
      transform: `translate(${x}px, ${y}px)`,
      zIndex,
    };
  }


}
