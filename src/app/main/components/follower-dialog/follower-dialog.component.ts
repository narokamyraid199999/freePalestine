import { Component, OnDestroy, OnInit } from '@angular/core';
import { FollowService } from '../../core/services/follow.service';
import { UserRes } from '../../core/interfaces/user-res';
import { baseUrl } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-follower-dialog',
  templateUrl: './follower-dialog.component.html',
  styleUrls: ['./follower-dialog.component.css'],
})
export class FollowerDialogComponent implements OnInit {
  ngOnInit(): void {
    this.getFollowerData();
  }

  getFollowerData() {
    this._followService.follower.subscribe((data) => {
      if (data) {
        this.follower = data;
        console.log('follower from dialog', this.follower);
      }
    });
    this._followService.isOpend.subscribe((data) => {
      if (data) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  constructor(private _followService: FollowService) {}
  visible: boolean = false;

  follower: UserRes[] = [];
  url: string = baseUrl;
}
