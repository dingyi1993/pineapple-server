import { strict as assert } from 'node:assert';
import { FinalResult, Hand, PlayerInfo } from '@/module/bar/entities/hand';
import { Action, ActionType } from '@/module/bar/entities/action';

describe('test/app/module/bar/entities/hand.test.js', () => {
  it('should hand eq', async () => {
    const playerInfo: Record<string, PlayerInfo> = {
      1: { playerId: '1', position: 1 },
      2: { playerId: '2', position: 2 },
      3: { playerId: '3', position: 3 },
    };
    const hand = new Hand(playerInfo);
    hand.action(new Action('1', ActionType.START_HAND, [
      { position: 'top', poker: '1S' },
      { position: 'top', poker: '2H' },
      { position: 'middle', poker: '3C' },
      { position: 'middle', poker: '4D' },
      { position: 'bottom', poker: 'JOKER' },
    ], []));
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
        top: [{ poker: '1S' }, { poker: '2H' }],
        middle: [{ poker: '3C' }, { poker: '4D' }],
        bottom: [{ poker: 'JOKER' }],
        fold: [],
        income: 0,
      }],
      buyers: [],
    };
    assert.deepEqual(hand.finalResult, expectedFinalResult);
  });
});

