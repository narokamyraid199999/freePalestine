import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PostElm } from 'src/app/main/core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { PostService } from 'src/app/shared/services/post.service';
import { EventEmitter } from '@angular/core';
import { UserRes } from 'src/app/main/core/interfaces/user-res';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _postService: PostService,
    private _userService: UserService
  ) {}
  ngOnInit(): void {
    this.getUserId();
    console.log(this.post);
  }

  getUserId() {
    this.userId = this.post?.attributes.username.data.id;
    this.loginUserId = parseInt(`${localStorage.getItem('token')}`);
    this.userId == this.loginUserId
      ? (this.isMyProfile = true)
      : (this.isMyProfile = false);
    this.getUserById();
  }

  @Input() post: PostElm = {} as PostElm;
  loginUserId: number = 0;
  userId: number | undefined = 0;
  isMyProfile: boolean = false;
  url: string = baseUrl;
  user: UserRes | undefined;
  isSaved: boolean = false;
  loading: boolean = false;
  isLiked: boolean = false;

  @Output()
  postDeleted: EventEmitter<string> = new EventEmitter<string>();

  goToProfile() {
    this._Router.navigate(['main/profile', this.userId]);
  }

  navigateToPostEdit() {
    this._Router.navigate(['main/editPost', this.post?.id]);
  }

  getUserById() {
    this.loading = true;
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('user data from edit profile', this.user);
        this.loading = false;
      },
      error: (error) => {
        console.log('user error', error);
        this.loading = false;
      },
    });
  }

  savePost() {
    this.isSaved = !this.isSaved;
    if (this.isSaved) {
      this._userService.getUserById(this.loginUserId).subscribe((elm: any) => {
        let info = {
          data: {
            savedPosts: [
              ...elm.data.attributes.savedPosts.data.map((elm: any) => elm.id),
              this.post?.id,
            ],
          },
        };
        this._userService
          .updateUserInfo(info, this.loginUserId)
          .subscribe((data) => {
            console.log('data updated', data);
          });
      });
    } else {
      this._userService.getUserById(this.loginUserId).subscribe((elm: any) => {
        let info = {
          data: {
            savedPosts: [
              ...elm.data.attributes.savedPosts.data.filter(
                (elm: any) => elm.id != this.post?.id
              ),
            ],
          },
        };
        this._userService
          .updateUserInfo(info, this.loginUserId)
          .subscribe((data) => {
            console.log('data updated', data);
          });
      });
    }
  }

  like() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this._userService.getUserById(this.loginUserId).subscribe((elm: any) => {
        let info = {
          data: {
            likedPosts: [
              ...elm.data.attributes.likedPosts.data.map((elm: any) => elm.id),
              this.post?.id,
            ],
          },
        };
        this._userService
          .updateUserInfo(info, this.loginUserId)
          .subscribe((data) => {
            console.log('data updated', data);
            this.post?.attributes.likes
              ? (this.post.attributes.likes += 1)
              : (this.post.attributes.likes = 1);
            let info = {
              data: {
                likes: this.post.attributes.likes,
              },
            };
            this._postService
              .updatePost(info, this.post.id)
              .subscribe((data) => {
                console.log('post likes updated', data);
              });
          });
      });
    } else {
      this._userService.getUserById(this.loginUserId).subscribe((elm: any) => {
        let info = {
          data: {
            likedPosts: [
              ...elm.data.attributes.likedPosts.data.filter(
                (elm: any) => elm.id != this.post?.id
              ),
            ],
          },
        };
        this._userService
          .updateUserInfo(info, this.loginUserId)
          .subscribe((data) => {
            console.log('data updated', data);
            this.post.attributes.likes -= 1;
          });
      });
    }
  }

  goToPostDetails() {
    this._Router.navigate(['main/postDetails', this.post?.id]);
  }

  delete() {
    this._postService.deletePost(this.post?.id).subscribe({
      next: (data) => {
        console.log('delete post', data);
        this.postDeleted.emit('games');
      },
      error: (error) => {
        console.log('fail to delete post', error);
      },
    });
  }
}
