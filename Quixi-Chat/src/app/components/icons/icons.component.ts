import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ICONS_OUTLINE } from './icon/outline';
import { ICONS_SOLID } from './icon/solid';

@Component({
  selector: 'icon',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnChanges {
  @Input({ required: true }) name: string = '';
  private _OUTLINED: any = ICONS_OUTLINE;
  private _SOLID: any = ICONS_SOLID;

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  ngOnChanges() {
    let svg = '<svg viewBox="0 0 24 24" fill="none">'
    if (this.name.includes('outline')) {
      const content = this._OUTLINED[this.name];
      svg += content;
    } else if (this.name.includes('solid')) {
      const content = this._SOLID[this.name];
      svg += content;
    }
    svg += '</svg>';
    this._renderer.setProperty(this._elementRef.nativeElement, 'innerHTML', svg);
  }
}
