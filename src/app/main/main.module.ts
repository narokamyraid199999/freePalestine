import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from './components/home/home.component';
import { ExploreComponent } from './components/explore/explore.component';
import { PeopleComponent } from './components/people/people.component';
import { SavedComponent } from './components/saved/saved.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { TopCreatorsComponent } from './components/top-creators/top-creators.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PostService } from '../shared/services/post.service';
import { UserService } from '../core/services/user.service';
import { HomePostsComponent } from './components/home-posts/home-posts.component';
import { PostCardComponent } from '../posts/components/post-card/post-card.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ExploreCardComponent } from './components/explore-card/explore-card.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyPostsComponent } from './components/profile/components/my-posts/my-posts.component';
import { MySavedPostsComponent } from './components/profile/components/my-saved-posts/my-saved-posts.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FilterPipe } from './core/filter.pipe';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    ExploreComponent,
    PeopleComponent,
    SavedComponent,
    CreatePostComponent,
    TopCreatorsComponent,
    HomePostsComponent,
    EditPostComponent,
    ExploreCardComponent,
    PostDetailsComponent,
    ProfileComponent,
    MyPostsComponent,
    MySavedPostsComponent,
    FilterPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [
    ScrollPanelModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MainRoutingModule,
    ToastModule,
    BadgeModule,
    ProgressBarModule,
    InputTextareaModule,
    FileUploadModule,
    ProgressSpinnerModule,
    InputTextModule,
    ButtonModule,
    PostCardComponent,
    SkeletonModule,
  ],
  providers: [MessageService, PostService, UserService],
})
export class MainModule {}
