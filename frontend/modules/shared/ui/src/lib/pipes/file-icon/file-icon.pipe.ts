import { Pipe, PipeTransform } from '@angular/core';
import { FileResource } from '@reunice/modules/shared/data-access';

@Pipe({
  name: 'fileIcon',
  pure: true,
})
export class FileIconPipe implements PipeTransform {
  transform({ type }: FileResource): string {
    if (type.startsWith('image')) {
      return 'tuiIconImage';
    }

    if (type.startsWith('video')) {
      return 'tuiIconFilm';
    }

    if (type.startsWith('audio')) {
      return 'tuiIconMusic';
    }

    if (type.startsWith('text')) {
      return 'tuiIconFileText';
    }

    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
      return 'tuiIconFolder';
    }

    return 'tuiIconFile';
  }
}
