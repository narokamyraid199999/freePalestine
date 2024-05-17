import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { PostElm } from '../../core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UserRes } from '../../core/interfaces/user-res';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.css'],
})
export class ExploreCardComponent implements OnInit {
  constructor(
    private _postService: PostService,
    private _Router: Router,
    private _userService: UserService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this.userId = parseInt(`${localStorage.getItem('token')}`);
    this.getUserById();
  }

  getUserOwnPost() {
    this._userService
      .getUserById(this.post?.attributes.username.data.id)
      .subscribe((data) => {
        console.log('owned post data from explore', data);
      });
  }

  getUserById() {
    this.loading = true;
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        console.log('user data', this.user);
        this.loading = false;
      },
      error: (error) => {
        console.log('user error', error);
        this.loading = false;
      },
    });
  }

  @Input() post: PostElm | undefined;
  @Input() myPosts: boolean = false;
  @Input() fromSaved: boolean = false;

  @Output()
  postDeleted: EventEmitter<string> = new EventEmitter<string>();

  url: string = baseUrl;
  isSaved: boolean = false;
  userId: number = 0;
  loading: boolean = false;
  user: UserRes | undefined;
  messages: Message[] | undefined;
  userOwnPost: UserRes | undefined;

  @Output()
  likeEvent: EventEmitter<string> = new EventEmitter();

  @Output()
  deleteEvent: EventEmitter<string> = new EventEmitter();

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

  savePost() {
    this.isSaved = !this.isSaved;
    if (this.isSaved) {
      this._userService.getUserById(this.userId).subscribe((elm: any) => {
        console.log('elm', elm);
        let info = {
          data: {
            savedPosts: [
              ...elm.data.attributes.savedPosts.data.map((elm: any) => elm.id),
              this.post?.id,
            ],
          },
        };
        this._userService
          .updateUserInfo(info, this.userId)
          .subscribe((data) => {
            console.log('update user info', data);
            this.loading = false;

            this._messageService.add({
              severity: 'info',
              detail: 'Post has been saved',
            });
          });
      });

      setTimeout(() => {
        this.messages = [];
      }, 4000);
    }
  }

  navigateToPostEdit() {
    this._Router.navigate(['main/editPost', this.post?.id]);
  }

  delete() {
    if (this.fromSaved) {
      this._userService.getUserById(this.userId).subscribe((elm: any) => {
        console.log('elm', elm);
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
          .updateUserInfo(info, this.userId)
          .subscribe((data) => {
            this.loading = false;
            this.deleteEvent.emit('deleted');
          });
      });

      setTimeout(() => {
        this.messages = [];
      }, 4000);
    } else {
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
}
