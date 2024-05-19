import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostCardComponent } from './components/post-card/post-card.component';

@NgModule({
  declarations: [PostsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, PostsRoutingModule, PostCardComponent],
})
export class PostsModule {}
