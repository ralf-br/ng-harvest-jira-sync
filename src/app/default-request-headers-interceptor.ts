import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class DefaultRequestHeadersInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const jsonReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

        //required by harvest v2 api: https://help.getharvest.com/api-v2/introduction/overview/general/#api-requests
        'User-Agent': 'NgHarvestJiraSync (https://github.com/mineralf/ng-harvest-jira-sync)'
      }
    });

    return next.handle(jsonReq);
  }
}
