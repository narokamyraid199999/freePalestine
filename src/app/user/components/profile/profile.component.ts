import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { uploadRes } from 'src/app/core/interfaces/uploadRes';
import { UserService } from 'src/app/core/services/user.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UserRoutingModule } from '../../user-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ActivatedRoute } from '@angular/router';
import { UserRes } from 'src/app/main/core/interfaces/user-res';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { baseUrl } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UserRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ScrollPanelModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  constructor(
    private _messageService: MessageService,
    private _userService: UserService,
    private _postService: PostService,
    private _activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._activateRouter.paramMap.subscribe((data) => {
      this.userId = parseInt(`${data.get('id')}`);
      this.getUserById();
    });
  }

  regForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    bio: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
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
  user: UserRes | undefined;
  url: string = baseUrl;

  onFileSelected(event: any): void {
    this.uploadedImage = event.files[0];
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

  getUserById() {
    this._userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
        this.regForm.setValue({
          name: this.user?.attributes.name,
          email: this.user?.attributes.email,
          bio: this.user?.attributes.bio,
          username: this.user?.attributes.username,
        });
        console.log('user data from edit profile', this.user);
      },
      error: (error) => {
        console.log('user error', error);
      },
    });
  }

  editProfile() {
    this.loading = true;
    let data = {
      data: {
        ...this.regForm.value,
        image: this.imageUrl,
      },
    };

    Object.keys(data.data).forEach((key) => {
      if (!data.data[key]) {
        delete data.data[key];
      }
    });

    this._userService.updateUserInfo(data, this.userId).subscribe({
      next: (data) => {
        console.log('user updated successfully', data);
        this.loading = false;
        this._messageService.add({
          severity: 'success',
          detail: 'Profile updated successfully',
        });

        setTimeout(() => {
          this.messages = [];
        }, 5000);
      },
      error: (error) => {
        this.loading = false;
        this._messageService.add({
          severity: 'error',
          detail: 'Failed to update profile',
        });

        setTimeout(() => {
          this.messages = [];
        }, 5000);

        console.log('user error', error);
      },
    });
  }
}
