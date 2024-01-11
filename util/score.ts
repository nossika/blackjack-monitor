import { Card, CardFigure } from '@/poker';

/**
 * 计算牌面对应的点数
 * 
 * A：可以计为 1 或者 11 【软牌】
 * 2 ～ 9：按对应点数计 【硬牌】
 * 10 ～ K：计为 10 【硬牌】
 */
export const getPoint = (figure: CardFigure): number | [number, number] => {
  if (figure === CardFigure.Ace) {
    return [1, 11];
  }

  if (
    [
      CardFigure.Two,
      CardFigure.Three,
      CardFigure.Four,
      CardFigure.Five,
      CardFigure.Six,
      CardFigure.Seven,
      CardFigure.Eight,
      CardFigure.Nine,
    ].includes(figure)
  ) {
    return +figure;
  }

  if (
    [
      CardFigure.Ten,
      CardFigure.Jack,
      CardFigure.Queen,
      CardFigure.King,
    ].includes(figure)
  ) {
    return 10;
  }
}

export const WIN_SCORE = 21;

/**
 * 计算牌面的点数
 * 
 * 有软牌的情况：未超过 21 点时，尽可能按最大点数计算软牌
 */
export const getScore = (cards: Card[]) => {
  const softCards = cards.filter(card => card.figure === CardFigure.Ace);
  const hardCards = cards.filter(card => card.figure !== CardFigure.Ace);

  let hardScore = hardCards.reduce((score, card) => score + (getPoint(card.figure) as number), 0);

  const getSoftScore = (count: number, maxCount: number) => {
    let score = 0;
    const [min, max] = getPoint(CardFigure.Ace) as [number, number];

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

/**
 * 计算庄家是否继续拿牌
 * 
 * 庄家固定策略：大于等于 17 点（包含软牌）时停牌，否则拿牌
 */
export const checkBankerHit = (cards: Card[]) => {
  return getScore(cards) < 17;
};