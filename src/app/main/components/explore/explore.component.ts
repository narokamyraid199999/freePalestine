import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { PostService } from 'src/app/shared/services/post.service';
import { PostElm } from '../../core/interfaces/post-elm';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent implements OnInit {
  constructor(
    private _postService: PostService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(load: boolean = false): void {
    this.loading = load;
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
    this.getAllPosts();
  }

  allPosts: PostElm[] = [];
  loading: boolean = false;
  messages: Message[] | undefined;
}
