import { Model } from 'objection';
import { v4 } from 'uuid';

export default class Instance extends Model {
  public static tableName = 'instances';

  public readonly id!: number;
  public uuid?: string;
  public createdAt?: number;
  public updatedAt?: number;

  public $beforeInsert(): void {
    const now = new Date();
    this.createdAt = now.getUTCSeconds();
    this.updatedAt = now.getUTCSeconds();
    this.uuid = v4();
  }
}
