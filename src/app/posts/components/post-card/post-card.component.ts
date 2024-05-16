import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { postData, PostElm } from 'src/app/main/core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { PostService } from 'src/app/shared/services/post.service';
import { EventEmitter } from '@angular/core';

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
  constructor(private _Router: Router, private _postService: PostService) {}
  ngOnInit(): void {
    this.getUserId();
    console.log(this.post);
  }

  getUserId() {
    this.userId = this.post?.attributes.username.data.id;
    this.userId == parseInt(`${localStorage.getItem('token')}`)
      ? (this.isMyProfile = true)
      : (this.isMyProfile = false);
  }

  @Input() post: PostElm | undefined;
  userId: number | undefined = 0;
  isMyProfile: boolean = false;
  url: string = baseUrl;

  @Output()
  postDeleted: EventEmitter<string> = new EventEmitter<string>();

  goToProfile() {
    // this._Router.navigate([
    //   'main/profile',
    //   this.post?.attributes.username.data.id,
    // ]);
    alert('go to user profile');
  }

  navigateToPostEdit() {
    this._Router.navigate(['main/editPost', this.post?.id]);
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
