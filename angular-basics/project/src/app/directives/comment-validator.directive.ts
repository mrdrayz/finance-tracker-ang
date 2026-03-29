import { Directive, Input, OnChanges, OnDestroy, inject } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

const MAX_COMMENT_LENGTH = 100;

@Directive({
    selector: '[appCommentValidator]',
    standalone: true,
})
export class CommentValidatorDirective implements OnChanges, OnDestroy {
    @Input({ required: true })
    public appCommentValidator = false;

    private readonly ngControl = inject(NgControl);

    public ngOnChanges(): void {
        this.updateValidators();
    }

    public ngOnDestroy(): void {
        const control = this.ngControl.control;

        if (!control) {
            return;
        }

        control.clearValidators();
        control.updateValueAndValidity();
    }

    private updateValidators(): void {
        const control = this.ngControl.control;

        if (!control) {
            return;
        }

        if (this.appCommentValidator) {
            control.setValidators([Validators.required, Validators.maxLength(MAX_COMMENT_LENGTH)]);
        } else {
            control.clearValidators();
        }

        control.updateValueAndValidity();
    }
}
