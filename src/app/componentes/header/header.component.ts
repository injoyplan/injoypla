import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { StorageService } from './../../shared/Service/storage.service';
import { FechaEvento } from 'src/app/shared/model/FechaEvento.model';
import { favorito } from 'src/app/shared/model/Favoritos.model';
declare var iziToast: any;
declare var $: any;
@Component({
  standalone: true,
  imports: [NgxSkeletonLoaderModule, FormsModule, CommonModule, SharedModule, RouterLink],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() contactChange:EventEmitter<boolean> =new EventEmitter<boolean>();

  public id: any;
  public token = localStorage.getItem('token')
  public user: any = undefined;
  public cliente: any = {};
  public eventos: Array<any> = [];
  public isloading = false;
  public src: string = '';
  public data: any = [];
  public dataDesktop: any = [];
  public searchOpen = false;
  public user_data: any = null;
  public imgUrl = '';
  public idUsuario = '';
  public loadingRecordar = false;
  public loading = false;
  public PasswordCorrecto = false;
  public emailIncorrecto = false;
  public PantallaLogin = true;
  public PantallaRegistro = false;
  public PantallaRecordarContrasena = false;
  public loadingRegistro = false;
  public mensajeEmail = '';
  public mensajePassword = '';
  public EventosNoRepetidos: any =[];
  public Loginusuario = {
    email: '',
    password: '',

  };
  public Nuevocliente = {
    nombre: '',
    apellido: '',
    email: '',
    genero: '-1',
    f_nacimiento: '',
    terminoCondiciones: false,
    politicaPrivacidad: false,
    password: ''
  }
  public ErrorNuevoCliente = {
    v_genero: false,
    v_fechaNacimiento: false,
    v_email: false,
    v_nombre: false,
    v_apellido: false,
    v_password: false,
    v_politicaPrivacidad: false,
    v_terminoCondiciones: false,    
  }

  public _fechaSrtMaxima: any = "";
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';


  constructor(private rest: RestService, private _router: Router, private cookieService: CookieService,
    private util: UtilsService, private _clienteService: AuthService, private storageService: StorageService) {
    const _current = this.cookieService.get('_currentUser');
    const _parseCurrent = (_current && JSON.parse(this.cookieService.get('_currentUser'))) ?
      JSON.parse(this.cookieService.get('_currentUser')) : null;
    this.user_data= this._clienteService.getCurrentUser();
    this.cliente = undefined;
    this._fechaSrtMaxima = moment(new Date()).format('YYYY-MM-DD');// new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if (_parseCurrent) {
      this.cliente = _parseCurrent.nombre;
      this.idUsuario = _parseCurrent.sub
      this.imgUrl = "../../../assets/img/no-profile-picture-icon.png"
    } else {
      this.cliente = undefined;
    }
  }
  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user_data= this._clienteService.getCurrentUser();
      if(this.user_data!=null){
       
        this.validarSesion();
      }
    
  }

  validarSesion() {
    this.rest.get('usuario/auth/' + this.user_data.token).then((response: any) => {
    
      if(response.ok){
        this.isLoggedIn = response.ok;
      } else {        
        localStorage.clear();
        sessionStorage.clear();
        // this._router.navigate(['/']);
        this._clienteService.logout();
        this.reloadPage();
      }
      
     
    }).catch((error: any) => {
      if (error.status == 401) {
        this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
        this._clienteService.logout();
      } else {
        this.util.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
      }
    });
  }  

  openCart() {
    var clase = $('#modalCarrito').attr('class');
    if (clase == 'ps-panel--sidebar') {
      $('#modalCarrito').addClass('active');
      if (this.user_data) {
        this.consultar_favoritos_guest();
      }
    } else if (clase == 'ps-panel--sidebar active') {
      $('#modalCarrito').removeClass('active');
    }
  }
  openLogin() {
    var clase = $('#dropMenu').attr('class');
    if (clase == 'dropdown-menu') {
      $('#dropMenu').addClass('active');
      $('#dropMenu').css({ "left": "-120px", "top": "43px", "display": "block" });
    } else {
      $('#dropMenu').removeClass('active');
      $('#dropMenu').css({ "left": "0px", "top": "43px", "display": "none" });
    }
  }
  EliminarFavoritos(id_evento:any,id_fecha:any) {
    var idFavorito = idFavorito;
    if (!this.user_data) {
      this.util.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('usuario/eliminar_favoritos/'+id_evento+"/"+id_fecha).then((response: any) => {
        if (response.ok) {
         
          this.verFavoritosUsuario(this.user_data.token,2);
         
         
        } else {
          this.util.openSnackBar('Ups! Error al Eliminar en Favoritos', 'error');
        }

      }).catch((err) => {
        this.util.openSnackBar('Ups! algo ocurrio al eliminar', 'error');
      });
    }
  }
  logout() {

    localStorage.clear();
    sessionStorage.clear();

    // this._router.navigate(['/']);
    this._clienteService.logout();
    this.reloadPage();
  }

  openSearch() {
    var clase = $('#modalSearchMobil').attr('class');
    if (clase == 'ps-panel--sidebar') {
      $('#modalSearchMobil').addClass('active');
    } else if (clase == 'ps-panel--sidebar active') {
      $('#modalSearchMobil').removeClass('active');
    }
  }
  onKeyUpEvent(e: any) {
    ////console.log(e.target.value);
  }
  CloseSearch() {
    this.searchOpen = false;
  }
  searchText(e: any) {
   try {
    if (e == "") {
      this.searchOpen = false;
      this.isloading = true;
    } else {
      this.searchOpen = true;
      this.isloading = true;
      this.rest.getConsulta("eventos/listar_eventos_filtro_letras/" + e).then((response: any) => {
        //console.log(response.data);
        if (response.message == 'OK') {
          this.dataDesktop =  response.data;
          //console.log(this.EventosNoRepetidos);
          this.isloading = false;
        } if (response.message == 'NOK') {
          this.isloading = false;
         
        }
      })

    }
   } catch (error) {
    //console.log(error);
    this.util.openSnackBar('Ups! Error al buscar información', 'error');
   }


  }
  search(value: any) {
    this.isloading = true;
    if (value) {
      this.rest.getConsulta("eventos/listar_eventos_filtro_letras/" + value).then((response: any) => {
        //console.log(response);
        if (response.message == 'OK') {
          if (value == null || value == "") {
            this.data = [];
          } else {
            this.dataDesktop = response.data;
            //console.log(this.dataDesktop)
          }
        }
      }).catch((error: any) => {
        this.isloading = false;
        this.util.openSnackBar('Ups! algo ocurrio', 'error');
        window.location.reload();
        localStorage.clear();
        this._router.navigate(['/']);
      });

    } else {
      this.data = [];

    }



  }
  login() {
    try {
      this.loading = true;

      this._clienteService.login(
        {
          'email': this.Loginusuario.email,
          'password': this.Loginusuario.password
        }
      ).then(logged => {
        //console.log('--------------->',logged);
        this.storageService.saveUser(logged);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.Loginusuario.email = "";
        this.Loginusuario.password = "";
        this.user_data= this._clienteService.getCurrentUser();
        //console.log('--------------->',this.user_data);
        this.verFavoritosUsuario(logged,1);
      
      }).catch((error) => {
        //console.log(error)
        this.loading = false;
        this.util.openSnackBar('Ups! ' + error.error.message, 'error');
        this.isLoginFailed = false;
      });
    } catch (error) {
      this.loading = false;
      this.util.openSnackBar('Ups! Error en el servidor', 'error');
    }



  }
  reloadPage(): void {
    window.location.reload();
  }
  olividarContrasena() {
    this.PantallaLogin = false;
    this.PantallaRegistro = false;
    this.PantallaRecordarContrasena = true;
  }
  registroCliente() {
    this.PantallaLogin = false;
    this.PantallaRegistro = true;
    this.PantallaRecordarContrasena = false;
  }
  enviarLink() {
    this.loading = true;
    if (!this.validaciondeRecordarContrasena()) {
      this._clienteService.enviarCorreo(
        {
          'email': this.Loginusuario.email
        }
      ).then(logged => {
        this.loading = false;
        var datos = logged;

        this.util.openSnackBar("El Email para la recuperacion ha sido enviado", 'success');
        //this.utils.closeAllModals(this.elem)

      }).catch((error) => {
        this.loading = false;

        if (error['status'] === 400) {

        }
      });
    } else {
      this.loading = false;
      this.util.openSnackBar('Datos Fallido, favor de verificar', 'warning');
    }
  }

  validaciondeRecordarContrasena() {
    if (this.Loginusuario.email == '') {
      this.util.openSnackBar('ups... campo email vacio', 'warning');
      return true;
    }
    return false;
  }
  registrarCuenta() {
    //console.log('registrarCuenta');
    if (!this.validacionPerfil()) {
      //console.log('validacion');
      try {
        this.loadingRegistro = true;
        this._clienteService.registrar_cliente_guest(this.Nuevocliente)
          .then(response => {
            this.loadingRegistro = false;
            this.util.openSnackBar('!Hurra! ya tiene Cuenta  , gracias', 'success');
            this.PantallaRegistro = false;
            this.PantallaLogin = true;

            this.Nuevocliente.nombre = '',
              this.Nuevocliente.apellido = '',
              this.Nuevocliente.email = '',
              this.Nuevocliente.genero = '-1',
              this.Nuevocliente.f_nacimiento = '',
              this.Nuevocliente.terminoCondiciones = false,
              this.Nuevocliente.politicaPrivacidad = false,
              this.Nuevocliente.password = ''


          }).catch((error) => {
            this.loadingRegistro = false;
            if (error['status'] === 400) {
              this.util.openSnackBar("Hubo incoveniente al registrar", 'Vuelva intentar');
            } else {
              this.util.openSnackBar("NO tiene acceso", 'Vuelva intentar');
            }
          });
      } catch (error) {
        this.loading = false;
        this.util.openSnackBar("Ups.. error al registrar cuenta", 'Vuelva a intentar');
      }

    }
  }
  ingresarCuenta() {
    this.loading = false
    this.PantallaLogin = true;
    this.PantallaRegistro = false;
    this.PantallaRecordarContrasena = false;
  }
  validaciondeLogin() {
    this.mensajeEmail = '';
    this.mensajePassword = '';
    if (this.Loginusuario.email == '') {
      this.mensajeEmail = 'El campo email esta vacio';
      return true;
    }
    if (this.Loginusuario.password == '') {
      this.mensajePassword = 'El campo password esta vacio';
      return true;
    }

    return false;
  }
  validacionPerfil() {

    if (this.Nuevocliente.nombre == '') {
      this.ErrorNuevoCliente.v_nombre = true;
      return true;
    }
    if (this.Nuevocliente.apellido == '') {

      this.ErrorNuevoCliente.v_apellido = true;
      return true;
    }
    if (this.Nuevocliente.email == '') {

      this.ErrorNuevoCliente.v_email = true;
      return true;
    }
    if (this.Nuevocliente.password == '') {
      this.ErrorNuevoCliente.v_password = true;
      return true;
    }
    if (this.Nuevocliente.genero == '') {
      this.ErrorNuevoCliente.v_genero = true;

      return true;
    }
    if (this.Nuevocliente.f_nacimiento == '') {
      this.ErrorNuevoCliente.v_fechaNacimiento = true;
      return true;
    }
    if (this.Nuevocliente.politicaPrivacidad == false) {
      this.ErrorNuevoCliente.v_politicaPrivacidad = true;
      return true;
    }    
    if (this.Nuevocliente.terminoCondiciones == false) {
      this.ErrorNuevoCliente.v_terminoCondiciones = true;
      return true;
    }    
    return false;
  }
  consultar_favoritos_guest() {
    debugger;
    this.rest.get('usuario/consultarfavoritos/' + this.user_data.token).then((response: any) => {
      this.eventos = response.data;
    }).catch((error: any) => {
      if (error.status == 401) {
        this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
        this._clienteService.logout();
      } else {
        this.util.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
      }
    });
  }
  verFavoritosUsuario(arg0: any,tipo: any) {   
    debugger;
    this._clienteService.consultar_favoritos_guest(
      arg0.token
    ).then(logged => {  
      
      var datos = JSON.stringify(logged);
      var informacion = JSON.parse(datos)
      this.eventos = informacion.data;
      var favoritos: any = [];
      informacion.data.forEach(element => {
        var Modelfavoritos = {
          idEvento :element.ideventos,
          idfecha :element.fecha,
          idFavorito: element.idfavoritos
        }
        favoritos.push(Modelfavoritos);
      });
      this.storageService.saveFavoritos(favoritos);
      if(tipo==2){        
        this.contactChange.emit(true);
      } else {
        this.reloadPage();
      }

    }).catch((error) => {
      this.errorMessage = error.error.message;
      this.isLoginFailed = true;
    });
  }
  
}




