import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from './autht.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _Httpclient: HttpClient) {}

  videoUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getAllPosts(): Observable<any> {
    return this._Httpclient.get(
      `${baseUrl}/api/posts?populate=*&pagination[limit]=300`
    );
  }

  getPostById(id: number): Observable<any> {
    return this._Httpclient.get(`${baseUrl}/api/posts/${id}?populate=*`);
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
