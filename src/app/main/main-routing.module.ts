import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { HomeComponent } from './components/home/home.component';
import { ExploreComponent } from './components/explore/explore.component';
import { SavedComponent } from './components/saved/saved.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PeopleComponent } from './components/people/people.component';
import { authGuard } from '../auth/core/guards/auth.guard';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { EditProfileComponent } from '../user/components/profile/profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyPostsComponent } from './components/profile/components/my-posts/my-posts.component';
import { MySavedPostsComponent } from './components/profile/components/my-saved-posts/my-saved-posts.component';
import { LikedPostsComponent } from '../user/components/profile/components/liked-posts/liked-posts.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: MainComponent,
    children: [
      { canActivate: [authGuard], path: 'home', component: HomeComponent },
      {
        canActivate: [authGuard],
        path: 'explore',
        component: ExploreComponent,
      },
      { canActivate: [authGuard], path: 'people', component: PeopleComponent },
      { canActivate: [authGuard], path: 'saved', component: SavedComponent },
      {
        canActivate: [authGuard],
        path: 'createPost',
        component: CreatePostComponent,
      },
      {
        path: 'postDetails/:id',
        canActivate: [authGuard],
        component: PostDetailsComponent,
      },
      { path: 'editProfile/:id', component: EditProfileComponent },
      {
        path: 'profile/:id',
        redirectTo: 'profile/:id/posts',
        pathMatch: 'full',
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        children: [
          { path: 'posts', component: MyPostsComponent },
          { path: 'savedPosts', component: MySavedPostsComponent },
        ],
      },
      {
        path: 'editPost/:id',
        canActivate: [authGuard],
        component: EditPostComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
