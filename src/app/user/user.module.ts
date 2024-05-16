import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { EditProfileComponent } from './components/profile/components/edit-profile/edit-profile.component';
import { PostsComponent } from './components/profile/components/posts/posts.component';
import { LikedPostsComponent } from './components/profile/components/liked-posts/liked-posts.component';
import { MessageService } from 'primeng/api';
import { UserService } from '../core/services/user.service';
import { PostService } from '../shared/services/post.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    UserComponent,
    EditProfileComponent,
    PostsComponent,
    LikedPostsComponent,
  ],
  providers: [MessageService, UserService, PostService],
  imports: [
    CommonModule,
    UserRoutingModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
