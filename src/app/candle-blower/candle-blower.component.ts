import {Component, Input} from '@angular/core';
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
    <div class="text-container">
      <div class="card">
        <h1>Alles Gute zum Geburtstag, Franzi!</h1>
        <div class="description">Ich hoffe alle deine Wünsche gehen in Erfüllung :)</div>
        <div>
          <div class="btn">
            <button class="birthday-button" (click)="startListening()">{{ listening ? 'Nochmal!' : 'Drück mich und puste!' }}</button>

          </div>
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
        </div>

        <!--      <button (click)="addCandle()">Add Candle</button>-->

        <!--<p>{{candlesCount}}</p>-->
      </div>
    </div>

  `,
  styles: [



    `
      .btn{
        display: flex
      ;
        justify-content: center;
      }
      .birthday-button {
        background-color: #4caf50; /* Bright green background */
        color: white; /* White text color */
        z-index: 1000;
        border: none; /* Remove default border */
        height: 3rem; /* Button height */
        border-radius: 20px; /* Rounded edges */
        padding: 15px 30px; /* Padding for a bigger button */
        font-size: 18px; /* Larger text */
        font-weight: bold; /* Bold text */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s ease, transform 0.2s ease; /* Transition effects */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
      }

      .birthday-button:hover {
        background-color: #388e3c; /* Darker green on hover */
        transform: scale(1.05); /* Slightly enlarge the button on hover */
      }

      .birthday-button:active {
        transform: scale(0.95); /* Slightly shrink the button when clicked */
      }

      .text-container {
        position: relative; /* Positioning context for the overlay */
        padding: 20px; /* Add some padding around the text */
        text-align: center; /* Center the text */
        height: 100%;
      }

      .text-container h1 {
        color: white; /* White text color for the title */
        font-size: 2.5rem; /* Increase the size of the title */
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add shadow for better readability */
        margin: 0; /* Remove default margin */
      }

      .text-container .description {
        color: white; /* White text color for the description */
        font-size: 1.5rem; /* Size of the description text */
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* Add shadow for better readability */
      }

      /* Overlay styling */
      .text-container::before {
        content: ''; /* Required for pseudo-element */
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
        z-index: -100; /* Position behind the text */
        border-radius: 20px; /* Optional: match button rounded edges */
      }


      .card{
        display: grid;
        grid-template-rows: auto 1fr 3fr;
        align-items: center;
        height: 100%;
      }

      .circle {
        position: relative;
        width: 300px;
        height: 380px;
        bottom: 30px;
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
        background: linear-gradient(to bottom, white, #388e3c);
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
  candles:any[] = [

  ];


  addCandle() {
    const newCandle = {
      id: this.candles.length + 1,
      blownOut: false,
      threshold: Math.floor(Math.random() * (254 - 140 + 1)) + 140 // Random threshold
    };
    this.candles.push(newCandle);
    this.candlesCount = this.candles.length;
  }


  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private microphone!: MediaStreamAudioSourceNode;
  private dataArray!: Uint8Array;

  ngOnInit(): void {
    for (let i = 0; i < this.amount; i++) {
      this.addCandle()
    }
  }

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
  @Input() amount!: number;
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
