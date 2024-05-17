import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PostService } from 'src/app/shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostElm } from '../../core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit {
  constructor(
    private _location: Location,
    private _postService: PostService,
    private _activateRouter: ActivatedRoute,
    private _Router: Router,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.postId = parseInt(`${data.get('id')}`);
      this.loginUserId = parseInt(`${localStorage.getItem('token')}`);
      this.getPostById();
    });
  }

  getPostById() {
    this.loading = true;
    this._postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data.data;
        console.log('post info', this.post);
        this.loading = false;
        this.getRelatedPosts();
      },
      error: (error) => {
        console.log('faild to get post info', error);
        this.loading = false;
      },
    });
  }

  getRelatedPosts() {
    let tempPost: PostElm[] = [];
    this._postService.getAllPosts().subscribe({
      next: (data) => {
        this.relatedPosts = data.data;
        console.log('related posts info', this.relatedPosts);
        let elm = this.post?.attributes.tags.split(',').forEach((word) => {
          if (
            this.relatedPosts.filter((post) =>
              post.attributes.tags.includes(word)
            )
          ) {
            tempPost = [
              ...this.relatedPosts.filter((post) =>
                post.attributes.tags.includes(word)
              ),
            ];
          }
        });
        this.relatedPosts = tempPost;
      },
      error: (error) => {
        console.log('faild to get related posts', error);
        this.loading = false;
      },
    });
  }

  GoBack() {
    this._location.back();
  }

  goToProfile() {
    this._Router.navigate([
      '/main/profile',
      this.post?.attributes.username.data.id,
    ]);
  }

  refreshPage(event: any) {}
  like() {}

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

  postId: number = 0;
  post: PostElm | undefined;
  relatedPosts: PostElm[] = [];

  loading: boolean = false;
  url: string = baseUrl;
  isSaved: boolean = false;
  loginUserId: number = 0;
}
