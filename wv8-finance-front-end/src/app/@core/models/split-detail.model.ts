import { ISplitDetail } from "../data/transaction";

export class SplitDetail {
  transactionId: number;
  amount: number;
  splitwiseUserId: number;

  public static fromDto(dto: ISplitDetail): SplitDetail {
    let instance = new SplitDetail();

    instance.transactionId = dto.transactionId;
    instance.amount = dto.amount;
    instance.splitwiseUserId = dto.splitwiserUserId;

    return instance;
  }

  public copy(): SplitDetail {
    let instance = new SplitDetail();

    instance.transactionId = this.transactionId;
    instance.amount = this.amount;
    instance.splitwiseUserId = this.splitwiseUserId;

    return instance;
  }
}
