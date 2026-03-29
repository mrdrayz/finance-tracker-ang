import { Component, computed, inject } from '@angular/core';
import { TuiRingChart } from '@taiga-ui/addon-charts/components/ring-chart';

import { TransactionType } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { formatAmount } from '../../utils/format-amount';

interface CategoryTotal {
    readonly category: string;
    readonly amount: number;
}

const MIN_CHART_PERCENT = 2;
const HUNDRED_PERCENT = 100;

@Component({
    standalone: true,
    selector: 'app-statistics',
    imports: [TuiRingChart],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.less',
})
export class StatisticsComponent {
    private readonly transactionService = inject(TransactionService);

    protected activeIncomeIndex = NaN;
    protected activeExpenseIndex = NaN;

    protected readonly incomeTotals = computed<CategoryTotal[]>(() =>
        this.computeCategoryTotals(TransactionType.Income),
    );

    protected readonly expenseTotals = computed<CategoryTotal[]>(() =>
        this.computeCategoryTotals(TransactionType.Expense),
    );

    protected readonly incomeValues = computed<number[]>(() =>
        this.ensureMinVisibility(this.incomeTotals().map((item) => item.amount)),
    );

    protected readonly expenseValues = computed<number[]>(() =>
        this.ensureMinVisibility(this.expenseTotals().map((item) => item.amount)),
    );

    protected readonly formatLegendAmount = formatAmount;

    protected getActiveLabel(totals: CategoryTotal[], index: number): string {
        if (!(index >= 0 && index < totals.length)) {
            return '';
        }

        return totals[index].category;
    }

    protected getActiveAmount(totals: CategoryTotal[], index: number): string {
        if (!(index >= 0 && index < totals.length)) {
            return '';
        }

        return formatAmount(totals[index].amount);
    }

    private ensureMinVisibility(values: number[]): number[] {
        if (values.length === 0) {
            return [];
        }

        const total = values.reduce((sum, value) => sum + value, 0);

        if (total === 0) {
            return values;
        }

        return values.map((value) => {
            const percent = (value / total) * HUNDRED_PERCENT;

            return percent < MIN_CHART_PERCENT
                ? total * (MIN_CHART_PERCENT / HUNDRED_PERCENT)
                : value;
        });
    }

    private computeCategoryTotals(type: TransactionType): CategoryTotal[] {
        const transactions = this.transactionService.transactions();
        const totalsMap = new Map<string, number>();

        for (const transaction of transactions) {
            if (transaction.type !== type) {
                continue;
            }

            const current = totalsMap.get(transaction.category) ?? 0;

            totalsMap.set(transaction.category, current + transaction.amount);
        }

        return Array.from(totalsMap.entries()).map(([category, amount]) => ({
            category,
            amount,
        }));
    }
}
