
import { EventEmitter, Injectable, Output, Inject, Component, Input, OnInit, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatestAll, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from '../../shared/utilitario/util.service';
import { RestService } from '../../shared/utilitario/rest.service';

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

  private datos = {
    categoria_musica: 0,
    categoria_entretenimiento: 0,
    categoria_Cultura: 0,
    categoria_Teatro: 0,

  }
  constructor(private rest: RestService, private cookieService: CookieService, rendererFactory: RendererFactory2, private utils: UtilsService) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }


  public consultar_evento_seleccionado (idEvento,idfecha):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      this.rest.getConsulta('/consultar_evento_seleccionado/'+idfecha+'/'+idEvento).then(((response: any) => {
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

  public registrar_cliente_favorito(Cliente: any):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {
      console.log(Cliente)
      console.log('registrar_cliente_favorito')
      this.rest.post('/registro_favoritos',Cliente).then(((response: any) => {
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      }); 
    }).bind(this));
  }

  public generar_url_copia(idfecha, idevento):Promise<boolean>{
    return new Promise<boolean>(((resolve, reject) => {

      console.log('generar_url_copia')
      this.rest.get('/generarEnlacesCortos/'+idfecha+"/"+idevento).then(((response: any) => {
        console.log('resultado');
        console.log(response)
        resolve(response);
      }).bind(this)).catch((error) => {
        reject(error.message);
      });
    }).bind(this));
  }
}
