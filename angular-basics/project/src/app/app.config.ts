import {
    ApplicationConfig,
    ErrorHandler,
    Injectable,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEventPlugins } from '@taiga-ui/event-plugins';

@Injectable()
class GlobalErrorHandler implements ErrorHandler {
    public handleError(error: unknown): void {
        const message = error instanceof Error ? error.message : String(error);

        if (message.includes('ResizeObserver')) {
            return;
        }

        console.error(error);
    }
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideAnimationsAsync(),
        provideEventPlugins(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ],
};
