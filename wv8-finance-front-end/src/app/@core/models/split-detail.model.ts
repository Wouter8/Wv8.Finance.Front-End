import { ISplitDetail } from "../data/transaction";

export class SplitDetail {
  transactionId: number;
  amount: number;
  splitwiseUserId: number;
  splitwiseUserName: string;

  public static fromDto(dto: ISplitDetail): SplitDetail {
    let instance = new SplitDetail();

    instance.transactionId = dto.transactionId;
    instance.amount = dto.amount;
    instance.splitwiseUserId = dto.splitwiseUserId;
    instance.splitwiseUserName = dto.splitwiseUserName;

    return instance;
  }

  public copy(): SplitDetail {
    let instance = new SplitDetail();

    instance.transactionId = this.transactionId;
    instance.amount = this.amount;
    instance.splitwiseUserId = this.splitwiseUserId;
    instance.splitwiseUserName = this.splitwiseUserName;

    return instance;
  }
}
