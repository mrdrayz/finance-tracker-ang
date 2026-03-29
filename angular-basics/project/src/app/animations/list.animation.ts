import { trigger, transition, style, animate } from '@angular/animations';

const SLIDE_DURATION = '300ms ease-out';

export const listAnimation = trigger('listAnimation', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(SLIDE_DURATION, style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
]);
