import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent {
  constructor(private _location: Location) {}

  GoBack() {
    this._location.back();
  }
}
