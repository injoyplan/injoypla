import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'FormatDateMes'
})
export class FormatDateMesPipe implements PipeTransform {

  transform(value: string): string {
    var d = new Date(value);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

    var Mont = d.toLocaleDateString('es-ES', { month: "short" });
    return Mont; //Dia.toLocaleDateString("es-ES",{ day: "numeric" });

    //return null;
  }

}
