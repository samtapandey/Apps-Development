import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as x from 'src/app/CONSTANTS';
//import { objectDetails } from './metadatareport/metadatareport.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class CustomService {

  constructor() { }
  
  //constructor(private http:HttpClient) { }

  // getAPI(groupObject,allFields): Observable<objectDetails[]>{
  //   return this.http.get<objectDetails[]>("../../" + groupObject + ".json?fields=[" +allFields+ "]&paging=false").timeout(3000);
  // }

}
