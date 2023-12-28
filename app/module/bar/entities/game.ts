import type { Player } from './player';

enum Stage {
  PLAYING,
  PAUSE,
  END,
}

export class Game {
  public player: Player[];
  public buyer: Player[];
  public watcher: Player[];
  public stage: Stage;
  constructor(player: Player[], buyer: Player[]) {
    this.player = player;
    this.buyer = buyer;
  }
}
