import { Controller, Get, Res } from '@nestjs/common';
import { InfoService } from './info.service';
import { Response } from 'express';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('health')
  getConnectionHealth(@Res() res: Response) {
    res.status(200).send();
  }
}
