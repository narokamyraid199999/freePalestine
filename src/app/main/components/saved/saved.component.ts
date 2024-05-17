import { Component, OnInit } from '@angular/core';
import { postData, PostElm } from '../../core/interfaces/post-elm';
import { PostService } from 'src/app/shared/services/post.service';
import { Message, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UserRes } from '../../core/interfaces/user-res';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css'],
})
export class SavedComponent implements OnInit {
  constructor(
    private _postService: PostService,
    private _messageService: MessageService,
    private _activateRouter: ActivatedRoute,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getUserById();
  }

  getUserId() {
    this.userId = parseInt(`${localStorage.getItem('token')}`);
  }

  getUserById() {
    this.loading = true;
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('saved user data', this.user);
        this.allPosts = this.user?.attributes.savedPosts.data;
        this.loading = false;
      },
      error: (error) => {
        console.log('user error', error);
        this.loading = false;
      },
    });
  }

  // getAllPosts(): void {
  //   this.loading = true;
  //   this._postService.getAllPosts().subscribe({
  //     next: (data) => {
  //       this.allPosts = data.data;
  //       console.log(this.allPosts);
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.log('error getting all posts', error);
  //       this.loading = false;
  //     },
  //   });
  // }

  deletePost(event: any) {
    this._messageService.add({
      severity: 'info',
      detail: 'Removed from saved posts',
    });

    setTimeout(() => {
      this.messages = [];
    }, 7000);
    this.getUserById();
  }

  refreshPage(event: any) {
    this._messageService.add({
      severity: 'info',
      detail: 'post has been removed',
    });

    setTimeout(() => {
      this.messages = [];
    }, 7000);
    this.getUserById();
  }

  allPosts: PostElm[] = [];
  loading: boolean = false;
  messages: Message[] | undefined;
  userId: number = 0;
  user: UserRes | undefined;
  fromSaved: boolean = true;
}
