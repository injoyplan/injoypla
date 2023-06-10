import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../shared/utilitario/rest.service';
import { UtilsService } from '../../../shared/utilitario/util.service';
import { AuthService } from '../../../shared/Service/Usuario.service';
import { EventoService } from '../../../shared/Service/Eventos.service';
import {CookieService} from 'ngx-cookie-service';
import { StorageService } from 'src/app/shared/Service/storage.service';

declare var iziToast: any;
declare var jQuery: any;


declare var $: any;
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent {
  public idevento: any;
  public idfechaEvento: any;
  public slug: any;
  public evento: any = {};
  public fecha: any = [];
  public Distrito: any =[];
  public LugarEvento: any;
  public nombreDistrit: any = "";
  public ListFecha: any =[];
  public lista_plataformas: any = [];
  public ModelfechaEvento: any=[];
  public lat: any = "";
  public lng: any = "";
  public isMobileLayout = false;
  public isMobilModal=false;
  public user_data: any = null;
  public user_favoritos: any = null;
  public esFavorito =  false;
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  constructor(private rest: RestService,    private _router:Router, private cookieService: CookieService, private storageService: StorageService,    private util: UtilsService,private _EventoService: EventoService,private _clienteService: AuthService,    private _route: ActivatedRoute) {
    ////console.log('1');
    this.leerDistrito();
    this.user_favoritos= this.storageService.getFavorito();
    this._route.params.subscribe(
      params => {
        this.idevento = params['evento'];
        this.idfechaEvento = params['fecha'];
      }
    );
  }
  leerDistrito(){
    var datos =   this.util.GetDistrito(14,"01");
    datos.forEach(element => {
      if (element.distrito!="00") {

       var DatosDistritos = {
          codigo:element.distrito,
          nombre:element.nombre
        }
        this.Distrito.push(DatosDistritos);
      }
    });
  }
  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    this.search_Evento();
  }
  search_Evento(){
    this._EventoService.consultar_evento_seleccionado(this.idevento, this.idfechaEvento).then(
      (response: any) => {
        this.evento =  response.data[0];
        this.fecha =  response.dataFecha;
        this.lista_plataformas =  response.dataPlataformaVenta;

        this.nombreDistrit = this.Distrito.filter(item => item.codigo == this.evento.Distrito)[0].nombre;
        var datos = { lat: parseFloat(this.evento.latitud_longitud.split(',')[0]), lng: parseFloat(this.evento.latitud_longitud.split(',')[1]) }
        this.LugarEvento = "" + this.evento.direccion + " " + this.evento.Numero + ", " + this.nombreDistrit + " ,Lima, Perú"
        if (this.evento.latitud_longitud != null) this.markerPositions.push(datos);
        this.center = {
          lat: parseFloat(this.evento.latitud_longitud.split(',')[0]),
          lng: parseFloat(this.evento.latitud_longitud.split(',')[1]),
        }
        this.validarSiEsFavorito(this.evento.evento_id);
        /*this.fecha =  response.data._evento[0];
        this.evento =  response.data._evento[0].evento;
        this.ModelfechaEvento =  response.data._fecha;
        this.lista_plataformas =  response.data._entradas;

      */
      },
      error => {
        if (error.status==403) {
          this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
          this._clienteService.logout();
         } else {
          this.util.openSnackBar('Ups!Error de consultar eventos', 'error');
         }

      }
    );
  }
  validarSiEsFavorito(idevento: any) {
    if (this.user_favoritos.length>0){
      var  incluyeVeinte = this.user_favoritos.includes(idevento);
      this.esFavorito =incluyeVeinte;
    } else  {
      this.esFavorito =false;
    }

  }
  buscarfecha(eventoFecha:any){

    var resultadoFiltro =  this.fecha.filter(item => item.fecha_id == eventoFecha.fecha_id)[0];

    this.evento.FechaInicio =resultadoFiltro.FechaInicio;
    this.evento.HoraFinal =resultadoFiltro.HoraFinal;
    this.evento.HoraInicio =resultadoFiltro.HoraInicio;
  }

  listar_fechas_del_evento_seleccionado(){
    this._EventoService.listar_fechas_disponibles_del_evento_seleccionado(this.idevento).then(
      (response: any) => {
        if (response.message == 'OK') {
          ////console.log('Listar Fechas');
          this.ListFecha = response.data.sort(function(o1:any,o2:any){
            var c = new Date(o1.FechaInicio);
            var d = new Date(o2.FechaInicio);
            return c > d ? 1 : -1;
          });
          ////console.log('resultado');
          ////console.log(this.ListFecha);
        }
      },
      error => {
        ////console.log(error);
        this.util.openSnackBar('Ups! No se ha encontrado Plataforma para este evento', 'error');
      });
  }
  listarPlataformas() {
    this._EventoService.consultar_plataforma_seleccionado(this.idevento).then(
      (response: any) => {
        ////console.log('listarPlataformas');
        ////console.log(response);
        response.data.forEach((e:any) => {
          ////console.log(e);
          var datos = {
            'NombrePlataforma':  e.plataforma.nombrePlataforma,
            'urlWebLugar': e.urlWebLugar,
            'PlataformaVenta': e.plataforma.iconos
          }
          this.lista_plataformas.push(datos);
        });
       /*
        var datos = {
          'NombrePlataforma':  e.NombrePlataforma,
          'urlWebLugar':e.urlWebLugar,
          'PlataformaVenta':response.data[0].iconos
        }

        this.lista_plataformas =   this.lista_plataformas.push(datos);;*/
          return this.lista_plataformas;
      },
      error => {
        ////console.log(error);
        this.util.openSnackBar('Ups! No se ha encontrado Plataforma para este evento', 'error');
      });

   /* this.evento.Entradas.forEach((e:any) => {
      ////console.log(e);
      ////console.log('-------------------------TTTTTTTTTTT--------------------------------------');


    });*/
  }
  search_Fecha_evento(){
    ////console.log(this.idfechaEvento);
    this._EventoService.consultar_fecha_evento_seleccionado(this.idfechaEvento).then(
      (response: any) => {


        this.ModelfechaEvento = response.data.sort(function(o1:any,o2:any){
          var c = new Date(o1.FechaInicio);
          var d = new Date(o2.FechaInicio);

          return c > d ? 1 : -1;
        });
        this.listarPlataformas();
      },
      error => {
        ////console.log(error);
        this.util.openSnackBar('Ups! No se ha encontrado Plataforma para este evento', 'error');
      })
  }
  guardarFavoritos(idFecha,idEvento){
    if (!this.user_data) {
      this.util.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');

    } else {

      var cliente = {
        evento: idEvento,
        fecha: idFecha,
        usuario: this.user_data.sub
      }

      this._EventoService.registrar_cliente_favorito(cliente).then(
        (response: any) => {
          ////console.log(response);
          this.util.openSnackBar('¡Hurra, este evento se agregó a tus favoritos!' , 'success');
          this.search_Evento();
        },
        error => {
          ////console.log(error);
          if (error.status==403) {
            this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
            this._clienteService.logout();
           } else {
            this.util.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
           }

        })

    }

  }
  copiarAlPortapapeles(idevento,idfecha){

    this._EventoService.generar_url_copia(idevento,idfecha).then(
      (response: any) => {
        //console.log(response);
        if (response.succes) {
          const el = document.createElement("textarea");
          // PASO 2
          el.value = response.short_url;
          el.setAttribute("readonly", "");
          // PASO 3
          el.style.position = "absolute";
          el.style.left = "-9999px";
          document.body.appendChild(el);
          // PASO 4
          el.select();
          // PASO 5
          document.execCommand("copy");
          // PASO 6
          document.body.removeChild(el);
          this.util.openSnackBar('Upaa! se copio en portapapeles' , 'success');
        } else {
          this.util.openSnackBar(response.message , 'Error');
        }

      },
      error => {
        ////console.log(error);
        if (error.status==403) {
          this.util.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
          this._clienteService.logout();
         } else {
          this.util.openSnackBar('Ups! no se ha copiado', 'error');
         }

      })



  }
  EliminarFavoritos(id_evento:any,id_fecha:any){
    ////console.log('idFavorito');
    ////console.log(Idfavorito);
    var id_evento= id_evento;
    var id_fecha= id_fecha;
    if (!this.user_data) {
      this.util.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('usuario/eliminar_favoritos/'+id_evento+"/"+id_fecha).then((response: any) => {
        if (response.estado == 1) {
          this.search_Evento();
          this.util.openSnackBar('ohhh!  Evento eliminado de tus favoritos, gracias' , 'success');
        } else {
          this.util.openSnackBar('Ups! Error al Eliminar en Favoritos', 'error');
        }

      }).catch((err) => {
        if (err.status==403) {
          this._clienteService.logout();
          this.util.openSnackBar('Ups! Su usuario se acabo', 'error');
         } else {
          this.util.openSnackBar('Ups! algo ocurrio al eliminar', 'error');
         }

      });
    }
  }
}
