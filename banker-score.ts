import { Poker } from '@/poker';
import { getScore } from '@@/util/score';

export const getBankerResult = () => {
  const deck = new Poker(4);

  const bankerCards = [deck.draw()];

  while (true) {
    const score = getScore(bankerCards);

    // 庄家固定策略：大于等于 17 点时停牌，否则拿牌
    if (score >= 17) {
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

export const runBankerRounds = (rounds: number = 10000) => {
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






