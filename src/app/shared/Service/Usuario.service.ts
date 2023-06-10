
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
    ////console.log(moment().add(minutes, 'minutes').toDate());
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
      ////console.log(data);
      this.rest.post_sin_acceso('/send_Forgot_Password', data)
        .then(((response: any) => {
          resolve(response);
          this.waiting = false;
        }).bind(this))
        .catch((e) => {
          this.waiting = false;
          ////console.log(e);
          reject(e);
        });
    }).bind(this));
  }
  public login(data: any = {}): Promise<boolean> {
    return new Promise<boolean>(((resolve, reject) => {
      this.waiting = true;
      this.rest.post_sin_acceso('usuario/login', data)
        .then(((response: any) => {
          ////console.log('login auth');
          //console.log(response);
          if (response.ok) {
            const token = response.token;
            ////console.log(token);
            if (token) {
              this._currentUser = response.data;
              //const {nombre,Apellido,genero,notifNewsletter,NroDocumento,TipoDocumento,email,imagenPerfil} =  response.dataMemory;
              //this.usuario =  new Usuario(nombre,Apellido,"",email,"",imagenPerfil,false,genero,"",TipoDocumento,NroDocumento,true,notifNewsletter);
              this._currentUser['menu_rol'] = 'user';
              this._currentUser['token'] = token;
              this._currentUser['exp_time'] = response.exp;
              this._currentUser['img_Perfil'] = response.imagenPerfil;
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

  public consultar_favoritos_guest(token:any): Promise<boolean>{

    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('usuario/consultarfavoritos/'+token).then((response: any) => {
        //console.log('consultar_favoritos_guest',response.data);
        this.eventosFavoritos =  response.data;
        resolve(response);
      }).catch((error: any) => {
        //console.log(error);
        if(error.status='401'){
          this.logout();
        } else {
          resolve(error);
        }
        
      });
    }));
    
  }
  public consultarServicioExpress(): Promise<boolean>{
      var data =  {
        "client_id": "dll1mtvdcu4rowoglpdcvbdby84czn6o.app.com",
        "client_secret": "qbyant7fa9r2xkxnydmw4onbbwbhv59a"
      }
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.post_sin_acceso('https://wscomercialqa.ieduca.pe/seguridad/oauth2/token', data)
        .then(((response: any) => {
          ////console.log('login auth');
          console.log(response);
          resolve(response);
          this.waiting = false;
        }).bind(this))
        .catch((e) => {
          console.log(e);
          this.waiting = false;
          reject(e);
        });
    }));
    
  }

  public cleanSession() {
    this._currentUser;
    sessionStorage.removeItem('auth-user');
    sessionStorage.removeItem('auth-user-favorito');
    this.getLoggedInData.emit(null);
  }

  public obtener_cliente_guest(token):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('usuario/obtenerUsuario/' + token).then(((response: any) => {
        if(response.ok){
          resolve(response);
        } else {
          reject(response);
        }
       
      }).bind(this)).catch((error) => {

        reject(error);
      });
    }).bind(this));
  }

  public listar_Eventos_publicos_filtros(filtros: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {

      this.rest.getConsulta('eventos/listar_Eventos_Publicos_filtro/' + filtros.categoria+'/'+ filtros.evento+'/'+filtros.Ubicacion+'/'+ filtros.horaInicioFin+'/'+ filtros.fecha+'/'+ filtros.busqueda).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        console.log(error)
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
      this.rest.post_sin_acceso('usuario/create',Nuevocliente).then(((response: any) => {

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

 
  


  public logout(): void {
    this.waiting = true;
    this.cookieService.delete('_currentUser', '/');
    this.cookieService.delete('_wizard_dashboard', '/');
    //this.utili.openSnackBar('Sesión finalizada', 'success');
    this.cleanSession();
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

  public actualizar_cliente_guest ( cliente: any){
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.put('usuario/actualizarUsuario' , cliente).then(((response: any) => {
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
 
  validarToken(token): Promise<boolean> {


    return new Promise<boolean>(((resolve, reject) => {
      this.rest.get('usuario/auth/'+token).then(((response: any) => {
        if(response.ok){
          resolve(true);
        } else {
          reject(false);
        }
       

      }).bind(this)).catch((error) => {

        reject(false);
      });
    }).bind(this));





  }
}
