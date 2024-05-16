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
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';

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

  editProfile() {}
}
