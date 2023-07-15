import { Controller, Get, Res } from '@nestjs/common';
import { FilmService } from './film.service';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  async startBot() {
    return this.filmService.startBot();
  }
}
