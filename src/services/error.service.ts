import { Injectable } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { HttpError } from '../../utils/ApiErrors';
import { ErrorWithCodeTranslation } from '../../types/translations.types';

@Injectable()
export class ErrorService extends TranslationService {
  async throwHTTP(text: string, lang: string) {
    const error = await this.translate<ErrorWithCodeTranslation>(text, {
      lang,
    });
    throw new HttpError(error.text, error.code);
  }
}
