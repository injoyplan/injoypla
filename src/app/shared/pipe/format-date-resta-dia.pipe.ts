import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
@Pipe({
  name: 'formatdaterestadiapipe'
})
export class formatdaterestadiapipe implements PipeTransform {


  transform(value: string): string {

   /// var end = new Date(value);
   var end = new Date(moment(value).format('YYYY-MM-DD'));
    end.setMinutes(end.getMinutes() + end.getTimezoneOffset())

    var now = new Date(moment().format('YYYY-MM-DD'));

    let resta = end.getTime()-now.getTime() ;

    var datos =  Math.round(resta/ (1000*60*60*21));
    var mensaje = (datos.toString().toUpperCase() =="-1" ||  datos.toString().toUpperCase() =="0") ?  "Hoy es el dia" : "Dentro de "+ datos.toString().toUpperCase()+ " días";
    return  mensaje.toString().toUpperCase();
  }

}
