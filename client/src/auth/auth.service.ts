import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/models/user';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected storagePrefix:string = 'mymenu-';
  public authentificated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor (private http: HttpClient) {
      if ( this.isAuthentificated() ) {
          this.authentificated.next(true);
      }
  }

  /**
   * Get current authentified user
   * @return User
   */
  public getUser(): IUser {
      let user = this.get('currentUserAuth');
        return user;
  }


  /**
   * Get current access token
   * @return string
   */
  public getToken(): string {
      return this.get('accessToken');
  }

  /**
   * Check if user is authentified and if token is valid
   * @return boolean
   */
  public isAuthentificated(): boolean {
      const token = this.getToken();
      return !!token;
  }

  public login(providerName:string) {
    window.location.href = environment.apiUrl + 'oauth/' + providerName;
  }

  /**
   * Remove all data stored in localstorage
   */
  public logout() {
      this.remove('currentUserAuth');
      this.remove('accessToken');
      this.authentificated.next(false);
  }

  /**
   * Get data stored in LocalStorage
   * @param name 
   */
  private get(name: string) {
      return JSON.parse(localStorage.getItem(this.storagePrefix + name));
  }

  /**
   * Remove data from Localstorage
   * @param name 
   */
  private remove(name: string) {
      localStorage.removeItem(this.storagePrefix + name);
  }

  /**
   * Store data in Localstorage
   * @param name 
   * @param data 
   */
  private store(name: string, data: any) {
      localStorage.setItem(this.storagePrefix + name, JSON.stringify(data));
  }
}
