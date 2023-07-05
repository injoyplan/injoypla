import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-lazy-image',
  templateUrl: './lazy-image.component.html',
})
export class LazyImageComponent implements OnInit {

  @Input()
  public url!:string;

  public hasloaded: boolean=false;

  ngOnInit(): void {
    if(!this.url) throw new Error('URL es requerido');
  }

  onload(){
    this.hasloaded=true;

  }

}
