import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {

  transform(value: string): string {

    var d = new Date(value);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
    var Dia = d.toLocaleDateString('es-ES', { weekday: "long", month: "long", day: "numeric" });
    return  Dia.toUpperCase(); //Dia.toLocaleDateString("es-ES",{ day: "numeric" });
    //return null;
  }
}
