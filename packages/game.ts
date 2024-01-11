import { Card, Poker } from '@/poker';
import { WIN_SCORE, checkBankerHit, getScore } from '@@/util/score';

type GameStatus = 'init' | 'progress' | 'end';

type Winner = '' | 'banker' | 'player' | 'tie';

export class Game {
  deck: Poker;
  bankerCards: Card[] = [];
  playerCards: Card[] = [];
  status: GameStatus = 'init';
  winner: Winner = '';

  constructor() {
    this.deck = new Poker(4);
  }

  // 开始游戏
  start() {
    if (this.status !== 'init') {
      throw new Error('game already started');
    }

    this.status = 'progress';

    // 庄家发一张牌并公开
    this.bankerCards.push(
      this.deck.draw(),
    );

    // 玩家发两张牌
    this.playerCards.push(
      this.deck.draw(),
      this.deck.draw(),
    );
  }

  // 玩家拿牌
  hit() {
    if (this.status !== 'progress') {
      throw new Error('game is not in progress');
    }

    this.playerCards.push(
      this.deck.draw(),
    );

    if (getScore(this.playerCards) >= WIN_SCORE) {
      this.stop();
    }
  }

  // 玩家停牌
  stop() {
    if (this.status !== 'progress') {
      throw new Error('game is not in progress');
    }
    this.status = 'end';

    this.checkResult();
  }

  // 计算游戏结果
  checkResult() {
    if (this.status !== 'end') {
      throw new Error('game is not end');
    }

    // 庄家补牌
    while (checkBankerHit(this.bankerCards)) {
      this.bankerCards.push(
        this.deck.draw(),
      );
    }

    const playerScore = getScore(this.playerCards);
    const bankerScore = getScore(this.bankerCards);

    if (playerScore > WIN_SCORE) {
      this.winner = 'banker';
      return;
    }

    if (bankerScore > WIN_SCORE) {
      this.winner = 'player';
      return;
    }

    if (bankerScore === playerScore) {
      this.winner = 'tie';
      return;
    }

    this.winner = bankerScore > playerScore ? 'banker' : 'player';
  }
}