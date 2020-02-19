import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs/operators";
import { NbToastrService } from "@nebular/theme";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastrService: NbToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        "Content-Type": "application/json"
      }
    });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const error: string = err.status == 400 ? err.error : "";

        this.toastrService.danger(error, "Oops... Something went wrong", {
          duration: 6000
        });

        return throwError(error);
      })
    );
  }
}
