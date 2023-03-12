import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
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
  public loadingRecordar =  false;
  public loading = false;
  public PasswordCorrecto = false;
  public emailIncorrecto = false;
  public PantallaLogin = true;
  public PantallaRegistro = false;
  public PantallaRecordarContrasena = false;
  public loadingRegistro = false;
  public mensajeEmail = '';
  public mensajePassword = '';
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

    this.cliente = undefined;
    this._fechaSrtMaxima = moment(new Date()).format('YYYY-MM-DD');// new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    console.log('----------------------------------------------------------------->');
    console.log(this._fechaSrtMaxima);
    if (_parseCurrent) {
      this.cliente = _parseCurrent.nombre;
      this.idUsuario = _parseCurrent.sub
      this.imgUrl = "../../../assets/img/no-profile-picture-icon.png"
    } else {
      this.cliente = undefined;
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      console.log('logeado')
      this.verFavoritosUsuario(this.storageService.getUser());
    }
  }
  consultar_favoritos_guest() {
    this.rest.get('/listar_favoritos/' + this.user_data.sub).then((response: any) => {
      this.eventos = response.data;
    }).catch((error: any) => {

      if (error.status == 401) {
        this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
        this._clienteService.logout();
      } else {
        this.util.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
      }
      /* window.location.reload();
       localStorage.clear();
       this._router.navigate(['/']);*/
      //this._clienteService.logout();
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
  EliminarFavoritos(idFavorito: any) {

    var idFavorito = idFavorito;
    if (!this.user_data) {
      this.util.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('/eliminar_favoritos/' + idFavorito).then((response: any) => {
        if (response.estado == 1) {
          this.eventos = response.data;
          this.consultar_favoritos_guest();
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
    //console.log(e.target.value);
  }
  CloseSearch() {
    this.searchOpen = false;
  }
  searchText(e: any) {

    if (e == "") {
      this.searchOpen = false;
      this.isloading = true;
    } else {
      this.searchOpen = true;
      this.isloading = true;
      this.rest.getConsulta("/listar_eventos_filtro_letras/" + e).then((response: any) => {
        if (response.message == 'OK') {

          this.dataDesktop = response.data.sort(function (o1: any, o2: any) {
            var c = new Date(o1.FechaInicio);
            var d = new Date(o2.FechaInicio);
            return c > d ? 1 : -1;
          });

          this.isloading = false;
        } if (response.message == 'NOK') {
          this.isloading = false;
        }
        else {
          this.util.openSnackBar('Ups! Error al buscar información', 'error');
        }
      })

    }


  }
  search(value: any) {
    this.isloading = true;
    if (value) {
      this.rest.getConsulta(`/consultar_total_eventos`).then((response: any) => {
        if (response.message == 'OK') {
          if (value == null || value == "") {
            this.data = [];
          } else {
            this.data = response.data;
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
        this.storageService.saveUser(logged);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.Loginusuario.email="";
        this.Loginusuario.password="";
        this.reloadPage();
      }).catch((error) => {
        console.log(error)
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
  enviarLink(){
    this.loading = true;
    if(!this.validaciondeRecordarContrasena()){
      this._clienteService.enviarCorreo(
        {
          'email': this.Loginusuario.email
        }
      ).then(logged => {
        this.loading = false;
        var datos =  logged;

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

  validaciondeRecordarContrasena(){
    if(this.Loginusuario.email==''){
      this.util.openSnackBar('ups... campo email vacio', 'warning');
      return true;
    }
    return false;
  }
  registrarCuenta() {
    console.log('registrarCuenta');
    if (!this.validacionPerfil()) {
      console.log('validacion');
      try {
        this.loadingRegistro = true;
        console.log(this.cliente);
        this._clienteService.registrar_cliente_guest(this.Nuevocliente)
          .then(response => {
            console.log(response);
            this.loadingRegistro = false;
            this.util.openSnackBar('Upaa! ya tiene Cuenta  , gracias' , 'success');
            this.PantallaRegistro =  false;
            this.PantallaLogin =  true;
          
              this.Nuevocliente.nombre = '',
              this.Nuevocliente.apellido= '',
              this.Nuevocliente.email= '',
              this.Nuevocliente.genero= '-1',
              this.Nuevocliente.f_nacimiento= '',
              this.Nuevocliente.terminoCondiciones= false,
              this.Nuevocliente.politicaPrivacidad= false,
              this.Nuevocliente.password= ''
           

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
    console.log(this.Loginusuario);
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
    return false;
  }
  verFavoritosUsuario(arg0: any) {


    this._clienteService.consultar_favoritos_guest(
      arg0.sub
    ).then(logged => {
      var datos = JSON.stringify(logged);
      var informacion = JSON.parse(datos)
      var favoritos: any = [];
      informacion.data.forEach(element => {
        favoritos.push(element.evento._id);
      });
      this.storageService.saveFavoritos(favoritos);
    }).catch((error) => {
      this.errorMessage = error.error.message;
      this.isLoginFailed = true;
    });
  }
}




