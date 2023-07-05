import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UtilsService } from './util.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  public headers: HttpHeaders | undefined;
  location_zip = '';
  public lat: string = '';
  public lng: string = '';
  public readonly url_v: string = environment.endpoint2;
  public readonly url: string = environment.endpoint;
  public readonly AH_url: string = environment.AH_url;
  public readonly goo_su_token: string = environment.goo_su_token;

  // public readonly url: string = 'http://127.0.0.1:8000/api/1.0';

  constructor(public http: HttpClient,
    private router: Router,
    public utils: UtilsService,
    private cookieService: CookieService,
  ) {

  }
  getHeaders2 = (ignoreLoading = false) => {
    const _label = this.cookieService.get('_check_session_label');
    const _label_exists = this.cookieService.get('_check_session_label_exists');
    const _cookie_data = this.cookieService.get('_location_zip_code');
    this.location_zip = (_cookie_data && JSON.parse(_cookie_data)) ?
      JSON.parse(_cookie_data) : null;
    this.location_zip = (this.location_zip && this.location_zip['zip_code']) ?
      this.location_zip['zip_code'] : '';
    this.lat = this.cookieService.get('customer_lat') ? this.cookieService.get('customer_lat') : '';
    this.lng = this.cookieService.get('customer_lng') ? this.cookieService.get('customer_lng') : '';
    const timezone = new Date().getTimezoneOffset();
    // @ts-ignore
    let _header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (ignoreLoading) {
      _header['ignoreLoadingBar'] = '';
    }
    if (_label) {
      _header['COOKIES-REF'] = _label;
    }
    this.headers = new HttpHeaders(_header);
    return this.headers;
  };

  getHeaders = (ignoreLoading = false) => {
    const _label = this.cookieService.get('_check_session_label');
    const _label_exists = this.cookieService.get('_check_session_label_exists');
    const _cookie_data = this.cookieService.get('_location_zip_code');
    this.location_zip = (_cookie_data && JSON.parse(_cookie_data)) ?
      JSON.parse(_cookie_data) : null;
    this.location_zip = (this.location_zip && this.location_zip['zip_code']) ?
      this.location_zip['zip_code'] : '';
    this.lat = this.cookieService.get('customer_lat') ? this.cookieService.get('customer_lat') : '';
    this.lng = this.cookieService.get('customer_lng') ? this.cookieService.get('customer_lng') : '';
    const timezone = new Date().getTimezoneOffset();
    // @ts-ignore
    let _header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'TIME-ZONE': `${timezone}`,
      'LOCATION-ZIP': (this.location_zip) ? this.location_zip : '',
      'LAT': (this.lat) ? this.lat : '',
      'LNG': (this.lng) ? this.lng : '',
      'Authorization': `Bearer ${this.localtoken}`,
    };
    if (ignoreLoading) {
      _header['ignoreLoadingBar'] = '';
    }
    if (_label) {
      _header['COOKIES-REF'] = _label;
    }
    this.headers = new HttpHeaders(_header);
    return this.headers;
  };

  AH_getHeaders = (ignoreLoading = false) => {

    // @ts-ignore
    let _header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-goo-api-token': this.goo_su_token
    };
    if (ignoreLoading) {
      _header['ignoreLoadingBar'] = '';
    }

    this.headers = new HttpHeaders(_header);
    return this.headers;
  };

  getHeadersMedia = () => {
    const _cookie_data = this.cookieService.get('_location_zip_code');
    this.location_zip = (_cookie_data && JSON.parse(_cookie_data)) ?
      JSON.parse(_cookie_data) : null;
    this.location_zip = (this.location_zip && this.location_zip['zip_code']) ?
      this.location_zip['zip_code'] : '';
    const timezone = new Date().getTimezoneOffset();
    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'TIME-ZONE': `${timezone}`,
      'LOCATION-ZIP': this.location_zip,
      'Authorization': `Bearer  ${this.localtoken}`
    });
    return this.headers;
  };

  private get localtoken(): string {
    const obj = this.cookieService.get('_currentUser');
    //console.log('token',JSON.parse(obj)['token'])
    if (obj && JSON.parse(obj)) {

      return JSON.parse(obj)['token'];
    } else {
      return '';
    }
  }
  getConsulta(endpoint: string, params?: IUrlParams, ignoreLoading: any = false): Promise<object> {
    return this.check(this.http.get(this.getUrl(endpoint, params), {headers: this.getHeaders2()}).toPromise());
  }
  get(endpoint: string, params?: IUrlParams, ignoreLoading: any = false): Promise<object> {
    return this.check(this.http.get(this.getUrl(endpoint, params), {headers: this.getHeaders()}).toPromise());
  }
  getOtroEndPoing(endpoint: string, params?: IUrlParams, ignoreLoading: any = false): Promise<object> {
    return this.check(this.http.get(this.getUrl(endpoint, params), {headers: this.getHeaders2()}).toPromise());
  }

  private check(requestPromise: Promise<object|any>): Promise<object|any> {
    return new Promise<object|any>((resolve, reject) => {
      requestPromise.then(response => {
        console.log(response);
        return resolve(response );
      }).catch(((err: HttpErrorResponse | any) => {
        console.log(err);
        switch (err.status) {

          case 401:
            // this.utils.openSnackBar(err.error.message, '');
            // this.router.navigateByUrl('/home');
            break;
          default:
            // this.utils.openSnackBar(err.error.message, '');
            break;
        }
        // this.utils.openSnackBar(err.error.message, '');
        reject(err);
      }).bind(this));
    });
  }
  post_sin_acceso(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    return this.check(this.http.post(this.AH_getExterno(endpoint, params), body, {headers: this.getHeaders2()}).toPromise());
  }
  post_externo(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    console.log('AH_post',endpoint);
    return this.check(this.http.post(this.getUrl(endpoint, params), body, {headers: this.getHeaders2()}).toPromise());
  }
  post_CopyURL(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    console.log('AH_post',endpoint);
    return this.check(this.http.post(this.AH_getUrl(endpoint, params), body, {headers: this.AH_getHeaders()}).toPromise());
  }
  post(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    return this.check(this.http.post(this.getUrl(endpoint, params), body, {headers: this.getHeaders()}).toPromise());
  }

  postMedia(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    return this.check(this.http.post(this.getUrl(endpoint, params), body,
      {headers: this.getHeadersMedia()}).toPromise());
  }

  putMedia(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    return this.check(this.http.put(this.getUrl(endpoint, params), body,
      {headers: this.getHeadersMedia()}).toPromise());
  }

  put(endpoint: string, body: object, params?: IUrlParams): Promise<object> {
    return this.check(this.http.put(this.getUrl(endpoint, params), body, {headers: this.getHeaders()}).toPromise());
  }

  delete(endpoint: string, params?: IUrlParams): Promise<object> {
    return this.check(this.http.delete(this.getUrl(endpoint, params), {headers: this.getHeaders()}).toPromise());
  }

  public getUrl(endpoint: string, params?: IUrlParams| any): string {
    return this.url
      + ''
      + (endpoint || '/')
      + this.parseParams(params);
  }

  public AH_getUrl(endpoint: string, params?: IUrlParams| any): string {
    console.log('AH_url',endpoint);
    return this.AH_url
      + ''
      + (endpoint || '/')
      + this.parseParams(params);
  }

  public AH_getExterno(endpoint: string, params?: IUrlParams| any): string {
    return this.url+ '' +
       (endpoint || '/')
      + this.parseParams(params);
  }
  private parseParams(params: IUrlParams): string {
    let parsed = '';
    if (params) {
      Object.keys(params).forEach((k, i) => {
        parsed += (i == 0) ? '?' : '&';
        parsed += k + '=' + params[k];
      });
    }
    return parsed;
  }



  AH_post(endpoint: string, params?: IUrlParams, ignoreLoading: any = false): Promise<object> {
    console.log('AH_post',endpoint);
    return this.check(this.http.post(this.AH_getUrl(endpoint, params),
      { headers: this.AH_getHeaders(ignoreLoading) }).toPromise());
  }

}

interface IUrlParams {
  [key: string]: string | number | boolean;
}
