export enum ActionType {
  FANTASY,
  START_HAND,
  FIRST_PICK,
  SECOND_PICK,
  THIRD_PICK,
  FOURTH_PICK,
}

export interface PickPoker {
  position: 'top' | 'middle' | 'bottom';
  poker: string;
}

export class Action {
  public playerId: string;
  public type: ActionType;
  public pick: PickPoker[];
  public fold: string[];
  constructor(playerId: string, type: ActionType, pick: PickPoker[], fold: string[]) {
    this.playerId = playerId;
    this.type = type;
    this.pick = pick;
    this.fold = fold;
  }
}
