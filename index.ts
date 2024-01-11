import { Poker } from '@/poker';
import { getScore } from '@@/util/score';
import logger from '@@/util/logger';

const getOneResult = () => {
  const deck = new Poker(4);

  const bankerCards = [deck.draw()];

  while (true) {
    const score = getScore(bankerCards);

    if (score >= 17) {
      break;
    }

    bankerCards.push(deck.draw());
  }

  const score = getScore(bankerCards);

  return score;
}

const results = {
  17: 0,
  18: 0,
  19: 0,
  20: 0,
  21: 0,
  22: 0,
}

let round = 1000000;

while (round--) {
  let score = getOneResult();
  if (score > 21) {
    score = 22;
  }

  results[score] += 1;
}

Object.entries(results).forEach(([score, count]) => {
  logger.log(
    score,
    `${(count / 1000000) * 100}%`,
  );
});




