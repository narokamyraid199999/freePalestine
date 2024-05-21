import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserRes } from '../interfaces/user-res';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor() {}

  isOpend: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  follower: BehaviorSubject<UserRes[]> = new BehaviorSubject<UserRes[]>([]);
}
