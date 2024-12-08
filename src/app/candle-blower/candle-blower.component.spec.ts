import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandleBlowerComponent } from './candle-blower.component';

describe('CandleBlowerComponent', () => {
  let component: CandleBlowerComponent;
  let fixture: ComponentFixture<CandleBlowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandleBlowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandleBlowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
