
import { EventEmitter, Injectable, Output, Inject, Component, Input, OnInit, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatestAll, interval, map, Observable, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from '../../shared/utilitario/util.service';
import { RestService } from '../../shared/utilitario/rest.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EventoService{


  public  waiting = false;

  _renderer2: Renderer2
  private lista_eventos_Destacados: Array<any> = [];
  private lista_eventos: Array<any> = [];
  public isloading = true;
  public  DatosPantalla = {}
  private initTime:any;
  private datos = {
    categoria_musica: 0,
    categoria_entretenimiento: 0,
    categoria_Cultura: 0,
    categoria_Teatro: 0,

  }
  constructor(private rest: RestService, private cookieService: CookieService, rendererFactory: RendererFactory2, private utils: UtilsService) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }

  public activarDesactivarEventos(favoritos: { evento: number; estado: number; }) {
    return new Promise<boolean>(((resolve, reject) => {
      console.log('activarDesactivarEventos');
      this.rest.put('eventos/DesactivarActivarMisEvento',favoritos).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }

  public startCountdown(seconds){
    this.initTime = moment(Date.now() + (seconds+1)*1000);
    return interval(1000).pipe(
      take(seconds),
      map(()=>{
        let diff = this.initTime.diff(moment());
        let countdown = moment.utc(diff).format('mm:ss');
       // //console.log("current countdown: ", countdown);
        return countdown;
      })
    );
  }
  public consultar_evento_seleccionado (idEvento,idfecha):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('eventos/consultar_evento_seleccionado/'+idfecha+'/'+idEvento).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }
  public consultar_evento_favoritos (idEvento):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/consultar_evento_favoritos/'+idEvento).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }

  consultar_evento_fecha_favoritos(idevento: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/consultar_evento_fecha_favoritos/'+idevento).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }

  public consultar_plataforma_seleccionado(idevento):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/consultarPlataformaventa/'+idevento).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }
  public listar_fechas_disponibles_del_evento_seleccionado(idevento):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/listar_fechas_disponibles_del_evento_seleccionado/'+idevento).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }
  public consultar_fecha_evento_seleccionado(idFecha: any):Promise<boolean>{

    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/consultar_fecha_evento_seleccionado/'+idFecha).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }

  public registrar_cliente_favorito(favoritos: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      //console.log('registrar_cliente_favorito',favoritos)

      this.rest.post('usuario/createFavoritos',favoritos).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }

  public generar_url_copia(idevento , idfecha):Promise<boolean>{
    console.log(idevento)
    console.log(idfecha)
    return new Promise<boolean>(((resolve, reject) => {
      var dataString = {
        "url":"http://www.injoyplan.com/show/"+idfecha+"/"+idevento,
        "is_public": true,
        "group_id":1
      };

      console.log(dataString)
      this.rest.post_CopyURL('',dataString).then(((response: any) => {
        //console.log('resultado');
        //console.log(response)
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);1
      });
    }).bind(this));
  }
}
