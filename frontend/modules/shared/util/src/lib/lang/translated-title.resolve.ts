import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResolveFn } from '@angular/router';

export const translatedTitle = (title: string): ResolveFn<string> => {
  return () => {
    return inject(TranslateService).get(title);
  };
};
