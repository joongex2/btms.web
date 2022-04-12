import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UrlService } from './shared/services/url.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    currentUrl: string = null;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _urlService: UrlService
    ) {
    }

    ngOnInit() {
        this._router.events.pipe(filter(event => event instanceof NavigationStart))
            .subscribe((event: NavigationStart) => {
                // set previous url
                const previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                this._urlService.setPreviousUrl(previousUrl);
            });
    }
}
