import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate<T = string>(
    key: string,
    options: TranslateOptions = {},
  ): Promise<T> {
    return this.i18n.translate(key, options) as T;
  }
}
