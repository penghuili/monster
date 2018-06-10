import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteFormatter'
})
export class ByteFormatterPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return '0';
    } else {
      const giga = Math.floor(value / 1024 ** 3);
      const forMega = value - giga * 1014 ** 3;
      const mega = Math.floor(forMega / 1024 ** 2);
      const forKilo = forMega - mega * 1024 ** 2;
      const kilo = Math.floor(forKilo / 1024);
      const byte = Math.round(forKilo - kilo * 1024);
      if (giga) {
        return `${giga}G ${mega}M ${kilo}K ${byte}B`;
      } else if (mega) {
        return `${mega}M ${kilo}K ${byte}B`;
      } else if (kilo) {
        return `${kilo}K ${byte}B`;
      } else {
        return `${byte}B`;
      }
    }
  }

}
