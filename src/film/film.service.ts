import { Injectable, NotFoundException } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { MovieResponse } from 'src/types';
import { fetchMovies } from 'src/util';

@Injectable()
export class FilmService {
  private bot: Telegraf;
  constructor(private readonly configService: ConfigService) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_KEY'));
  }

  startBot() {
    if (!this.configService.get('TELEGRAM_KEY')) {
      throw new NotFoundException();
    }
    this.bot.start((ctx) =>
      ctx.reply(
        'Welcome to the bot human! 👋 , Enter year of movie to get recommendations',
      ),
    );

    this.bot.help((ctx) =>
      ctx.reply('Enter year of movie to get recommendations'),
    );

    this.bot.command('stop', (ctx) => {
      // Stop the bot
      ctx.reply('Thank you for your time , Bot has been stopped.');
      this.bot.stop();
    });

    this.bot.on('text', async (ctx) => {
      const userInput = ctx.message.text;
      // Get the user's input from the message object

      const regex = /^\d{4}$/;

      if (regex.test(userInput)) {
        const yearMovies: { results: MovieResponse[] } = await fetchMovies({
          token: this.configService.get('TOKEN'),
          year: userInput,
        });

        yearMovies.results.forEach((item) => {
          const message = `
          <a href="https://image.tmdb.org/t/p/w500/${item.poster_path}">${item.original_title}</a>
          <b style="color:red">${item.overview}</b>
          `;
          ctx.replyWithHTML(message, { parse_mode: 'HTML' }).catch((error) => {
            console.error('Error sending item:', error);
          });
        });

        return yearMovies;
      } else {
        ctx.reply(`Please enter a valid year`);
      }
    });

    // Start bot
    this.bot.launch();
  }
}
