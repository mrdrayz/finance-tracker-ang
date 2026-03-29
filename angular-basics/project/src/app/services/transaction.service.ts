import { Injectable, computed, signal } from '@angular/core';

import { Transaction } from '../models/transaction.model';

const STORAGE_KEY = 'finance-tracker-transactions';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private readonly transactionsSignal = signal<Transaction[]>(this.loadFromStorage());
    private readonly editingTransactionSignal = signal<Transaction | null>(null);

    public readonly transactions = this.transactionsSignal.asReadonly();
    public readonly editingTransaction = this.editingTransactionSignal.asReadonly();

    public readonly sortedTransactions = computed<Transaction[]>(() =>
        [...this.transactionsSignal()].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    );

    public addTransaction(transaction: Transaction): void {
        const updated = [...this.transactionsSignal(), transaction];

        this.transactionsSignal.set(updated);
        this.saveToStorage(updated);
    }

    public updateTransaction(transaction: Transaction): void {
        const updated = this.transactionsSignal().map((existing) =>
            existing.id === transaction.id ? transaction : existing,
        );

        this.transactionsSignal.set(updated);
        this.saveToStorage(updated);
    }

    public startEditing(transaction: Transaction): void {
        this.editingTransactionSignal.set(transaction);
    }

    public cancelEditing(): void {
        this.editingTransactionSignal.set(null);
    }

    private loadFromStorage(): Transaction[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);

            if (!data) {
                return [];
            }

            const parsed: Transaction[] = JSON.parse(data);

            return parsed;
        } catch {
            return [];
        }
    }

    private saveToStorage(transactions: Transaction[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
}
