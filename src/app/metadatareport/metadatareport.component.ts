import { Component, OnInit, getDebugNode } from '@angular/core';
import * as x from 'src/app/CONSTANTS';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CustomService } from '../custom.service';
import 'rxjs/add/operator/timeout';


// export interface objectDetails {
//   All: any,
//   id: any,
//   code: any,
//   name: any,
//   created: any,
//   lastUpdated: any,
//   formName: any,
//   valueType: any,
//   domainType: any,
//   publicAccess: any,
//   dataElementGroups: any,
//   dataElements: any,
//   indicatorGroups: any,
//   indicators: any,
//   organisationUnits: any,
//   organisationUnitGroups: any,
//   userGroups: any,
//   users: any
// }


@Component({
  selector: 'app-metadatareport',
  templateUrl: './metadatareport.component.html',
  styleUrls: ['./metadatareport.component.css']
})
export class MetadatareportComponent implements OnInit {
  groupSub = x.group;
  attribute = x.attribute;
  selection = x.selection;
  attributes = x.attributes;
  groups = x.groups;
  myForm: FormGroup;
  public btnDisable: boolean = true;
  public btnDisable2: boolean = true;
  public butDisabled: boolean = false;
  public selectedAttribute;

  selectedGroup = "Please Select";

  public selectedMetaDataGroup = "";
  public groupObject = "";
  public allFields = [];
  public responseData;
  public respData;

  constructor(private _customService: CustomService, private http: HttpClient) { }

  ngOnInit() {

  }

  public getReport(groupName, attributeName) {
    console.log(groupName);

    if (attributeName == "All") {
      this.allFields = [];
      this.allFields.push("id", "code", "name", "created", "lastUpdated", "formName", "valueType", "domainType", "publicAccess");
    }
    else {
      this.allFields = attributeName;
    }
    console.log(this.allFields);

    if (groupName == "Data Element Groups") {
      // getDataElementGroup();
      this.groupObject = "dataElementGroups";
      console.log("dataElementGroups selected");
    }
    else if (groupName == "Data Element") {
      // getDataElement();
      this.groupObject = "dataElements";
      console.log("dataElements selected");
    }
    else if (groupName == "Indicators Groups") {
      // getIndicatorGroups();
      this.groupObject = "indicatorGroups";
      console.log("indicatorGroups selected")
    }
    else if (groupName == "Indicators") {
      // getIndicators();
      this.groupObject = "indicators";
      console.log("indicators selected");
    }
    else if (groupName == "Organisation Units") {
      // getorganisationUnits();
      this.groupObject = "organisationUnits";
      console.log("organisationUnits selected")
    }
    else if (groupName == "Organisation Unit groups") {
      // getOrgGroup();
      this.groupObject = "organisationUnitGroups";
      console.log("organisationUnitGroups selected")
    }
    else if (groupName == "Users Groups") {
      // getUserGroup();
      this.groupObject = "userGroups";
      console.log("userGroups selected")
    }
    else if (groupName == "Users") {
      // getUsers();
      this.groupObject = "users";
      console.log("users selected");
    }
    this.getApi();

  }

  filterForeCasts(value) {
    if (value == "Please Select" || value == "" || value == undefined) {
      return this.btnDisable = true, this.btnDisable2 = true;
    }
    else {
      return this.btnDisable = false;
    }
  }

  filterForeCastsNew(value) {
    if (value == "limited") {
      return this.butDisabled = true, this.btnDisable2 = true;
    }
    else if (value == "All") {
      return this.butDisabled = false, this.btnDisable2 = false;
    }
  }

  filterForeCastsNew2(value) {
    if (value == "" || value == undefined) {
      return this.btnDisable2 = true;
    }
    else {
      return this.btnDisable2 = false;
    }
  }

  getApi() {
    this.http.get("../../" + this.groupObject + ".json?fields=[" + this.allFields + "]&paging=false").subscribe((res: any[]) => {
      console.log(res);
      this.respData = res;
    });
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  getData() {

    // this._customService.getAPI(groupObject, allFields)
    // .subscribe(data => {this.respData = data});
    // console.log(this.respData);

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.setAttribute("id", "myId");
    table.setAttribute( "style", "border: 2px solid black;border-collapse: collapse;background-color: #D6EAF8;");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);        // TABLE ROW.
    tr.setAttribute( "style", "border: 2px solid black;");

    for (var i = 0; i < this.allFields.length; i++) {
      var th = document.createElement("th");
      th.setAttribute( "style", "border: 2px solid black;text-align: center;");
      th.innerHTML = this.allFields[i];
      tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < this.respData[this.groupObject].length; i++) {

      tr = table.insertRow(-1);
      tr.setAttribute( "style", "border: 1px solid black;");

      for (var j = 0; j < this.allFields.length; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute( "style", "border: 1px solid black;");
        if (this.respData[this.groupObject][i][this.allFields[j]] == undefined || this.respData[this.groupObject][i][this.allFields[j]] == null || this.respData[this.groupObject][i][this.allFields[j]] == "") {
          tabCell.innerHTML = "--";
        }
        else {
          if (this.allFields[j] == "lastUpdated" || this.allFields[j] == "created") {
            var dateValue1 = this.respData[this.groupObject][i][this.allFields[j]];
            var dateValue2 = dateValue1.split("T");
            var dateValue = dateValue2[0];
            tabCell.innerHTML = dateValue;
          }
          else {
            tabCell.innerHTML = this.respData[this.groupObject][i][this.allFields[j]];
          }
        }
      }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("reporttable");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }

}
