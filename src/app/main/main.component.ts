import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthtService, baseUrl } from '../shared/services/autht.service';
import { UserRes } from './core/interfaces/user-res';
import { UserService } from '../core/services/user.service';

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
    this.getUserById();
  }

  constructor(
    private _Router: Router,
    private _authService: AuthtService,
    private _userService: UserService
  ) {}

  userId: number = 0;
  user: UserRes | undefined;
  url: string = baseUrl;

  getUserById() {
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('user data from edit profile', this.user);
      },
      error: (error) => {
        console.log('user error', error);
      },
    });
  }

  Logout() {
    localStorage.removeItem('token');
    this._authService.loginState.next(false);
    this._Router.navigate(['/auth/login']);
  }
}
