import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { uploadRes } from 'src/app/core/interfaces/uploadRes';
import { UserService } from 'src/app/core/services/user.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UserRes } from '../../core/interfaces/user-res';
import { Router } from '@angular/router';
import { baseUrl } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  constructor(
    private _messageService: MessageService,
    private _userService: UserService,
    private _postService: PostService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this.userId = parseInt(`${localStorage.getItem('token')}`);
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

  caption: string = '';

  uploadedImage: any;
  loading: boolean = false;

  imageUploaded: uploadRes | undefined;
  imageUrl: string = '';
  url: string = baseUrl;
  postid: number | undefined;
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
        // this._messageService.add({
        //   severity: 'info',
        //   summary: 'File Uploaded',
        //   detail: 'File has been uploaded successfully',
        // });
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
        this._postService.createPost(data).subscribe({
          next: (data) => {
            console.log('post created', data);
            this.postid = data.data.id;
            this._userService.getUserById(this.userId).subscribe((elm: any) => {
              console.log('elm', elm);
              let info = {
                data: {
                  posts: [
                    ...elm.data.attributes.posts.data.map((elm: any) => elm.id),
                    this.postid,
                  ],
                },
              };
              this._userService
                .updateUserInfo(info, this.userId)
                .subscribe((data) => {
                  console.log('update user info', data);
                  this.loading = false;
                  this._messageService.add({
                    severity: 'success',
                    detail: 'post created successfully',
                  });
                });
            });

            // this.postForm.setValue({
            //   content: '',
            //   tags: '',
            //   location: '',
            // });

            Object.values(this.postForm.controls).forEach((elm) =>
              elm.markAsUntouched()
            );

            setTimeout(() => {
              this.messages = [];
              this._Router.navigate(['/main']);
            }, 4000);
          },
          error: (error) => {
            console.log('error creating post', error);
          },
        });
      }, 1000);
    }
  }
}
