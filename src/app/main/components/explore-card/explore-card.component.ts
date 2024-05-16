import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { PostElm } from '../../core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.css'],
})
export class ExploreCardComponent implements OnInit {
  constructor(private _postService: PostService, private _Router: Router) {}
  ngOnInit(): void {
    console.log(this.post);
  }

  @Input() post: PostElm | undefined;
  @Input() myPosts: boolean = false;

  @Output()
  postDeleted: EventEmitter<string> = new EventEmitter<string>();

  url: string = baseUrl;

  @Output()
  likeEvent: EventEmitter<string> = new EventEmitter();

  like() {
    let data = {
      data: {
        likes: !this.post?.attributes.likes
          ? 1
          : parseInt(this.post?.attributes.likes) + 1,
      },
    };
    this._postService.updatePost(data, this.post?.id).subscribe((data: any) => {
      console.log('likes updated', data);
      this.likeEvent.emit('likes');
    });
  }

  navigateToPostEdit() {
    this._Router.navigate(['main/editPost', this.post?.id]);
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
