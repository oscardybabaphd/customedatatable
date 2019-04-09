import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Swalnotification } from '../repository/swalnotification';


export class Handler implements HttpInterceptor {
    private notify: Swalnotification;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.notify = new Swalnotification();
        return next.handle(request)
            .pipe(
                retry(6),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        errorMessage = error.message;
                    }
                    this.notify.dialog(false, { text: errorMessage, type: 'error' })
                    return throwError(errorMessage);
                })
            )
    }
}
