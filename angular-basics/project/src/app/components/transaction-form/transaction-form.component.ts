import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk/date-time';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiTextfield } from '@taiga-ui/core/components/textfield';
import { TuiBlock } from '@taiga-ui/kit/components/block';
import { TuiCheckbox } from '@taiga-ui/kit/components/checkbox';
import { TuiInputDate } from '@taiga-ui/kit/components/input-date';
import { TuiInputNumber } from '@taiga-ui/kit/components/input-number';
import { TuiSelect } from '@taiga-ui/kit/components/select';
import { TuiTextarea } from '@taiga-ui/kit/components/textarea';

import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import { CommentValidatorDirective } from '../../directives/comment-validator.directive';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

const MAX_AMOUNT = 10_000_000;

@Component({
    standalone: true,
    selector: 'app-transaction-form',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CurrencyPipe,
        TuiButton,
        TuiBlock,
        TuiCheckbox,
        TuiTextarea,
        ...TuiTextfield,
        ...TuiInputDate,
        ...TuiInputNumber,
        ...TuiSelect,
        CommentValidatorDirective,
    ],
    templateUrl: './transaction-form.component.html',
    styleUrl: './transaction-form.component.less',
})
export class TransactionFormComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly transactionService = inject(TransactionService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly alertService = inject(TuiAlertService);

    protected readonly typeControl = this.formBuilder.control<TransactionType | null>(null, [
        Validators.required,
    ]);

    protected readonly categoryControl = this.formBuilder.control<string | null>(null, [
        Validators.required,
    ]);

    protected readonly amountControl = this.formBuilder.control<number | null>(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(MAX_AMOUNT),
    ]);

    protected readonly dateControl = this.formBuilder.control<TuiDay | null>(null, [
        Validators.required,
    ]);

    protected readonly commentControl = this.formBuilder.control<string>('');

    protected readonly transactionForm = this.formBuilder.group({
        type: this.typeControl,
        category: this.categoryControl,
        amount: this.amountControl,
        date: this.dateControl,
        comment: this.commentControl,
    });

    protected isCommentEnabled = false;

    protected readonly isEditing = computed<boolean>(
        () => this.transactionService.editingTransaction() !== null,
    );

    protected readonly typeOptions: ReadonlyArray<{
        readonly value: TransactionType;
        readonly label: string;
    }> = [
        { value: TransactionType.Income, label: 'Доход' },
        { value: TransactionType.Expense, label: 'Расход' },
    ];

    protected readonly maxDate = TuiDay.currentLocal();

    constructor() {
        this.typeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.categoryControl.reset();
        });

        effect(() => {
            const transaction = this.transactionService.editingTransaction();

            if (transaction) {
                this.populateForm(transaction);
            }
        });
    }

    protected get categoryOptions(): readonly string[] {
        return this.typeControl.value === TransactionType.Income
            ? INCOME_CATEGORIES
            : EXPENSE_CATEGORIES;
    }

    protected onSubmit(): void {
        if (this.transactionForm.invalid) {
            this.transactionForm.markAllAsTouched();

            return;
        }

        const type = this.typeControl.value;
        const category = this.categoryControl.value;
        const amount = this.amountControl.value;
        const date = this.dateControl.value;
        const comment = this.commentControl.value;

        if (!type || !category || amount === null || !date) {
            return;
        }

        const editingTransaction = this.transactionService.editingTransaction();

        const transaction: Transaction = {
            id: editingTransaction?.id ?? crypto.randomUUID(),
            type,
            category,
            amount,
            date: this.formatTuiDay(date),
            comment: this.isCommentEnabled ? (comment ?? '') : '',
        };

        if (editingTransaction) {
            this.transactionService.updateTransaction(transaction);
            this.transactionService.cancelEditing();
            this.showAlert('Транзакция успешно обновлена');
        } else {
            this.transactionService.addTransaction(transaction);
            this.showAlert('Транзакция успешно добавлена');
        }

        this.resetForm();
    }

    protected onCancelEditing(): void {
        this.transactionService.cancelEditing();
        this.resetForm();
    }

    private populateForm(transaction: Transaction): void {
        this.typeControl.setValue(transaction.type, { emitEvent: false });
        this.categoryControl.setValue(transaction.category);
        this.amountControl.setValue(transaction.amount);
        this.dateControl.setValue(this.parseDateToTuiDay(transaction.date));

        const hasComment = transaction.comment.trim().length > 0;

        this.isCommentEnabled = hasComment;

        if (hasComment) {
            this.commentControl.setValue(transaction.comment);
        } else {
            this.commentControl.reset();
        }
    }

    private resetForm(): void {
        this.transactionForm.reset();
        this.isCommentEnabled = false;
    }

    private showAlert(message: string): void {
        this.alertService
            .open(message, {
                appearance: 'positive',
                autoClose: 3000,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private formatTuiDay(day: TuiDay): string {
        const month = String(day.month + 1).padStart(2, '0');
        const dayOfMonth = String(day.day).padStart(2, '0');

        return `${day.year}-${month}-${dayOfMonth}`;
    }

    private parseDateToTuiDay(dateString: string): TuiDay {
        const [year, month, day] = dateString.split('-').map(Number);

        return new TuiDay(year, month - 1, day);
    }
}
