import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/user.service';
import { PostElm } from 'src/app/main/core/interfaces/post-elm';
import { UserRes } from 'src/app/main/core/interfaces/user-res';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-my-saved-posts',
  templateUrl: './my-saved-posts.component.html',
  styleUrls: ['./my-saved-posts.component.css'],
})
export class MySavedPostsComponent implements OnInit {
  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _activateRouter: ActivatedRoute,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._userService.userId.subscribe((data) => {
      if (data) {
        this.userId = data;
        console.log('user id', this.userId);
        this.userId == parseInt(`${localStorage.getItem('token')}`)
          ? (this.isMyProfile = true)
          : (this.isMyProfile = false);
        this.getUserById();
      }
    });
  }

  getUserById(loading: boolean = true) {
    this.loading = loading;
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('dwdwd data', this.user);
        this.allPosts = this.user?.attributes.likedPosts.data;
        console.log('all posts from liked posts', this.allPosts);
        this.loading = false;
      },
      error: (error) => {
        console.log('user error', error);
        this.loading = false;
      },
    });
  }

  refreshPage(event: any) {
    this._messageService.add({
      severity: 'info',
      detail: 'post has been removed',
    });

    setTimeout(() => {
      this.messages = [];
    }, 7000);
    this.getUserById(false);
  }

  user: UserRes | undefined;
  isMyProfile: boolean = false;
  isMyLiked: boolean = true;
  userId: number = 0;
  logedInUserId: number = 0;
  allPosts: PostElm[] = [];
  loading: boolean = false;
  messages: Message[] | undefined;
}
