import { strict as assert } from 'node:assert';
import { FinalResult, Hand, PlayerInfo } from '@/module/bar/entities/hand';
import { Action, ActionType } from '@/module/bar/entities/action';

describe('test/app/module/bar/entities/hand.test.js', () => {
  const playerInfo: Record<string, PlayerInfo> = {
    1: { playerId: '1', position: 1 },
    2: { playerId: '2', position: 2 },
    3: { playerId: '3', position: 3 },
  };
  const startHandAction = new Action('1', ActionType.START_HAND, [
    { position: 'top', poker: '1S' },
    { position: 'top', poker: '2H' },
    { position: 'middle', poker: '3C' },
    { position: 'middle', poker: '4D' },
    { position: 'bottom', poker: 'JOKER' },
  ], []);
  let hand: Hand;
  beforeEach(() => {
    hand = new Hand(playerInfo);
  });
  it('start hand', async () => {
    hand.action(startHandAction);
    const expectedFinalResult: FinalResult = {
      players: [{
        playerInfo: playerInfo['2'],
        top: [],
        middle: [],
        bottom: [],
        fold: [],
        income: 0,
      }, {
        playerInfo: playerInfo['3'],
        top: [],
        middle: [],
        bottom: [],
        fold: [],
        income: 0,
      }, {
        playerInfo: playerInfo['1'],
        top: [{ poker: '1S', order: 1 }, { poker: '2H', order: 1 }],
        middle: [{ poker: '3C', order: 1 }, { poker: '4D', order: 1 }],
        bottom: [{ poker: 'JOKER', order: 1 }],
        fold: [],
        income: 0,
      }],
      buyers: [],
    };
    assert.deepEqual(hand.finalResult, expectedFinalResult);
  });
  it('first pick', async () => {
    hand.action(startHandAction);
    const incorrectAction1 = new Action('1', ActionType.FIRST_PICK, [
      { position: 'top', poker: '5S' },
      { position: 'top', poker: '6H' },
    ], [ '7C' ]);
    const incorrectAction2 = new Action('1', ActionType.FIRST_PICK, [
      { position: 'top', poker: '5S' },
    ], [ '6H', '7C' ]);
    const correctAction = new Action('1', ActionType.FIRST_PICK, [
      { position: 'middle', poker: '5S' },
      { position: 'bottom', poker: '6H' },
    ], [ '7C' ]);
    assert.throws(() => hand.action(incorrectAction1), /invalid action$/);
    assert.throws(() => hand.action(incorrectAction2), /invalid action$/);
    hand.action(correctAction);
    const expectedFinalResult: FinalResult = {
      players: [{
        playerInfo: playerInfo['2'],
        top: [],
        middle: [],
        bottom: [],
        fold: [],
        income: 0,
      }, {
        playerInfo: playerInfo['3'],
        top: [],
        middle: [],
        bottom: [],
        fold: [],
        income: 0,
      }, {
        playerInfo: playerInfo['1'],
        top: [{ poker: '1S', order: 1 }, { poker: '2H', order: 1 }],
        middle: [{ poker: '3C', order: 1 }, { poker: '4D', order: 1 }, { poker: '5S', order: 2 }],
        bottom: [{ poker: 'JOKER', order: 1 }, { poker: '6H', order: 2 }],
        fold: [ '7C' ],
        income: 0,
      }],
      buyers: [],
    };
    assert.deepEqual(hand.finalResult, expectedFinalResult);
  });
});

