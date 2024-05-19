import { DOCUMENT } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit {
  constructor(public _postService: PostService) {}

  ngOnInit(): void {
    this.getVideoUrl();
  }

  getVideoUrl() {
    this._postService.videoUrl.subscribe((data) => {
      if (data) {
        this.videoUrl = data;
      }
    });
  }

  videoUrl: string = '';
}
