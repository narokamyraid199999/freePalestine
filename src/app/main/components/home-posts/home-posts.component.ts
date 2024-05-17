import { Component, OnInit } from '@angular/core';
import { PostElm } from '../../core/interfaces/post-elm';
import { PostService } from 'src/app/shared/services/post.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-home-posts',
  templateUrl: './home-posts.component.html',
  styleUrls: ['./home-posts.component.css'],
})
export class HomePostsComponent implements OnInit {
  constructor(
    private _postService: PostService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(loading: boolean = true): void {
    this.loading = loading;
    this._postService.getAllPosts().subscribe({
      next: (data) => {
        this.allPosts = data.data;
        console.log(this.allPosts);
        this.loading = false;
      },
      error: (error) => {
        console.log('error getting all posts', error);
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
    this.getAllPosts(false);
  }

  allPosts: PostElm[] = [];
  loading: boolean = false;
  messages: Message[] | undefined;
}
