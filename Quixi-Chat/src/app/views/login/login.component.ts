import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cannotLogin: boolean = false;
  credentials: any = {
    username: '',
    password: ''
  };

  constructor(private _auth: AuthService, private _cookie: CookieService,
    private _router: Router) { }

  async login() {
    try {
      const result: any = await this._auth.login(this.credentials);
      this._cookie.set('token', `Bearer ${result.token}`, {
        path: '/',
        secure: true,
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
      });
      await this._router.navigate(['/']);
    } catch (error) {
      this.cannotLogin = true;
    }
  }
}
