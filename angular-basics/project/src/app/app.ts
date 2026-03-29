import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';

import { StatisticsComponent } from './components/statistics/statistics.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [TuiRoot, TransactionFormComponent, TransactionHistoryComponent, StatisticsComponent],
    templateUrl: './app.html',
    styleUrl: './app.less',
})
export class App {}
