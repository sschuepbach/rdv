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
    if (parsedBody.ids && parsedBody.ids[0] in this._getRequestCache) {
      console.log("Load from cache");
      return new HttpResponse<any>({body: this._getRequestCache[parsedBody.ids[0]]});
    }
    if (!parsedBody.ids && hashCodeFromString(req.body) in this._searchRequestCache) {
      console.log("Load from cache");
      return new HttpResponse<any>({body: this._searchRequestCache[hashCodeFromString(req.body)]})
    }
    console.log("Load from backend");
    return null;
  }

  put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
    const parsedReqBody = JSON.parse(req.body);
    if (parsedReqBody.ids) {
      this._getRequestCache[parsedReqBody.ids[0]] = resp.body;
    } else {
      this._searchRequestCache[hashCodeFromString(req.body)] = resp.body;
    }
  }
}
