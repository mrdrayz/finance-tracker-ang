import { Pipe, PipeTransform } from '@angular/core';

import { TransactionType } from '../models/transaction.model';
import { formatAmount } from '../utils/format-amount';

const SIGN_MAP: Record<TransactionType, string> = {
    [TransactionType.Income]: '+',
    [TransactionType.Expense]: '-',
};

@Pipe({
    name: 'transactionAmount',
    standalone: true,
})
export class TransactionAmountPipe implements PipeTransform {
    public transform(amount: number, type: TransactionType): string {
        return `${SIGN_MAP[type]} ${formatAmount(amount)}`;
    }
}
