import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UserRes } from '../../core/interfaces/user-res';
import { baseUrl } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _activateRouter: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.userId = parseInt(`${data.get('id')}`);
      this._userService.userId.next(this.userId);
      if (this.userId) {
        this.logedUserId = parseInt(`${localStorage.getItem('token')}`);
        this.logedUserId == this.userId
          ? (this.isMyProfile = true)
          : (this.isMyProfile = false);
        this.getUserById();
      }
    });
  }

  userId: number = 0;
  postsNumber: number = 0;
  likedPostCount: number = 0;
  savedPostCount: number = 0;
  followerCount: number = 0;
  followingCount: number = 0;
  url: string = baseUrl;
  user: UserRes | undefined;
  logedUserId: number = 0;
  isMyProfile: boolean = false;

  getUserById() {
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('user data', this.user);
        this.postsNumber = this.user?.attributes?.posts?.data?.length;
        this.likedPostCount = this.user?.attributes?.likedPosts?.data?.length;
        this.savedPostCount = this.user?.attributes?.savedPosts?.data?.length;
      },
      error: (error) => {
        console.log('user error', error);
      },
    });
  }
}
