import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    CommonModule,
    FormsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit {
  constructor(public _postService: PostService) {}

  ngOnInit(): void {
    this.getVideoUrl();
  }

  getVideoUrl() {
    this._postService.videoUrl.subscribe((data) => {
      if (data && this.fromEdit) {
        this.videoUrl = data;
      }
    });
  }

  @Input() videoUrl: string = '';
  @Input() fromEdit: boolean = false;
}
