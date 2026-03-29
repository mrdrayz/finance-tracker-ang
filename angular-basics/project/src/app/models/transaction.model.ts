export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export interface Transaction {
    readonly id: string;
    readonly type: TransactionType;
    readonly category: string;
    readonly amount: number;
    readonly date: string;
    readonly comment: string;
}
