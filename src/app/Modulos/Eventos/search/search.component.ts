import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../shared/utilitario/rest.service';
import { UtilsService } from '../../../shared/utilitario/util.service';
import { AuthService } from '../../../shared/Service/Usuario.service';
import {CookieService} from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { FechaEvento } from 'src/app/shared/model/FechaEvento.model';
import { StorageService } from 'src/app/shared/Service/storage.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  public slug: any;
  public Distrito: any = [];
  public filter_distrito = '';
  public eventos: Array<any> = [];
  public eventos_clone: Array<any> = [];
  public filter_productos = '';
  public filter_modo_eventos = '0';
  public filter_modo_categoria = '0';
  public filter_modo_ubicacion = '0';
  public filter_modo_hora='-1';
  public filter_modo_fecha = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public load_data = true;
  public page = 1;
  public pageSize = 12;
  public user_data: any = null;
  public _fechaStrMinima = "";
  public FechaEvento :FechaEvento | undefined;
  public user_favoritos: any = null;
  constructor(private rest: RestService, private storageService: StorageService,    private _router:Router, private cookieService: CookieService,    private util: UtilsService,private _clienteService: AuthService,    private _route: ActivatedRoute, private pd: DatePipe) {
   // this.listar_Eventos();
    this.leerDistrito();
    
    this._fechaStrMinima = "" + this.pd.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
   // this.filter_modo_fecha = this.pd.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];
        switch (this.slug) {
          case 'musica':
            this.filter_modo_categoria = '630832a4c6ae463861cdd0a0';
            break;
          case 'Cultura':
            this.filter_modo_categoria = '63083349c6ae463861cdd0a2';
            break;
          case 'Teatro':
            this.filter_modo_categoria = '63083352c6ae463861cdd0a3';
            break;
          case 'Entretenimiento':
              this.filter_modo_categoria = '630832bac6ae463861cdd0a1';
              break;            
          default:
            this.filter_modo_categoria = '0';
            break;
        }
        this.Filtro_eventos(0);
      }
    );
  }
  leerDistrito(){
    var datos =   this.util.GetDistrito(14,"01").sort();

    datos.sort().forEach(element => {
      if (element.distrito!="00") {
        var DatosDistrito = {
          codigo:element.distrito,
          nombre:element.nombre
        }
        this.Distrito.push(DatosDistrito);
      }

    });

      this.Distrito.sort(function (a, b) {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
  }


  listar_Eventos(){
    console.log('-----------------------------------------------------------------------------');
    console.log(this.filter_productos);
    this._clienteService.listar_Eventos_Publicos(this.filter_productos).then(
      (response: any) => {

        if (response.message == 'OK') {
          this.eventos = response.data;
          this.load_data = false;

        }

      },
      error => {

        this.util.openSnackBar('Ups! Error en el filtro', 'error');
      }
    );
  }

  abrirModal() {

    var element: any = document.getElementById("filtersOffcanvas");
    element.classList.add("show");

  }
  CerrarModal() {
    //console.log('ola');
    var element: any = document.getElementById("filtersOffcanvas");
    element.classList.remove("show");

  }
  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    this.user_favoritos= this.storageService.getFavorito();

  }
  Filtro_eventos(Tipo:number) {
    console.log('-------------------------------Filtro_eventos----------------------------------------------');
    console.log(Tipo);
    this.eventos_clone=[];
    this.eventos=[];
    this.load_data = true;
    var filter_productos = {
      evento: this.filter_modo_eventos,
      fecha: this.filter_modo_fecha,
      categoria: this.filter_modo_categoria,
      Ubicacion: this.filter_modo_ubicacion,
      horaInicioFin:this.filter_modo_hora
    }
    console.log(filter_productos);
    this._clienteService.listar_Eventos_publicos_filtros(filter_productos).then(
      (response: any) => {

        if (response.message == 'OK') {
          let incluyeVeinte =false;

          response.data=response.data.filter(item => item.evento  != null);
          response.data= response.data.sort(function(o1,o2){
            var c = new Date(o1.FechaInicio);
            var d = new Date(o2.FechaInicio);

            return c > d ? 1 : -1;
          });      
          console.log('antes de foreach',response.data)   ; 
          
          response.data.forEach(e => {
            if (this.user_favoritos.length>0) {
              console.log('favoritos',this.user_favoritos)   ;
              console.log('foreach',e.eventos_docs[0]._id)   ; 
              incluyeVeinte = this.user_favoritos.includes(e.evento);
              console.log(incluyeVeinte)
            }
            this.FechaEvento = new  FechaEvento(e.estado,incluyeVeinte,e.idUsuario,e.HoraFin,e.HoraInicio,e.FechaInicio,e.precioxfechas_docs, e.eventos_docs,e._id);
            this.eventos_clone.push(this.FechaEvento);
          });
          console.log('Dspues de foreach',this.eventos_clone)   ; 
          this.load_data = false;
          this.eventos = this.eventos_clone;
         /* this.eventos = response.data;
          console.log(this.eventos)
          this.eventos  = this.eventos.filter(item => item.evento  != null);
          this.eventos = this.eventos.sort(function(o1,o2){
            var c = new Date(o1.FechaInicio);
            var d = new Date(o2.FechaInicio);

            return c > d ? 1 : -1;
          });
          this.load_data = false;*/
         /* if (this.filter_modo_categoria != '0') {
            if (this.filter_modo_eventos != '0') {
              if (this.filter_modo_ubicacion != '0') {
                if (this.filter_modo_fecha) {

                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    return (date >= date2);
                  }).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                  this.eventos = this.eventos.filter(item => item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
                } else {
                  this.eventos = this.eventos.filter(item => item.evento.Categoria.toString() === this.filter_modo_categoria.toString()
                    && item.evento.EsGratis == this.filter_modo_eventos
                    && item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                      var c = new Date(o1.FechaInicio);
                      var d = new Date(o2.FechaInicio);

                      return c > d ? 1 : -1;
                    });
                }
              } else {
                this.eventos = this.eventos.filter(item => item.evento.Categoria.toString() === this.filter_modo_categoria.toString()
                  && item.evento.EsGratis == this.filter_modo_eventos).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
              }
            } else {
              this.load_data = false;
              if (this.filter_modo_ubicacion != '0') {
                if (this.filter_modo_fecha) {

                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    return (date >= date2);
                  }).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                  this.eventos = this.eventos.filter(item => item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                } else {
                  this.eventos = this.eventos.filter(item => item.evento.Categoria.toString() === this.filter_modo_categoria.toString()
                    && item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                      var c = new Date(o1.FechaInicio);
                      var d = new Date(o2.FechaInicio);

                      return c > d ? 1 : -1;
                    });;
                }
              } else {
                if (this.filter_modo_fecha) {
                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    console.log('date2');
                    console.log(date);
                    console.log(date2);
                    console.log(item.evento.Categoria.toString());
                    return (date >= date2);
                  }).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
                  this.eventos = this.eventos.filter(item => item.evento.Categoria.toString() === this.filter_modo_categoria.toString()).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
                } else {
                  this.eventos = this.eventos.filter(item => item.evento.Categoria.toString() === this.filter_modo_categoria.toString()).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
                }

              }

            }
          } else {

            if (this.filter_modo_eventos != '0') {
              //Eligio un modo
              if (this.filter_modo_ubicacion != '0') {
                if (this.filter_modo_fecha) {
                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    return (date >= date2);
                  }).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                  this.eventos = this.eventos.filter(item => item.evento.Distrito == this.filter_modo_ubicacion && item.evento.EsGratis == this.filter_modo_eventos).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                } else {
                  this.eventos = this.eventos.filter(item => item.evento.EsGratis == this.filter_modo_eventos
                    && item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                      var c = new Date(o1.FechaInicio);
                      var d = new Date(o2.FechaInicio);

                      return c > d ? 1 : -1;
                    });;
                }
              } else {
                this.eventos = this.eventos.filter(item => item.evento.EsGratis == this.filter_modo_eventos).sort(function(o1,o2){
                  var c = new Date(o1.FechaInicio);
                  var d = new Date(o2.FechaInicio);

                  return c > d ? 1 : -1;
                });;
              }

            } else {
              //si son todos

              if (this.filter_modo_ubicacion != '0') {
                if (this.filter_modo_fecha) {


                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    return (date >= date2);
                  });
                  this.eventos = this.eventos.filter(item => item.evento.Distrito == this.filter_modo_ubicacion).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });;
                } else {
                  this.eventos = this.eventos.filter(item => item.evento.EsGratis == this.filter_modo_eventos && item.evento.Distrito == this.filter_modo_ubicacion)

                }
              } else {
                if (this.filter_modo_fecha) {
                  this.eventos = this.eventos.filter(item => {
                    var date = new Date(item.FechaInicio);
                    var date2 = new Date(this.filter_modo_fecha);
                    return (date >= date2);
                  }).sort(function(o1,o2){
                    var c = new Date(o1.FechaInicio);
                    var d = new Date(o2.FechaInicio);

                    return c > d ? 1 : -1;
                  });
                } else {

                }

              }
            }
          }*/
        }
      },
      error => {

        this.util.openSnackBar('Ups! Error en el filtro', 'error');
      }
    );
  }
  guardarFavoritos(e: any, idfecha: any){

    var idEvento = e;
    if (!this.user_data) {
      this.util.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');

    } else {
      /*var cliente = {
        evento: idEvento,
        fecha: idfecha,
        usuario: this.user_data.sub
      }
      //console.log(cliente);
      this._clienteService.registrar_cliente_favorito(cliente, this.token).subscribe(
        Response => {
          if (Response.estado == 1) {

            this.listar_productos();
          } else {

            this.util.openSnackBar('Ups! Error al guardar en Favoritos', 'error');
          }

        },
        error => {
          //console.log('error');
          //console.log(error);
          this.util.openSnackBar('Ups! No se ha encontrado Plataforma para este evento', 'error');

        }

      );*/
    }
  }
  EliminarFavoritos(idFavorito: any){

  }
  filtro_departamento(){
   // this.Filtro_eventos();

    this.eventos = this.eventos.filter(item =>item.evento.Distrito == this.filter_modo_ubicacion);

    return this.eventos;
  }

}
