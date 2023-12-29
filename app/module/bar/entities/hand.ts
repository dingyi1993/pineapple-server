import { Action, ActionType } from './action';
// import { PokerFlower, PokerType } from './poker';
// import type { Player } from './player';

enum Stage {
  PLAYING,
  PAUSE,
  END,
}

export interface PlayerInfo {
  playerId: string;
  position: 1 | 2 | 3;
  fantasy?: 'Q' | 'K' | 'A' | 'SSS';
}

interface FinalPoker {
  poker: string;
  order?: number;
}

const ORDER_MAP = {
  [ActionType.START_HAND]: 1,
  [ActionType.FIRST_PICK]: 2,
  [ActionType.SECOND_PICK]: 3,
  [ActionType.THIRD_PICK]: 4,
  [ActionType.FOURTH_PICK]: 5,
};

interface FinalResultPlayer {
  playerInfo: PlayerInfo;
  top: FinalPoker[];
  middle: FinalPoker[];
  bottom: FinalPoker[];
  fold: string[];
  income: number;
}

export interface FinalResult {
  players: FinalResultPlayer[];
  buyers: { playerId: string; buy: string, income: number }[];
}

const FANTASY_CARD_NUM_MAP = {
  Q: 14,
  K: 15,
  A: 16,
  SSS: 17,
};

export class Hand {
  public playerMap: Record<string, PlayerInfo>;
  public buyerMap: string[];
  public stage: Stage;
  public actions: Action[];
  public finalResult: FinalResult;
  constructor(playerMap: Record<string, PlayerInfo>, buyerMap?: string[]) {
    this.playerMap = playerMap;
    this.buyerMap = buyerMap ?? [];
    this.actions = [];
    this.finalResult = {
      players: Object.values(playerMap).sort((a, b) => (a.position + 4) % 3 - (b.position + 4) % 3).map(_ => ({ playerInfo: _, top: [], middle: [], bottom: [], fold: [], income: 0 })),
      buyers: this.buyerMap.map(buyer => ({ playerId: buyer, buy: '', income: 0 })),
    };
    this.start();
  }

  private start() {
    this.finalResult.buyers.forEach(buyer => {
      buyer.buy = '2D';
    });
  }

  public action(action: Action): void {
    const finalResultPlayer = this.finalResult.players.find(_ => _.playerInfo.playerId === action.playerId);
    if (!finalResultPlayer) {
      throw new Error('invalid action');
    }
    if (!this.validAction(action, finalResultPlayer)) {
      throw new Error('invalid action');
    }
    this.actions.push(action);
    // const playerInfo = this.playerMap[action.playerId];
    this.pushFinalResult(finalResultPlayer, action);
    // switch (action.type) {
    //   case ActionType.FANTASY:
    //     this.pushFinalResult(finalResultPlayer, action);
    //     break;
    //   case ActionType.START_HAND:
    //     this.pushFinalResult(finalResultPlayer, action);
    //   default:
    //     break;
    // }
  }

  private pushFinalResult(finalResultPlayer: FinalResultPlayer, action: Action) {
    const order: number | undefined = ORDER_MAP[action.type];
    finalResultPlayer.top.push(...action.pick.filter(_ => _.position === 'top').map(_ => ({ poker: _.poker, order })));
    finalResultPlayer.middle.push(...action.pick.filter(_ => _.position === 'middle').map(_ => ({ poker: _.poker, order })));
    finalResultPlayer.bottom.push(...action.pick.filter(_ => _.position === 'bottom').map(_ => ({ poker: _.poker, order })));
    finalResultPlayer.fold.push(...action.fold);
  }

  private validAction(action: Action, finalResultPlayer: FinalResultPlayer) {
    const playerInfo = this.playerMap[action.playerId];
    if (!playerInfo) {
      return false;
    }
    const { pick, fold, type } = action;
    const { fantasy } = playerInfo;
    if (fantasy) {
      if (
        type !== ActionType.FANTASY ||
        (FANTASY_CARD_NUM_MAP[fantasy] !== (pick.length + fold.length)) ||
        pick.length !== 13
      ) {
        return false;
      }
      return true;
    }
    if (type === ActionType.FANTASY) {
      return false;
    }
    if (type === ActionType.START_HAND) {
      if (pick.length !== 5 || fold.length !== 0 || pick.filter(_ => _.position === 'top').length > 3) {
        return false;
      }
      return true;
    }
    if (
      pick.length !== 2 ||
      fold.length !== 1 ||
      pick.filter(_ => _.position === 'top').length + finalResultPlayer.top.length > 3 ||
      pick.filter(_ => _.position === 'middle').length + finalResultPlayer.middle.length > 5 ||
      pick.filter(_ => _.position === 'bottom').length + finalResultPlayer.bottom.length > 5
    ) {
      return false;
    }
    return true;
  }
}
