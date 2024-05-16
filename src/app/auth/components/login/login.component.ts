import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/user.service';
import { AuthtService } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _authService: AuthtService,
    private _Router: Router,
    private _messageService: MessageService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._authService.userId.subscribe((id) => {
      if (id) {
        this.userId = id;
      }
    });
  }

  messages: Message[] | undefined;
  loading: boolean = false;
  userId: number | undefined;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
    ]),
  });

  markAllAsTouched(form: any) {
    Object.values(form).forEach((control: any) => {
      control?.markAsTouched();
    });
  }

  login() {
    this.markAllAsTouched(this.loginForm.controls);
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      setTimeout(() => {
        this._authService
          .login({ ...this.loginForm.value, id: this.userId })
          .subscribe({
            next: (data: any) => {
              // console.log(data);

              this.loading = false;

              let res: any[] = data?.data;
              console.log(res);
              let loginUser: any[] = res.filter(
                (user) =>
                  this.loginForm.controls['email'].value.toLowerCase() ===
                    user.attributes.email.toLowerCase() &&
                  this.loginForm.controls['password'].value.toLowerCase() ===
                    user.attributes.password.toLowerCase()
              );
              if (loginUser.length > 0) {
                let [user] = loginUser;
                this._authService.userId.next(user.id);
                localStorage.setItem('token', JSON.stringify(this.userId));
                this._userService.logedInUserId.next(this.userId);
                console.log('loged in user id', this.userId);
                // localStorage.setItem('token', JSON.stringify(data?.token));
                this._authService.updateLoginState();
                this._authService.loginState.next(true);
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'user successfully logged in',
                });
                this._Router.navigate(['/main']);
              } else {
                this.loading = false;
                this._messageService.add({
                  severity: 'error',
                  detail: 'incorrect username or password',
                });
                this.loginForm.setValue({ email: '', password: '' });

                setTimeout(() => {
                  this.messages = [];
                }, 7000);
              }
            },
            error: (error) => {
              console.log('login error ', error);
              this.loading = false;
              this._messageService.add({
                severity: 'error',
                detail: `${error?.error?.message}`,
              });
              setTimeout(() => {
                this.messages = [];
              }, 5000);
            },
          });
      }, 1000);
    }
  }
}
