import { Component, OnInit } from '@angular/core';
import {SpinnerService} from "./spinner.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor(private spinnerService : SpinnerService) { }

  ngOnInit() {
  }

  get isSpinning(){
    return this.spinnerService.isSpinning();
  }
}
