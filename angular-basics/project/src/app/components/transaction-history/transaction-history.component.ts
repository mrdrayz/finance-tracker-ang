import { Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiHint } from '@taiga-ui/core/directives/hint';

import { listAnimation } from '../../animations/list.animation';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionAmountPipe } from '../../pipes/transaction-amount.pipe';
import { TransactionService } from '../../services/transaction.service';

@Component({
    standalone: true,
    selector: 'app-transaction-history',
    imports: [TransactionAmountPipe, TuiHint, TuiButton],
    templateUrl: './transaction-history.component.html',
    styleUrl: './transaction-history.component.less',
    animations: [listAnimation],
})
export class TransactionHistoryComponent {
    private readonly transactionService = inject(TransactionService);

    protected get transactions(): Transaction[] {
        return this.transactionService.sortedTransactions();
    }

    protected isIncome(transaction: Transaction): boolean {
        return transaction.type === TransactionType.Income;
    }

    protected hasComment(transaction: Transaction): boolean {
        return transaction.comment.trim().length > 0;
    }

    protected isEditingTransaction(transaction: Transaction): boolean {
        return this.transactionService.editingTransaction()?.id === transaction.id;
    }

    protected onEditTransaction(transaction: Transaction): void {
        this.transactionService.startEditing(transaction);
    }
}
