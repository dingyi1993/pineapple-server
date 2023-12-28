export class Room {
  public roomId: string;
  constructor(roomId?: string) {
    this.roomId = roomId || '123456';
  }
}
