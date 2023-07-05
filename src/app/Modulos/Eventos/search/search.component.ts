import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../shared/utilitario/rest.service';
import { UtilsService } from '../../../shared/utilitario/util.service';
import { AuthService } from '../../../shared/Service/Usuario.service';
import {CookieService} from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { FechaEvento } from 'src/app/shared/model/FechaEvento.model';
import { StorageService } from 'src/app/shared/Service/storage.service';
import { favorito } from 'src/app/shared/model/Favoritos.model';
import { Meta } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public slug: any;
  public Distrito: any = [];
  public filter_distrito = '';
  public eventos: Array<any> = [];
  public eventos_clone: Array<any> = [];
  public filter_productos = '';
  public filter_busqueda='';
  public filter_modo_eventos = '0';
  public filter_modo_categoria = '0';
  public filter_modo_ubicacion = '0';
  public filter_modo_hora='-1';
  public filter_modo_fecha = this.pd.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),"yyyy-MM-dd");
  public load_data = true;
  public page = 0;
  public pageSize = 12;
  public user_data: any = null;
  public _fechaStrMinima = "";
  public FechaEvento :FechaEvento | undefined;
  public user_favoritos: any = null;
  public activoVerMasEventos=true;
  public load_data_add= false;
  public eventos_clone_scroll: Array<any>=[]
  constructor(private rest: RestService,private metaService:Meta, private storageService: StorageService,    private _router:Router, private cookieService: CookieService,    private util: UtilsService,private _clienteService: AuthService,    private _route: ActivatedRoute, private pd: DatePipe) {
   // this.listar_Eventos();
   console.log('segundo');
    this.leerDistrito();
    console.log(screen.width);
    console.log(screen.height);
    let params = new HttpParams();
    params = params.append('newOrdNum','123');
    this._fechaStrMinima = "" + this.pd.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
   // this.filter_modo_fecha = this.pd.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
   this.filter_modo_categoria = this._clienteService.cacheStore.byFiltro.categoria;
   console.log(this.filter_modo_categoria);
   console.log('parametro');
   console.log(this.filter_modo_categoria);
    if(this.filter_modo_categoria==""){
      this._route.params.subscribe(
        params => {
          this.slug = params['slug'];
          //console.log('------------------->',this.slug);
          switch (this.slug) {
            case 'musica':
              this.filter_modo_categoria = '1';
              break;
            case 'Cultura':
              this.filter_modo_categoria = '3';
              break;
            case 'Teatro':
              this.filter_modo_categoria = '4';
              break;
            case 'entretenimiento':
                this.filter_modo_categoria = '2';
                break;
            case 'Todos':
                this.filter_modo_categoria = '0';
                break;
            default:
              this.filter_modo_categoria = '0';
              break;
          }
          this.Filtro_eventos(0,0);
        }
      );
    } else {

       this.filter_modo_eventos= this._clienteService.cacheStore.byFiltro.evento;
       this.filter_modo_fecha= this._clienteService.cacheStore.byFiltro.FechaDesde;
       this.filter_modo_ubicacion= this._clienteService.cacheStore.byFiltro.ubicacion;
      this.filter_modo_hora= this._clienteService.cacheStore.byFiltro.HoraDesde;
       this.filter_busqueda= this._clienteService.cacheStore.byFiltro.busqueda=='0' ? '':this._clienteService.cacheStore.byFiltro.busqueda;
       this.pageSize= this._clienteService.cacheStore.byFiltro.pageSize;
      this.page= this._clienteService.cacheStore.byFiltro.page;
      this.Filtro_eventos(0,0);
    }

  }
  ngOnInit(): void {
    console.log('primero');
    let params = new HttpParams();
    params = params.append('newOrdNum','123');
    this.user_data= this._clienteService.getCurrentUser();
    this.user_favoritos= this.storageService.getFavorito();
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
    //console.log('-----------------------------------------------------------------------------');
    //console.log(this.filter_productos);
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
    ////console.log('ola');
    var element: any = document.getElementById("filtersOffcanvas");
    element.classList.remove("show");

  }
  buscar_mis_eventos(){

      this.Filtro_eventos(1,0)
  }
  Filtro_eventos(Tipo:number,Page:number,vieneFiltro:boolean=true,CargarLoad_Data:boolean=false) {


    this.load_data = (vieneFiltro?true:false);
    this.load_data_add =CargarLoad_Data;
    this.page = Page;
    var filter_productos = {
      evento: this.filter_modo_eventos,
      fecha: this.filter_modo_fecha,
      categoria: this.filter_modo_categoria,
      Ubicacion: this.filter_modo_ubicacion,
      horaInicioFin:this.filter_modo_hora,
      busqueda:this.filter_busqueda==""?"0":this.filter_busqueda,
      cantPage:this.pageSize,
      nroPagina:this.page
    }
    console.log(filter_productos);
    this._clienteService.listar_Eventos_publicos_filtros(filter_productos).then(
      (response: any) => {
        //console.log('listar_Eventos_publicos_filtros');

        if (response.message == 'OK') {
          if(response.data[0].length>0){
            this.eventos_clone=[];
            this.eventos=[];
            response.data[0].forEach(e => {
              var incluyeVeinte:favorito = new favorito();
              if (this.user_favoritos.length>0) {
                incluyeVeinte =  this.user_favoritos.find(t=>t.idEvento == e.ideventos && t.idfecha == e.idfecha);
                if ((incluyeVeinte!=undefined)) {
                  incluyeVeinte.incluye=(incluyeVeinte!=undefined) ? true: false;
                } else {
                  incluyeVeinte= new favorito();
                  incluyeVeinte.incluye=false;
                }
              } else {
                incluyeVeinte.incluye=false;
              }
              this.FechaEvento = new  FechaEvento(e.estado,incluyeVeinte,e.idUsuario,e.HoraFinal,e.HoraInicio,
                e.FechaInicio,e.Monto,e.NombreLocal,e.url, e.urlFuente,e.titulo,e.ideventos,e.idfecha
                );
                if(vieneFiltro){
                  this.eventos_clone.push(this.FechaEvento);
                  this.page = this.eventos_clone.length;
                } else {
                  if(this.eventos_clone_scroll.length>0){
                    this.eventos_clone= this.eventos_clone_scroll;
                    this.eventos_clone.push(this.FechaEvento);
                    this.page = this.eventos_clone.length;
                  }else {
                    this.eventos_clone.push(this.FechaEvento);
                    this.page = this.eventos_clone.length;
                  }
                }


            });
            if(CargarLoad_Data){
              this.load_data_add = false;
            }
            this.load_data = false;
            this.eventos = this.eventos_clone;
          }
          else {
            this.load_data = false;
            this.eventos = this.eventos_clone_scroll;
            this.activoVerMasEventos=false;
          }

        }
      },
      error => {
        this.util.openSnackBar('Ups! Error en el filtro', 'error');
      }
    );
  }
  onScroll(): void {



    console.log(this.page);
    this.eventos_clone_scroll= this.eventos_clone;
    this.Filtro_eventos(1,this.page,false,true);
  }
  eliminarDatos(){
    this.filter_busqueda = '';
    this.Filtro_eventos(0,0);
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
      ////console.log(cliente);
      this._clienteService.registrar_cliente_favorito(cliente, this.token).subscribe(
        Response => {
          if (Response.estado == 1) {

            this.listar_productos();
          } else {

            this.util.openSnackBar('Ups! Error al guardar en Favoritos', 'error');
          }

        },
        error => {
          ////console.log('error');
          ////console.log(error);
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
