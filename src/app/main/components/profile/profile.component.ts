import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UserRes } from '../../core/interfaces/user-res';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { FollowService } from '../../core/services/follow.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _activateRouter: ActivatedRoute,
    private _followService: FollowService
  ) {}
  ngOnInit(): void {
    this.followerReset();
    this.getUserId();
  }

  followerReset() {
    this._followService.isOpend.next(false);
    this._followService.follower.next([]);
  }

  isFollowChecker() {
    this.logedUserId = parseInt(`${localStorage.getItem('token')}`);
    this._userService.getUserById(this.logedUserId).subscribe((data: any) => {
      let res: UserRes = data.data;
      if (
        res.attributes.followings.data.filter(
          (user: UserRes) => user.id == this.userId
        ).length > 0
      ) {
        this.isFollow = true;
      } else {
        this.isFollow = false;
      }
      // console.log('from follwer checker', res);
    });
  }

  getUserId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.userId = parseInt(`${data.get('id')}`);
      this.isFollowChecker();
      this._userService.userId.next(this.userId);
      if (this.userId) {
        this.logedUserId = parseInt(`${localStorage.getItem('token')}`);
        this.logedUserId == this.userId
          ? (this.isMyProfile = true)
          : (this.isMyProfile = false);
        // get loged user

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
  loading: boolean = false;
  isFollow: boolean = false;

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

  showFollow(follow: string) {
    if (follow.includes('followers')) {
      this._followService.follower.next(this.user?.attributes.followers.data);
    } else {
      this._followService.follower.next(this.user?.attributes.followings.data);
    }
    this._followService.isOpend.next(true);
  }

  follow(action: string = 'follow') {
    this.loading = true;
    setTimeout(() => {
      if (action == 'follow') {
        this._userService
          .getUserById(this.logedUserId)
          .subscribe((logedUser: any) => {
            let info = {
              data: {
                followings: [
                  ...logedUser.data.attributes.followings.data.map(
                    (elm: any) => elm.id
                  ),
                  this.user?.id,
                ],
              },
            };
            this._userService
              .updateUserInfo(info, this.logedUserId)
              .subscribe((data) => {
                console.log('data updated', data);
                this.updateCurrentUserFollowers(logedUser.data.id);
                this.loading = false;
                this.isFollow = !this.isFollow;

                // this.isFollowChecker();
              });
          });
      } else {
        this._userService
          .getUserById(this.logedUserId)
          .subscribe((logedUser: any) => {
            let info = {
              data: {
                followings: [
                  ...logedUser.data.attributes.followings.data.filter(
                    (elm: any) => elm.id != this.user?.id
                  ),
                ],
              },
            };
            this._userService
              .updateUserInfo(info, this.logedUserId)
              .subscribe((data) => {
                console.log('unfollow user successfully');
                let info = {
                  data: {
                    followers: this.user?.attributes.followers.data.filter(
                      (follow: UserRes) => follow.id != this.logedUserId
                    ),
                  },
                };

                this._userService
                  .updateUserInfo(info, this.user?.id)
                  .subscribe((data) => {
                    console.log('unfollow user successfully');

                    this.loading = false;
                    this.isFollow = !this.isFollow;
                  });
              });

            // this.isFollowChecker();
          });
      }
    }, 500);
  }

  updateCurrentUserFollowers(id: number) {
    this._userService.getUserById(this.logedUserId).subscribe((elm: any) => {
      let info = {
        data: {
          followers: [
            ...elm.data.attributes.followers.data.map((elm: any) => elm.id),
            id,
          ],
        },
      };
      this._userService
        .updateUserInfo(info, this.user?.id)
        .subscribe((data) => {
          console.log('user followers updated', data);
          this.getUserById();
          this.loading = false;
        });
    });
  }
}
