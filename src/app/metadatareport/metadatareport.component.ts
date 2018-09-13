import { Component, OnInit, getDebugNode } from '@angular/core';
import * as x from 'src/app/CONSTANTS';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CustomService } from '../custom.service';
import 'rxjs/add/operator/timeout';


// export interface objectDetails {
//   id: any,
//   code: any
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
  public excelbutton: boolean = false;
  public theading: boolean = false;
  public expanded: boolean = false;
  public grpData: boolean = false;
  public selectedAttribute;
  public allPushDataLength = 0;

  selectedGroup = "Please Select";

  public selectedMetaDataGroup = "";
  public groupObject = "";
  public allFields = [];
  public allGroupFields = ['id', 'code', 'created', 'shortName', 'lastUpdated', 'name'];
  public allPush = [];
  public allData = [];
  public allUserObjectData = [];
  public allUserFinalObjectData = [];
  public returnedObjectValues = [];
  public responseData;
  public respData;
  public pathData;
  public hierarchy;
  public val;
  public grpVal;
  public groupObjectValue = "";


  constructor(private _customService: CustomService, private http: HttpClient) { }

  ngOnInit() {
    setTimeout(() => {
      var loader1 = document.getElementById("loader");
      loader1.setAttribute('style', 'visibility:hidden !important');
    }, 1000);
    this.http.get("../../organisationUnits.json?fields=id,name&paging=false").subscribe((res: any[]) => {
      console.log(res);
      this.pathData = res;
    });
  }

  public getReport(groupName, attributeName) {
    this.allPush = []; this.allFields = []; this.allUserFinalObjectData = [];
    this.theading = false; this.excelbutton = false;

    console.log(groupName);
    setTimeout(() => {
      var loader1 = document.getElementById("loader");
      loader1.setAttribute('style', 'visibility:visible !important');
    }, 1000);

    if (attributeName == "All") {
      this.allFields = [];
      this.allFields.push("id", "code", "name", "shortName", "created", "lastUpdated", "formName", "valueType", "domainType", "publicAccess");
    }
    else {
      this.allFields = attributeName;
    }
    console.log(this.allFields);

    if (groupName == "Data Elements Groups") {
      // getDataElementGroup();
      this.groupObject = "dataElementGroups";
      this.groupObjectValue = "dataElements";
      console.log("dataElementGroups selected");
    }
    else if (groupName == "Data Elements") {
      // getDataElement();
      this.groupObject = "dataElements";
      console.log("dataElements selected");
    }
    else if (groupName == "Indicators Groups") {
      // getIndicatorGroups();
      this.groupObject = "indicatorGroups";
      this.groupObjectValue = "indicators";
      console.log("indicatorGroups selected");
    }
    else if (groupName == "Indicators") {
      // getIndicators();
      this.groupObject = "indicators";
      console.log("indicators selected");
    }
    else if (groupName == "Organisation Units") {
      // getorganisationUnits();
      this.groupObject = "organisationUnits";
      this.allFields.push("path");
      console.log("organisationUnits selected");
    }
    else if (groupName == "Organisation Unit groups") {
      // getOrgGroup();
      this.groupObject = "organisationUnitGroups";
      this.groupObjectValue = "organisationUnits";
      console.log("organisationUnitGroups selected");
    }
    else if (groupName == "Users Groups") {
      // getUserGroup();
      this.groupObject = "userGroups";
      this.groupObjectValue = "users";
      console.log("userGroups selected");
    }
    else if (groupName == "Users") {
      // getUsers();
      this.groupObject = "users";
      console.log("users selected");
    }
    this.getApi();
    return groupName;
  }

  // Expand(expand) {
  //   if (expand == false) {
  //     this.expanded = true;
  //   }
  //   else {
  //     this.expanded = false;
  //   }
  //   return this.expanded;
  // }

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
    this.respData = undefined;
    if (this.groupObject == "dataElements" || this.groupObject == "indicators" || this.groupObject == "organisationUnits" || this.groupObject == "users") {
      this.http.get("../../" + this.groupObject + ".json?fields=[" + this.allFields + "]&paging=false").subscribe((res: any[]) => {
        console.log(res);
        this.respData = res;
      });
    }
    else if (this.groupObject == "organisationUnitGroups" || this.groupObject == "userGroups" || this.groupObject == "dataElementGroups" || this.groupObject == "indicatorGroups") {
      this.http.get("../../" + this.groupObject + ".json?fields=[" + this.allFields + "]," + this.groupObjectValue + "[" + this.allGroupFields + "]&paging=false").subscribe((res: any[]) => {
        console.log(res);
        this.respData = res;
      });
    }
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  exportExcel(selectedGroup) {
    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('reporttable');
    var table_html = table_div.outerHTML.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = selectedGroup + '.xls';
    a.click();
  }

  printFunc() {
    var divToPrint = document.getElementById("reporttable");
    var newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  }

  getData() {
    this.grpData = false;
    console.log(this.respData + "-" + this.groupObject);
    if (this.respData == undefined || this.respData == null || this.respData == "") {
      this.getApi();
    }
    else {
      var dataRows = this.respData[this.groupObject];

      for (var i = 0; i < dataRows.length; i++) {
        for (var j = 0; j < this.allFields.length; j++) {
          if (dataRows[i][this.allFields[j]] == undefined || dataRows[i][this.allFields[j]] == null || dataRows[i][this.allFields[j]] == "") {
            this.val = "--";
          }
          else {
            if (this.allFields[j] == "lastUpdated" || this.allFields[j] == "created") {
              var dateValue1 = dataRows[i][this.allFields[j]];
              var dateValue2 = dateValue1.split("T");
              var dateValue = dateValue2[0];
              this.val = dateValue;
            }
            else if (this.allFields[j] == "path") {
              var pathValue1 = dataRows[i][this.allFields[j]];
              var pathValue2 = pathValue1.split("/");
              var pathValue = this.getPath(pathValue2);
              this.val = pathValue;
            }
            else {
              this.val = dataRows[i][this.allFields[j]];
            }
          }
          //this.allData.push({ [this.allFields[j]]: this.val });
          this.allData.push(this.val);
        }
        this.allPush.push(this.allData);
        this.allData = [];
        this.allPushDataLength = this.allPush[0].length;
      }
      console.log(this.allPush);
    }
    for (var z = 0; z < this.allPush.length; z++) {
      this.allUserFinalObjectData = [];
      // this.returnedObjectValues = [];
      if (this.groupObject == "userGroups" || this.groupObject == "organisationUnitGroups" || this.groupObject == "dataElementGroups" || this.groupObject == "indicatorGroups") {
        this.grpData = true; this.expanded = false;
        if (dataRows[z][this.groupObjectValue]) {
          for (j = 0; j < dataRows[z][this.groupObjectValue].length; j++) {
            for (let k = 0; k < this.allGroupFields.length; k++) {
              if (dataRows[z][this.groupObjectValue][j][this.allGroupFields[k]] == undefined || dataRows[z][this.groupObjectValue][j][this.allGroupFields[k]] == null || dataRows[z][this.groupObjectValue][j][this.allGroupFields[k]] == "") {
                this.grpVal = "--";
              }
              else {
                if (this.allGroupFields[k] == "lastUpdated" || this.allGroupFields[k] == "created") {
                  var dateValue1 = dataRows[z][this.groupObjectValue][j][this.allGroupFields[k]];
                  var dateValue2 = dateValue1.split("T");
                  var dateValue = dateValue2[0];
                  this.grpVal = dateValue;
                }
                else {
                  this.grpVal = dataRows[z][this.groupObjectValue][j][this.allGroupFields[k]];
                }
              }
              this.allUserObjectData.push(this.grpVal);
            }
            
            this.allUserFinalObjectData.push(this.allUserObjectData);     
            this.allUserObjectData = [];
          }
       var grpMembers = this.getRecordsArray(this.allUserFinalObjectData);
      this.allPush[z].push(grpMembers);

        }

      }
    }

    
    setTimeout(() => {
      var loader1 = document.getElementById("loader");
      loader1.setAttribute('style', 'visibility:hidden !important');
      this.excelbutton = true;
      this.theading = true;
    }, 1000);
  }

  getRecordsArray(value){
    this.returnedObjectValues = value;

    return this.returnedObjectValues;
  }

  getPath(pathId) {
    let pathMap = [];
    this.hierarchy = "";
    for (let y = 0; y < pathId.length; y++) {
      for (let z = 0; z < this.pathData.organisationUnits.length; z++) {
        if (this.pathData.organisationUnits[z].id == pathId[y]) {
          pathMap.push(this.pathData.organisationUnits[z].name);
        }
      }
    }
    for (let i = pathMap.length - 1; i >= 0; i--) {
      this.hierarchy += pathMap[i] + "/";
    }
    return this.hierarchy;
  }
}
