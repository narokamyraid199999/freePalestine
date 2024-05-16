import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { UserRes } from '../../core/interfaces/user-res';
import { baseUrl } from 'src/app/shared/services/autht.service';

function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
export class PeopleComponent implements OnInit {
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.loading = true;
    this._userService.getAllUsers().subscribe({
      next: (data) => {
        if (data) {
          this.users = data.data;
          shuffle(this.users);
          console.log('users', this.users);
        }
        this.loading = false;
      },
      error: (error) => {
        console.log('error getting users', error);
        this.loading = false;
      },
    });
  }

  loading: boolean = false;
  users: UserRes[] = [];
  url: string = baseUrl;
}
