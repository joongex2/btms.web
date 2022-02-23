import { environment } from 'environments/environment';

export function getBaseUrl(url: string) {
    return `${environment.server}${url}`;
}