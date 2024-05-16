import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface loginData {
  id?: number;
  email: string;
  password: string;
}

export interface signupData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  username: string;
  image?: string;
}

export interface strapiSignupData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  username: string;
  image?: string;
}

export const baseUrl: string = 'http://localhost:1337';

@Injectable({
  providedIn: 'root',
})
export class AuthtService {
  constructor(private httpClient: HttpClient) {
    this.updateLoginState();
  }

  doctorLoginState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  doctorId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  loginState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  updateLoginState() {
    let token = localStorage.getItem('token');
    let doctorToken = localStorage.getItem('doctorToken');

    if (doctorToken && doctorToken != null && doctorToken.length > 0) {
      this.doctorLoginState.next(true);
      this.doctorId.next(parseInt(`${localStorage.getItem('doctorToken')}`));
    } else {
      this.loginState.next(false);
    }

    if (token && token != null && token.length > 0) {
      this.loginState.next(true);
      this.userId.next(parseInt(`${localStorage.getItem('token')}`));
    } else {
      this.loginState.next(false);
    }
  }

  login(data: loginData): Observable<any> {
    return this.httpClient.get(
      `${baseUrl}/api/tests?populate=*&pagination[limit]=300`
    );
  }

  signup(data: strapiSignupData): Observable<any> {
    return this.httpClient.post(`${baseUrl}/api/tests?populate=*`, data);
  }

  updateUserInfo(data: any): Observable<any> {
    return this.httpClient.put(`${baseUrl}/api/patients/${data.data.id}`, data);
  }
}
