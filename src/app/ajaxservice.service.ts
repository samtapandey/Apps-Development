import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as x from 'src/app/CONSTANTS';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class AjaxserviceService {

  //urls required
  private dataseturl = x.BASE_URL + x.DATASETS_API;
  private userorguniturl = x.BASE_URL + x.USER_ORGUNIT;

  constructor(private http: HttpClient) { }

  //funtions required
  getDatasets(): Observable<any> {
    return this.http.get<any>(this.dataseturl);
  }

  getUserOu(): Observable<any> {
    return this.http.get<any>(this.userorguniturl);
  }

  getChildOu(child: string): Observable<any> {
    return this.http.get<any>(x.BASE_URL + x.OU_CHILDREN_BASE + child + x.OU_CHILDREN_FILTER);
  }

  getDatasetHTML(ou: string, pe: string, ds: string): Observable<any> {
    return this.http.get(x.BASE_URL + 'dataSetReport.json?ds=' + ds + '&pe=' + pe + '&ou=' + ou, { responseType: 'text' });
  }

  getOuName(ou: string): Observable<any> {
    return this.http.get(x.BASE_URL + "organisationUnits/" + ou + ".json?fields=displayName");
  }

  getOuLevel(ou:string): Observable<any>{
    return this.http.get(x.BASE_URL + "organisationUnits/" + ou + ".json?fields=level");
  }

  getOuGroups(ou:string): Observable<any>{
    return this.http.get(x.BASE_URL + "organisationUnits/" + ou + ".json?fields=organisationUnitGroups[id,name]");
  }

  getOuGroupsDropdown(): Observable<any>{
    return this.http.get(x.BASE_URL + "organisationUnitGroups.json");
  }

  extrenalReport1(ou,pe): Observable<any>{
    return this.http.get(x.BASE_URL + "analytics.json?dimension=pe:"+pe+"&dimension=dx:Sg59a7l8SaM;lYlmBU9D1hb;UU8umBgSEQh;EIYAuWcXSQc;MOi1AUjSSEo;ks1EPfFG4xM;eYGVpV4Ozwk;e61NNT1d8QT;BKDoyXKeGN6;Z0k1zEJ1nZQ;G4OYaFJJgjV;zlqokFy4Hax;VFmOJP8mWGL;MoLEI8oADoU;DR1wMYGMdJO;mDXxQD59bW1;rvfNtKKXKdj;mVQ0rggrmem;eMyLXuvjQpY;SOVwX7rreHs;rpgEFkPOzdM;MuKEN1itOv0;rpFCV9LHEHz;z3KodlNdN7q;WtfVifSU2Ai;MGqh8GuU91p;E82SfFcIgOV;DNvxp9a63q2;ShfbN9bWSNR;hPh2Zt2Q3aU;lnk4xZbjb57;RWzaSEzzOFV&filter=ou:"+ou+"&displayProperty=NAME");
  }

  extrenalReport2(ou,pe): Observable<any>{
    return this.http.get(x.BASE_URL + "analytics/events/query/nR5xtrxFKYI.json?dimension=ou:"+ ou +"&dimension=pe:" + pe + "&dimension=hDPezniOnwQ:LT:5&displayProperty=NAME&outputType=EVENT");
  }

  extrenalReport2_1(ev): Observable<any>{
    return this.http.get(x.BASE_URL + "events/"+ev+".json");
  }
}
