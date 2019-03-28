import { Pipe, PipeTransform } from '@angular/core';
import { layoutPaths, imageTypes } from '../shared.constants';

@Pipe({
  name: 'appImg'
})
export class AppImgPipe implements PipeTransform {

  transform(input: string): any {
    return layoutPaths.images.root + input;
  }
}
