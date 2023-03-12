
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {EventEmitter, Injectable, Output, Inject,Component, Input, OnInit, ElementRef, Renderer2, RendererFactory2  } from '@angular/core';
import { Observable, of } from 'rxjs';
import {RestService} from '../utilitario/rest.service';
import {UserModel} from '../model/base.model';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import { UtilsService } from '../utilitario/util.service';
import ubigeoPeru from 'ubigeo-peru';
import { tap, map, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public waiting: boolean | undefined;
  private _currentUser!: UserModel;
  public usuario :Usuario | undefined;
  public eventosFavoritos:any=[];
  _renderer2: Renderer2
  @Output() getLoggedInData: EventEmitter<any> = new EventEmitter();

  constructor( private rest: RestService,  private cookieService: CookieService,rendererFactory: RendererFactory2, private utili: UtilsService,private router: Router) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
   }


  setExpirationTime = (minutes: any = 10) => {
    //console.log(moment().add(minutes, 'minutes').toDate());
    return moment().add(minutes, 'minutes').toDate();
  };

  public emitlogin(data) {
    this.getLoggedInData.emit(data);
  }

  public getCurrentUser() {
    const _current = this.cookieService.get('_currentUser');
    const _parseCurrent = (_current && JSON.parse(this.cookieService.get('_currentUser'))) ?
      JSON.parse(this.cookieService.get('_currentUser')) : null;
    return (_current && _parseCurrent) ? _parseCurrent : null;
  }

  public enviarCorreo(data: any = {}): Promise<boolean> {
    return new Promise<boolean>(((resolve, reject) => {
      this.waiting = true;
      //console.log(data);
      this.rest.post_sin_acceso('/send_Forgot_Password', data)
        .then(((response: any) => {
          resolve(response);
          this.waiting = false;
        }).bind(this))
        .catch((e) => {
          this.waiting = false;
          //console.log(e);
          reject(e);
        });
    }).bind(this));
  }
  public login(data: any = {}): Promise<boolean> {
    return new Promise<boolean>(((resolve, reject) => {
      this.waiting = true;
      console.log(data);
      this.rest.post_sin_acceso('LoginWeb', data)
        .then(((response: any) => {
          //console.log('login auth');
          //console.log(response);
          if (response.message=='OK') {
            const token = response.token;
            //console.log(token);
            if (token) {
              console.log(response.data);
              this._currentUser = response.data;
              const {nombre,Apellido,genero,notifNewsletter,NroDocumento,TipoDocumento,email,imagenPerfil} =  response.dataMemory;
              this.usuario =  new Usuario(nombre,Apellido,"",email,"",imagenPerfil,false,genero,"",TipoDocumento,NroDocumento,true,notifNewsletter);
              this._currentUser['menu_rol'] = 'user';
              this._currentUser['token'] = token;
              this._currentUser['exp_time'] = response.exp;
              this._currentUser['img_Perfil'] = this.usuario.ImagenURl;
              this.emitlogin(this._currentUser);
              this.cookieService.set(
                '_currentUser',
                JSON.stringify(response.data),
                response.exp,
                '/'
              );
              resolve(response.data);
            }
            resolve(false);
          } else {
            resolve(false);
          }
          this.waiting = false;
        }).bind(this))
        .catch((e) => {
          this.waiting = false;
          reject(e);
        });
    }).bind(this));
  }

  public consultar_favoritos_guest(usuario:any): Promise<boolean>{
    console.log('consultar_favoritos_guest')
    console.log(usuario)
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('/listar_favoritos_usuario/'+usuario).then((response: any) => {
        console.log(response);
        this.eventosFavoritos =  response.data;
        resolve(response);
      }).catch((error: any) => {
        console.log(error);
        if(error.status='401'){
          this.logout();
        } else {
          resolve(error);
        }
        
      });
    }));
    
  }

  public cleanSession() {
    this._currentUser;
    sessionStorage.removeItem('auth-user');
    sessionStorage.removeItem('auth-user-favorito');
    this.getLoggedInData.emit(null);
  }

  public obtener_cliente_guest(idUsuario):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('/obtener_cliente_guest/' + idUsuario).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {

        reject(error);
      });
    }).bind(this));
  }

  public listar_Eventos_publicos_filtros(filtros: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/listar_Eventos_Publicos_filtro/' + filtros.evento+'/'+ filtros.categoria+'/'+filtros.fecha+'/'+ filtros.horaInicioFin+'/'+ filtros.Ubicacion).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        this.logout();
        this.router.navigateByUrl('/login');
        this.waiting = false;
        reject(error);
      });
    }).bind(this));
  }


  public listar_Eventos_Publicos (filtros: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/listar_Eventos_Publicos/' + filtros).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        this.logout();
        this.router.navigateByUrl('/login');
        this.waiting = false;
        reject(error);
      });
    }).bind(this));
  }
  public registrar_cliente_guest(Nuevocliente):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.post_sin_acceso('registro_cliente',Nuevocliente).then(((response: any) => {

        this.waiting = true;
        resolve(response);

      }).bind(this)).catch((error) => {
        this.logout();
        this.router.navigateByUrl('/login');
        this.waiting = false;
        reject(error.message);
      });
    }).bind(this));
  }
  public validate(): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      this.waiting = true;
      const _tmp_current = this.getCurrentUser();
      const _check = (_tmp_current['exp_time']) ? moment().isAfter(_tmp_current['exp_time']) : true;
      //console.log(_tmp_current['exp_time']);
      //console.log(moment(new Date));
      if (_check) {

        this.rest.get('/auth').then(((response: any) => {
          _tmp_current['token'] = response.token;
          this.cookieService.set(
            '_currentUser',
            JSON.stringify(_tmp_current),
            response.exp,
            '/'
          );
          this.utili.openSnackBar('Bienvenido de vuelta', 'success');
          this.waiting = false;
          resolve(response);

        }).bind(this)).catch((error) => {
          this.logout();
          this.router.navigateByUrl('/login');
          this.waiting = false;
          reject(error.message);
        });

      } else {

        resolve(false);
      }
    }).bind(this));
  }

  public logout(): void {
    this.waiting = true;
    this.cookieService.delete('_currentUser', '/');
    this.cookieService.delete('_wizard_dashboard', '/');
    //this.utili.openSnackBar('Sesión finalizada', 'success');
    this.cleanSession();
    console.log('logout');

    this.router.navigateByUrl('/');
  }
  private get localtoken(): string {
    const obj = this.cookieService.get('_currentUser');
    if (obj && JSON.parse(obj)) {
      return JSON.parse(obj)['token'];
    } else {
      return 'null';
    }
  }

  public get isAuthenticated(): boolean {
    return !!this.localtoken;
    // return !!this.localtoken && this.rest.headers.has('Authorization');
  }

  public get user(): UserModel {
    return this._currentUser;
  }
  suma(a: number, b: number): number {
    return a + b
  }

  public actualizar_cliente_guest (id: any, cliente: any){
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.put('/actualizar_cliente_guest/' +id, cliente).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        this.waiting = false;
        reject(error);
      });
    }).bind(this));
  }

  public forgotPassword (usuario:any){
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.post_sin_acceso('/forgot-password', usuario).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        this.waiting = false;
        reject(error);
      });
    }).bind(this));
  }
 
  validarToken(): Promise<boolean> {


    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('/renew').then(((response: any) => {

        resolve(response);

      }).bind(this)).catch((error) => {

        reject(false);
      });
    }).bind(this));





  }
}
