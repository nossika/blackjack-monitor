import * as inquirer from 'inquirer';
import { Poker } from '@/poker';
import { checkBankerHit, getScore } from '@@/util/score';
import logger from '@@/util/logger';
import { isPosiInt } from '@@/util/number';

const getBankerResult = () => {
  const deck = new Poker(4);

  const bankerCards = [deck.draw()];

  while (true) {
    if (!checkBankerHit(bankerCards)) {
      break;
    }

    bankerCards.push(deck.draw());
  }

  const score = getScore(bankerCards);

  return {
    score,
    cards: bankerCards,
  };
};

const simulateBankerRounds = (rounds: number = 10000) => {
  const results = {
    '=17': 0,
    '=18': 0,
    '=19': 0,
    '=20': 0,
    '=21': 0,
    '>21': 0,
  }
  
  let remainRounds = rounds;
  
  while (remainRounds-- > 0) {
    const { score } = getBankerResult();

    if (score > 21) {
      results['>21'] += 1;
    } else {
      results[`=${score}`] += 1;
    }
  }
  
  return results;
};

export const startBankerSimulate = async () => {
  const { oRounds } = await inquirer.prompt([{
    type: 'input',
    message: 'set rounds',
    name: 'oRounds',
    default: '10000',
    validate: (val) => {
      if (!isPosiInt(+val)) {
        return 'rounds must be positive integer';
      }

      return true;
    },
  }]);

  const rounds = +oRounds;

  const results = simulateBankerRounds(rounds);

  logger.log('simulate results: ');

  Object.entries(results).forEach(([score, count]) => {
    logger.log(
      score,
      '---',
      `${(count / rounds) * 100}%`,
    );
  });
};




