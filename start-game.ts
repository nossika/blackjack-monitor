import * as inquirer from 'inquirer';
import { Game } from '@/game';
import logger from './util/logger';
import { getScore } from './util/score';

const logCardsInfo = (game: Game) => {
  logger.log(
    'player',
    '---',
    game.playerCards.map(c => `${c.pattern}${c.figure}`).join(' '),
    getScore(game.playerCards) > 21 ? '💣' : '',
  );

  logger.log(
    'banker',
    '---',
    game.bankerCards.map(c => `${c.pattern}${c.figure}`).join(' '),
    getScore(game.bankerCards) > 21 ? '💣' : '',
  );
};

export const startGame = async () => {
  const game = new Game();

  game.start();

  while (game.status === 'progress') {
    logCardsInfo(game);

    const { action } = await inquirer.prompt([{
      type: 'list',
      message: 'your choice',
      name: 'action',
      choices: [
        { name: 'hit', value: 'hit' },
        { name: 'stop', value: 'stop' },
      ], 
    }]);

    switch (action) {
      case 'hit': {
        game.hit();
        break;
      }

      case 'stop': {
        game.stop();
        break;
      }
    }
  }
  logCardsInfo(game);

  logger.log('\n');
  logger.log(
    'winner',
    '---',
    game.winner,
    `(player<${getScore(game.playerCards)}> vs banker<${getScore(game.bankerCards)}>)`,
  );
  logger.log('\n');
};


