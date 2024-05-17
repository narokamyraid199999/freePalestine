import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], sliceNum: number): any[] {
    let temp = value;
    temp = temp.slice(0, sliceNum);
    return temp;
  }
}
