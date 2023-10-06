import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiURL: string = environment.apiURL;
  private _user: any;
  constructor(private _http: HttpClient, private _cookie: CookieService) { }

  login(credentials: any) {
    return new Promise((resolve, reject) => {
      try {
        this._http.post(`${this._apiURL}/auth/login`, credentials).pipe(take(1)).subscribe({
          next: data => { resolve(data) },
          error: error => { reject(error) }
        })
      } catch (error) {
        reject(error);
      }
    })
  }

  async register(credentials: any) {
    return new Promise((resolve, reject) => {
      try {
        this._http.post(`${this._apiURL}/auth/register`, credentials).pipe(take(1)).subscribe({
          next: data => { resolve(data) },
          error: error => { reject(error) }
        })
      } catch (error) {
        reject(error);
      }
    })
  }

  async isLoggedIn() {
    return this._cookie.get('token') ? true : false;
  }

  async getSessionData() {
    if (this._user) {
      return this._user;
    }
    this._user = await this.getUserData();
    return this._user;
  }

  async getUserData(user: string = '') {
    return await new Promise((resolve, reject) => {
      const url = user != '' ? `${this._apiURL}/auth/user/${user}` : `${this._apiURL}/auth/user`;
      this._http.get(url, {
        headers: {
          Authorization: this._cookie.get('token')
        }
      }).pipe(take(1)).subscribe({
        next: (data: any) => { resolve({
          username: data['username'],
          alias: data['alias'],
          profile_picture: data['profile_picture']
        }) },
        error: error => { reject(error) }
      });
    });
  }

  async userExists(username: string) {
    try {
      const user = await this.getUserData(username);
      return user;
    } catch (error) {
      return false;
    }
  }

  async getToken() {
    return this._cookie.get('token');
  }
}
