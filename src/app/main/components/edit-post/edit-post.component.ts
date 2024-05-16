import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { uploadRes } from 'src/app/core/interfaces/uploadRes';
import { UserService } from 'src/app/core/services/user.service';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  constructor(
    private _messageService: MessageService,
    private _userService: UserService,
    private _postService: PostService
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

  postid: number | undefined;
  userId: number | undefined;

  onFileSelected(event: any): void {
    this.uploadedImage = event.target.files[0];
    console.log(this.uploadedImage);
    this._userService.upload(this.uploadedImage).subscribe({
      next: (data: uploadRes) => {
        this.imageUploaded = data;
        console.log(this.imageUploaded);
        this.imageUrl = this.imageUploaded[0].url;
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
            this.loading = false;
            this._messageService.add({
              severity: 'success',
              detail: 'post created successfully',
            });

            this.postForm.setValue({
              content: '',
              tags: '',
              location: '',
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
