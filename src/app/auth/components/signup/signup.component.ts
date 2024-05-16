import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AuthtService } from 'src/app/shared/services/autht.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
    private _authService: AuthtService,
    private _Router: Router,
    private _messageService: MessageService
  ) {}

  messages: Message[] | undefined;

  regForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
    },
    {
      validators: this.passwordMatchChecker,
    }
  );

  passwordMatchChecker(controls: AbstractControl): ValidationErrors | null {
    let error: Object = {};

    if (controls.get('password')?.value != controls.get('rePassword')?.value) {
      error = { passwordmismatch: 'password not matched!' };
      controls.get('rePassword')?.setErrors(error);
    }
    return null;
  }

  markAllAsTouched(form: any) {
    Object.values(form).forEach((control: any) => {
      control?.markAsTouched();
    });
  }
  loading: boolean = false;

  signUP() {
    this.markAllAsTouched(this.regForm.controls);
    if (this.regForm.valid && !this.loading) {
      this.loading = true;
      setTimeout(() => {
        this._authService.login({ ...this.regForm.value, id: 3 }).subscribe({
          next: (data: any) => {
            // console.log(data);

            this.loading = false;

            let res: any[] = data?.data;
            console.log(res);
            let loginUser: any[] = res.filter(
              (user) =>
                this.regForm.controls['email'].value.toLowerCase() ===
                  user.attributes.email.toLowerCase() ||
                this.regForm.controls['username'].value.toLowerCase() ===
                  user.attributes.username.toLowerCase()
            );
            if (loginUser.length > 0) {
              this.loading = false;
              this._messageService.add({
                severity: 'error',
                detail: 'Email or username already registered!',
              });
              this.regForm.setValue({ email: '', password: '' });

              setTimeout(() => {
                this.messages = [];
              }, 7000);
            } else {
              let data: any = {
                data: {
                  ...this.regForm.value,
                },
              };

              this._authService.signup(data).subscribe({
                next: (data) => {
                  console.log(data);
                  this.loading = false;
                  this._Router.navigate(['/auth/login']);
                  this._messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'user successfully logged in',
                  });
                  setTimeout(() => {
                    this.messages = [];
                  }, 5000);
                },
                error: (error) => {
                  console.log('login error ', error);
                  this.loading = false;
                  this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${error?.error?.message}`,
                  });
                  setTimeout(() => {
                    this.messages = [];
                  }, 5000);
                },
              });
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
