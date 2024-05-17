import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PostService } from 'src/app/shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostElm } from '../../core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';

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
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getPostById();
  }

  getUserId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.postId = parseInt(`${data.get('id')}`);
    });
  }

  getPostById() {
    this.loading = true;
    this._postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data.data;
        console.log('post info', this.post);
        this.loading = false;
      },
      error: (error) => {
        console.log('faild to get post info', error);
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

  like() {}

  savePost() {}

  postId: number = 0;
  post: PostElm | undefined;
  loading: boolean = false;
  url: string = baseUrl;
  isSaved: boolean = false;
}
