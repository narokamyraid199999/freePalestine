import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { uploadRes } from 'src/app/core/interfaces/uploadRes';
import { UserService } from 'src/app/core/services/user.service';
import { PostService } from 'src/app/shared/services/post.service';
import { PostElm } from '../../core/interfaces/post-elm';
import { baseUrl } from 'src/app/shared/services/autht.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  constructor(
    private _messageService: MessageService,
    private _userService: UserService,
    private _postService: PostService,
    private _activateRouter: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getPostId();
  }

  getPostId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.postid = parseInt(`${data.get('id')}`);
      this.getPostById();
    });
  }

  goBack() {
    this._location.back();
  }

  getPostById() {
    this.loading = true;
    this._postService.getPostById(this.postid).subscribe({
      next: (data) => {
        this.post = data.data;
        console.log('from edit post data', this.post);
        this.postForm.setValue({
          content: this.post?.attributes.content,
          location: this.post?.attributes.location,
          tags: this.post?.attributes.tags,
        });
        this.loading = false;
      },
      error: (err) => {
        console.log('failed to get post data', err);
      },
    });
  }

  postForm: FormGroup = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    location: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    tags: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
  });

  messages: Message[] | undefined;
  post: PostElm | undefined;
  caption: string = '';
  url: string = baseUrl;
  uploadedImage: any;
  loading: boolean = false;

  imageUploaded: uploadRes | undefined;
  imageUrl: string = '';

  postid: number = 0;
  userId: number | undefined;

  onFileSelected(event: any): void {
    this.loading = true;
    this.uploadedImage = event.files[0];
    console.log(this.uploadedImage);
    this._userService.upload(this.uploadedImage).subscribe({
      next: (data: uploadRes) => {
        this.imageUploaded = data;
        console.log(this.imageUploaded);
        this.imageUrl = this.imageUploaded[0].url;
        this.loading = false;
      },
      error: (error) => {
        console.log('error uploading', error);
      },
    });
  }
  markAllAsTouched(form: any) {
    Object.values(form).forEach((control: any) => {
      control?.markAsTouched();
    });
  }

  createPost() {
    this.markAllAsTouched(this.postForm.controls);
    if (this.postForm.valid) {
      this.loading = true;
      let data = {
        data: {
          ...this.postForm.value,
          image: this.imageUrl,
          username: this.userId,
        },
      };
      setTimeout(() => {
        this._postService.updatePost(data, this.postid).subscribe({
          next: (data) => {
            console.log('post created', data);
            this.postid = data.data.id;
            this.loading = false;
            this._messageService.add({
              severity: 'success',
              detail: 'post created successfully',
            });

            Object.values(this.postForm.controls).forEach((elm) =>
              elm.markAsUntouched()
            );

            setTimeout(() => {
              this.messages = [];
            }, 7000);
          },
          error: (error) => {
            console.log('error creating post', error);
          },
        });
      }, 1000);
    }
  }
}
