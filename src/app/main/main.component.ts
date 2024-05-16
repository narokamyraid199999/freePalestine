import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthtService } from '../shared/services/autht.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  ngOnInit(): void {
    this.getLogedUserId();
  }

  getLogedUserId() {
    this.userId = parseInt(`${localStorage.getItem('token')}`);
  }

  constructor(private _Router: Router, private _authService: AuthtService) {}

  userId: number = 0;

  Logout() {
    localStorage.removeItem('token');
    this._authService.loginState.next(false);
    this._Router.navigate(['/auth/login']);
  }
}
