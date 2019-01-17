import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import "rxjs/add/operator/do";
import {BackendCacheService} from "./backend-cache.service";

@Injectable({
  providedIn: 'root'
})
export class CachingInterceptor implements HttpInterceptor {

  constructor(private cache: BackendCacheService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'POST') {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req);

    return cachedResponse ? of(cachedResponse) : next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        this.cache.put(req, event);
      }
    });
  }

}
