import Swal from 'sweetalert2';
import  ubigeoPeru from "ubigeo-peru";
import { Injectable, EventEmitter, Output,Component, Input, OnInit, ElementRef, Renderer2, RendererFactory2  } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
//import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var $: any;

@Injectable({
  providedIn: 'root'
})


export class UtilsService {
  cookie_zip_code :any;
   _renderer2: Renderer2;
  @Output() getLocation: EventEmitter<any> = new EventEmitter();
  @Output() refreshShopping: EventEmitter<any> = new EventEmitter();
  @Output() removeItemShopping: EventEmitter<any> = new EventEmitter();
  @Output() refreshShoppingData: EventEmitter<any> = new EventEmitter();
  @Output() numberShopping: EventEmitter<any> = new EventEmitter();
  @Output() setNumberShopping: EventEmitter<any> = new EventEmitter();
  @Output() switchBar: EventEmitter<any> = new EventEmitter();
  @Output() updateProfile: EventEmitter<any> = new EventEmitter();
  @Output() modeVideo: EventEmitter<any> = new EventEmitter();
  @Output() previewP: EventEmitter<any> = new EventEmitter();
  @Output() modeFocusProduct: EventEmitter<any> = new EventEmitter();

  constructor(private cookieService: CookieService,
              //private modalService: BsModalService, public bsModalRef: BsModalRef,
              rendererFactory: RendererFactory2
  ) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }


 /* closeAllModals(element:any) {
    const elements = element.nativeElement.querySelectorAll('body');
    elements.removeClass('modal-open');
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
  }*/

  toParse = (a:any) => {
    if (a && JSON.parse(a)) {
      return JSON.parse(a);
    }
  };

  isEmpty(obj:any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  openChat = (str = null) => {

  };

  openModalSnack = (message: string,
                    action: string,
                    details: any = null,
                    duration: number = 5000) => {
    if (action === 'success') {
      Swal.fire({
        title: message,
        icon: 'success',
        timer: duration,
        showConfirmButton: false,
        toast: true,
        background: 'rgba(0, 0, 0, 0.96)',
      })


    } else if (action === 'error') {
      Swal.fire({
        icon: 'error',
        title: message,
        text: details,
        footer: '<a href>Why do I have this issue?</a>'
      });
    }

  };

  openConfirm = (titulo = null) => new Promise((resolve, reject) => {
    Swal.fire({
      title:titulo+'',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Eliminado!',
          '',
          'success'
        );
        resolve(true);
      } else {
        reject(false);
      }
    }).catch(e => reject(false));
  });

  openSnackBar(message: string, action: string, duration: number = 5000) {

    if (action === 'success') {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: duration,
        toast: true,
        background: 'rgba(255,255,255, 0.8)',
      });
    } else if (action === 'error') {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: duration,
        toast: true,
        background: 'rgba(255,255,255, 0.8)',
      });
    }else if (action === 'warning') {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: duration,
        toast: true,
        background: 'rgba(255,255,255, 0.8)',
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: duration,
        toast: true,
        background: 'rgba(255,255,255, 0.8)',
      });
    }

  }
  getZipCookie = () => {
    this.cookie_zip_code = this.cookieService.get('_location_zip_code');
    const _cookie_data = (this.cookie_zip_code && JSON.parse(this.cookie_zip_code)) ?
      JSON.parse(this.cookie_zip_code) : null;
    return _cookie_data;
  };

  showTool = () => $('html body .overlay-tooltip').show();

  hiddenTool = () => $('html body .overlay-tooltip').hide();

  closeAllTooltip = () => $('html body .button-hide-tooltip').click();

  clickElement = (e:any) => $(`html body ${e}`).click();

  slug = (a:any) => {
    let str = a;
    str = str.replace(/\s+/g, '-').toLowerCase();
    return str;
  };

  emitShopping = () => {
    return {
      a: 1
    };
  };

  getZipCode = (data:any) => new Promise((resolve, reject) => {
    if (data && (typeof data) === 'object') {
      const res = data.find((b: { types: string[]; }) => b.types[0] === 'postal_code');
      if (res) {
        resolve(res['short_name']);
      } else {
        reject(new Error('Not valid address object'));
      }
    } else {
      reject(new Error('Not valid address object'));
    }
  });

  getCountry = (data:any) => new Promise((resolve, reject) => {
    if (data && (typeof data) === 'object') {
      const res = data.find((b: { types: string[]; }) => b.types[0] === 'country');
      if (res) {
        resolve(res['short_name']);
      } else {
        reject(new Error('Not valid address object'));
      }
    } else {
      reject(new Error('Not valid address object'));
    }
  });

  getLocality = (data:any) => new Promise((resolve, reject) => {
    if (data && (typeof data) === 'object') {
      const res = data.find((b: { types: string[]; }) => b.types[0] === 'locality');
      if (res) {
        resolve(res['short_name']);
      } else {
        reject(new Error('Not valid address object'));
      }
    } else {
      reject(new Error('Not valid address object'));
    }
  });

  sendEvent = (event:any, label:any) => {
    (<any>window).ga('send', 'event', {
      eventCategory: event,
      eventLabel: label,
      eventAction: 'click'
    });
  };

  GetDepartament(){
    ////console.log('GetDepartament---------------------------------------------->');
    var datos =  ubigeoPeru.reniec;
    datos = datos.filter((elemento: { provincia: string; distrito: string; })=>elemento.provincia =="00" && elemento.distrito =="00");
    ////console.log(datos);
  }
  GetProvincia(Deparatmento: any){
    ////console.log('GetProvincia---------------------------------------------->');
    var datos =  ubigeoPeru.reniec;
    datos = datos.filter((elemento: { departamento: any; distrito: string; })=>elemento.departamento ==Deparatmento && elemento.distrito =="00").sort();
    ////console.log(datos);
  }
  GetDistrito(Departamento: any,Provincia: any){
    ////console.log('GetDistrito---------------------------------------------->');
    var datos =  ubigeoPeru.reniec;
    datos = datos.filter((elemento: { departamento: any; provincia: any; })=>elemento.departamento ==Departamento && elemento.provincia ==Provincia).sort();
    //console.log(datos);
    return datos;
  }
}
