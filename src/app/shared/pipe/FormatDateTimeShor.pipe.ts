import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatDateTimeShor'
})
export class FormatDateTimeShorPipe implements PipeTransform {

  transform(value: string): string {
    var d = new Date(value);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
    var Dia = d.toLocaleDateString('es-ES', {  day: "numeric" });
    var Mont = d.toLocaleDateString('es-ES', { month: "short" });
    return  Dia.toUpperCase() + "   de " + Mont; //Dia.toLocaleDateString("es-ES",{ day: "numeric" });
    //return null;
  }
}
