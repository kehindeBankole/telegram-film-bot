import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilmService {
  private bot: Telegraf;
  constructor(private readonly configService: ConfigService) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_KEY'));
  }

  startBot() {
    this.bot.start((ctx) => ctx.reply('Welcome to the bot human!'));
    this.bot.help((ctx) => ctx.reply('This is the bot help message.'));

    this.bot.command('stop', (ctx) => {
      // Stop the bot
      ctx.reply('Thank you for your time , Bot has been stopped.');
      this.bot.stop();
    });

    this.bot.on('text', (ctx) => {
      // Get the user's input from the message object
      const userInput = ctx.message.text;

      ctx.reply(`You entered: ${userInput}`);
    });

    // Start bot
    this.bot.launch();
  }
}
