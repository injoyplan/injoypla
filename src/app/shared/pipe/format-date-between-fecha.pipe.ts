import { Pipe, PipeTransform } from '@angular/core';
var moment = require('moment');
@Pipe({
  name: 'formatdatebetweenfecha'
})
export class  FormatDateBetweenFechaPipe implements PipeTransform {

  transform(value: string,value2: string): boolean {
    var options = { day: "numeric" };

    var now = new Date(moment().format('YYYY-MM-DD'));
    var HoraInicio = new Date(value);
    var HoraFinal = new Date(value2);
    var enVivo =  HoraInicio<= now && HoraFinal> now;
   // console.log(enVivo);
    return  enVivo; //Dia.toLocaleDateString("es-ES",{ day: "numeric" });
    //return null;
  }
}
