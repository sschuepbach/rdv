import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private resetSliderSource = new Subject<any>();
  resetSlider$ = this.resetSliderSource.asObservable();

  //Slider initialisieren
  resetSlider(key?) {
    this.resetSliderSource.next(key);
  }
}
