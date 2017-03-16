import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {

  //if multiple processes startSpinning all of them have to stopSpinning before actually the spinning ends
  private spinningCounter: number = 0;

  constructor() { }

  public startSpinning = () => {
    this.spinningCounter += 1;
    console.debug("spinningCounter (start): " + this.spinningCounter);
  };

  public stopSpinning = () => {
    this.spinningCounter -= 1;
    console.debug("spinningCounter (stop): " + this.spinningCounter);
  };

  public isSpinning = () : boolean => {
    return this.spinningCounter >= 1;
  };
}
