import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../shared/utilitario/rest.service';
import { UtilsService } from '../../../shared/utilitario/util.service';
import { AuthService } from '../../../shared/Service/Usuario.service';
import { EventoService } from '../../../shared/Service/Eventos.service';
import {CookieService} from 'ngx-cookie-service';
@Component({
  selector: 'app-show-favorito',
  templateUrl: './show-favorito.component.html',
  styleUrls: ['./show-favorito.component.css']
})
export class ShowFavoritoComponent {

  public idevento: any;
  public idfechaEvento: any;
  public evento: any = {};
  public fecha: any = {};
  public Entradas: any = {};
  public LugarEvento: any;
  public nombreDistrito: any = "";
  public Distrito: any =[];
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  constructor(private rest: RestService,    private _router:Router, private cookieService: CookieService,    private util: UtilsService,private _EventoService: EventoService,private _clienteService: AuthService,    private _route: ActivatedRoute) {
    this._route.params.subscribe(
      params => {
        this.idevento = params['idEvento'];
      }
    );
    this.leerDistrito();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('---------------------- ------------------------------------------------------------',this.idevento);
    console.log('----------------------------------------------------------------------------------');
    this.search_Evento();
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
  search_Evento(){
    
    this._EventoService.consultar_evento_favoritos(this.idevento).then(
      (response: any) => {
        console.log('search_Evento');
        console.log(response);
       
        this.evento =  response.data._evento[0];
        this.fecha =  response.data._Fechas;
        this.Entradas =  response.data._Entradas;
        this.nombreDistrito = this.Distrito.filter(item => item.codigo == this.evento.Distrito)[0].nombre;
        this.LugarEvento = "" + this.evento.direccion + " " + this.evento.Numero + ", " + this.nombreDistrito + " ,Lima, Perú"
        console.log(this.LugarEvento);
        var datos = { lat: parseFloat(this.evento.latitud_longitud.split(',')[0]), lng: parseFloat(this.evento.latitud_longitud.split(',')[1]) }
        if (this.evento.latitud_longitud != null) this.markerPositions.push(datos);
        this.center = {
          lat: parseFloat(this.evento.latitud_longitud.split(',')[0]),
          lng: parseFloat(this.evento.latitud_longitud.split(',')[1]),
        }
        //this.search_Fecha_evento();
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

  
}
