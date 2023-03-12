import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateDia'
})
export class FormatDateDiaPipe implements PipeTransform {

  transform(value: string): string {
    var options = { day: "numeric" };
    var d = new Date(value);

    d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
    var Dia = d.getDate();
    return  Dia.toString(); //Dia.toLocaleDateString("es-ES",{ day: "numeric" });
    //return null;
  }
}
