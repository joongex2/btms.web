import { environment } from 'environments/environment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baseUrl'
})
export class BaseUrlPipe implements PipeTransform {

  transform(value: any): any {
    return `${environment.server}/${value}`;
  }

}
