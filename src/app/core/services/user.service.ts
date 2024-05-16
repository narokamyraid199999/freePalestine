import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from 'src/app/shared/services/autht.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _HttpClient: HttpClient) {}

  userId: BehaviorSubject<number | undefined> = new BehaviorSubject<
    number | undefined
  >(0);
  logedInUserId: BehaviorSubject<number | undefined> = new BehaviorSubject<
    number | undefined
  >(0);

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('ref', 'api::test.test');
    formData.append('refid', '1');
    formData.append('field', 'image');
    formData.append('files', file);

    return this._HttpClient.post('http://localhost:1337/api/upload', formData);
  }

  getAllUsers(): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}/api/tests?populate=*&pagination[limit]=300`
    );
  }

  updateUserInfo(data: any, userId: any): Observable<any> {
    return this._HttpClient.put(
      `${baseUrl}/api/tests/${userId}?populate=*&pagination[limit]=300`,
      data
    );
  }

  getUserById(userId: any): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}/api/tests/${userId}?populate=*&pagination[limit]=300`
    );
  }
}
