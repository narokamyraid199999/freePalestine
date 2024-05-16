import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from './autht.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _Httpclient: HttpClient) {}

  getAllPosts(): Observable<any> {
    return this._Httpclient.get(
      `${baseUrl}/api/posts?populate=*&pagination[limit]=300`
    );
  }

  createPost(postData: any): Observable<any> {
    return this._Httpclient.post(`${baseUrl}/api/posts`, postData);
  }

  updatePost(postData: any, id: any): Observable<any> {
    return this._Httpclient.put(`${baseUrl}/api/posts/${id}`, postData);
  }

  deletePost(postId: any): Observable<any> {
    return this._Httpclient.delete(`${baseUrl}/api/posts/${postId}`);
  }
}
