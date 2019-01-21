import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from "@angular/common/http";
import {hashCodeFromString} from "../utils";

@Injectable({
  providedIn: 'root'
})
export class BackendCacheService {

  private _searchRequestCache = {};
  private _getRequestCache = {};

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const parsedBody = JSON.parse(req.body);
    if (req.headers.has('X-Request-Type')) {
      switch (req.headers.get('X-Request-Type')) {
        case 'search':
          if (hashCodeFromString(req.body) in this._searchRequestCache) {
            return new HttpResponse<any>({body: this._searchRequestCache[hashCodeFromString(req.body)]});
          } else {
            return null;
          }
        case 'get-detailed':
          if (parsedBody.ids[0] in this._getRequestCache) {
            return new HttpResponse<any>({body: this._getRequestCache[parsedBody.ids[0]]});
          } else {
            return null;
          }
        /*        case 'get-basket':
                  if (parsedBody.length > 0 && parsedBody.ids.filter(x => !(x in this._getRequestCache)).length === 0) {
                    const body = parsedBody.ids.map(x => this._getRequestCache[x]);
                    return new HttpResponse<any>({body: body});
                  } else {
                    return null;
                  }*/
      }
    }
    return null;
  }

  put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
    const parsedReqBody = JSON.parse(req.body);
    if (req.headers.has('X-Request-Type')) {
      switch (req.headers.get('X-Request-Type')) {
        case 'search':
          this._searchRequestCache[hashCodeFromString(req.body)] = resp.body;
          break;
        case 'get-detailed':
          this._getRequestCache[parsedReqBody.ids[0]] = resp.body;
          break;
        /*        case 'get-basket':
                  const parsedRespBody = JSON.parse(resp.body);
                  parsedRespBody.response.docs.forEach(x => this._getRequestCache[])
                  break;*/
      }
    }
  }
}
