import { Card } from '@/poker';

/**
 * 计算牌面对应的点数
 * 
 * A：可以计为 1 或者 11 【软牌】
 * 2 ～ 9：按对应点数计 【硬牌】
 * 10 ～ K：计为 10 【硬牌】
 */
export const getPoint = (figure: number): number | [number, number] => {
  if (figure === 1) {
    return [1, 11];
  }

  if (figure >= 2 && figure <= 9) {
    return figure;
  }

  if (figure >= 10 && figure <= 13) {
    return 10;
  }

  throw new Error(`Invalid figure: ${figure}`);
}

export const WIN_SCORE = 21;

/**
 * 计算牌面的点数
 * 
 * 有软牌的情况：未超过 21 点时，尽可能按最大点数计算软牌
 */
export const getScore = (cards: Card[]) => {
  const softCards = cards.filter(card => card.figure === 1);
  const hardCards = cards.filter(card => card.figure !== 1);

  let hardScore = hardCards.reduce((score, card) => score + (getPoint(card.figure) as number), 0);

  const getSoftScore = (count: number, maxCount: number) => {
    let score = 0;
    const [min, max] = getPoint(1) as [number, number];

    for (let i = 0; i < count; i++) {
      score += (maxCount-- > 0) ? max : min;
    }

    return score;
  };

  let softMaxCount = softCards.length;

  while ((hardScore + getSoftScore(softCards.length, softMaxCount) > WIN_SCORE) && softMaxCount) {
    softMaxCount -= 1;
  }

  return hardScore + getSoftScore(softCards.length, softMaxCount);
};