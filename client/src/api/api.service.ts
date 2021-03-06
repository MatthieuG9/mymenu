import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/auth/auth.service';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ingredient } from 'src/models/ingredient';
import { ApiModule } from './api.module';

export interface ApiFeathersResponse<T> {
  data: T[],
  limit: number,
  skip: number,
  total: number
}

@Injectable({
  providedIn: ApiModule
})
export class ApiService {

  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(protected auth: AuthService, protected http: HttpClient) {
    auth.authentificated.subscribe((authentificated) => {
      if (authentificated) {
        this.options.headers = this.options.headers.append('Authorization', 'Bearer ' + this.auth.getToken())
      }
    });
  }

  getApiUrl() {
    return environment.apiUrl
  }

  getResultData(res: any) {
    return res && res.data || res;
  }

  handleError(error: Response | any): Observable<any> {
    console.error('ApiService::handleError', error);
    return throwError(error);
  }

  findIngredients(search: string, limit: number) {
    let url = 'ingredients?name[$search]=' + search;
    if (limit) {
      url += '&$limit=' + limit;
    }
    return this.get(Ingredient, url);
  }

  findIngredient(id: string) {
    return this.getOne(Ingredient, 'ingredients/' + id);
  }

  save<T>(T: new (any?) => T, url: string, data: T, options?: any) {
    if ((data as any)._id) {
      return this.updateOne<T>(T, url + '/' + (data as any)._id, data, options);
    } else {
      return this.postOne<T>(T, url, data, options);
    }
  }

  getRaw<T>(url: string, options?: any): Observable<any> {
    let sendOptions = this.options;
    if (options) {
      sendOptions = _.extend({}, this.options, options);
    }
    return this.http.get<T>(this.getApiUrl() + url, sendOptions)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  getOne<T>(T: new (any?) => T, url: string, options?: any): Observable<T> {
    return this.getRaw<T>(url, options)
      .pipe(
        map((data: T) => new T(data)),
        catchError(err => this.handleError(err))
      )
  }

  get<T>(T: new (any?) => T, url: string, options?: any): Observable<T[]> {
    return this.getRaw<T[]>(url, options)
      .pipe(
        map((res: ApiFeathersResponse<T>) => {
          let data = this.getResultData(res);
          data = _.isArray(data) ? data.map((item: T) => new T(item)) : [];
          return data;
        }),
        catchError(err => this.handleError(err))
      );
  }

  postRaw<T>(url: string, data?: any, options?: any): Observable<any> {
    let sendOptions = this.options;
    if (options) {
      sendOptions = _.extend({}, this.options, options);
    }
    data = this.mapData(data);
    return this.http.post<T>(this.getApiUrl() + url, data, sendOptions)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  postOne<T>(T: new (any?) => T, url: string, data?: any, options?: any): Observable<T> {
    let sendOptions = this.options;
    if (options) {
      sendOptions = _.extend({}, this.options, options);
    }
    data = this.mapData(data);
    return this.http.post<T>(this.getApiUrl() + url, data, sendOptions)
      .pipe(
        map((item: T) => new T(item)),
        catchError(err => this.handleError(err))
      );
  }

  updateOne<T>(T: new (any?) => T, url: string, data?: any, options?: any): Observable<T> {
    let sendOptions = this.options;
    if (options) {
      sendOptions = _.extend({}, this.options, options);
    }
    data = this.mapData(data);
    return this.updateRaw<T>(url, data, sendOptions)
      .pipe(
        map((item: T) => new T(item)),
        catchError(err => this.handleError(err))
      );
  }

  updateRaw<T>(url: string, data?: any, options?: any): Observable<any> {
    data = this.mapData(data);
    return this.http.patch(this.getApiUrl() + url, data, options)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  deleteById(url: string, id: string | number, options?: any) {
    let sendOptions = this.options;
    if (options) {
      sendOptions = _.extend({}, this.options, options);
    }
    return this.deleteRaw(url + "/" + id, sendOptions);
  }

  deleteRaw(url: string, options?: any): Observable<any> {
    return this.http.delete(this.getApiUrl() + url, options)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  private mapData(data: any): any {
    if (_.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        let one: any = data[i];
        if (one._className) {
          delete one._className;
          data[i] = one;
        }
      }
    } else if (_.isObject(data) && (data as any)._className) {
      delete (data as any)._className;
    }
    return data;
  }
}
