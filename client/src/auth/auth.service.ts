import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { IUser } from 'src/models/user';
import { environment } from 'src/environments/environment.prod';
import { AuthModule } from './auth.module';

@Injectable({
    providedIn: AuthModule
})
export class AuthService {

    protected storagePrefix: string = 'mymenu-';
    public authentificated: BehaviorSubject<boolean | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {
        this.isAuthentificated().subscribe(result => this.authentificated.next(result));
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

    protected getTokenFromCurrentUrl(): string | undefined {
        let url = decodeURIComponent(window.location.href);
        let result = url.match(/\#access_token\=([^&]*)/);
        return result && result.length > 1 && result[1];
    }

    protected refreshToken() {
        let token = this.getTokenFromCurrentUrl();
        if (token) {
            this.store('accessToken', token);
        }
    }

    /**
     * Check if user is authentified and if token is valid
     * @return boolean
     */
    public isAuthentificated(): Observable<boolean> {
        this.refreshToken();
        let token = this.getToken();
        return this.http.get(environment.apiUrl + 'users',
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .pipe(
                map(result => {
                    let user = _.get(result, 'data[0]');
                    this.store('currentUserAuth', user);
                    return user && !!user._id;
                }),
                catchError(x => of(false))
            )
    }

    public login(providerName: string) {
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
