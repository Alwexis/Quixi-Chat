import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials: any = {
    username: '',
    password: '',
    alias: '',
    profile_picture: ''
  }
  cannotRegister: boolean = false;
  @ViewChild('PfpInput') pfpInput: ElementRef | undefined;

  constructor(private _auth: AuthService, private _cookie: CookieService,
    private _router: Router) { }

  async register() {
    try {
      const result: any = await this._auth.register(this.credentials);
      this._cookie.set('token', `Bearer ${result.token}`, {
        path: '/',
        secure: true,
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
      });
      await this._router.navigate(['/']);
    } catch (error) {
      this.cannotRegister = true;
    }
  }

  async changeImage(event: any) {
    const file = event.target.files[0];
    // Si es que hay archivo y que el tamaño sea menor a 1MB
    if (file && file.size <= 1048576) {
      this.credentials.profile_picture = await this.getBase64(file);
    } else {
      this.clearImg();
    }
  }

  clearImg() {
    this.credentials.profile_picture = '';
    if (this.pfpInput) {
      this.pfpInput.nativeElement.value = '';
    }
  }

  async getBase64(file: File) {
    return new Promise((resolve: any, reject: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
