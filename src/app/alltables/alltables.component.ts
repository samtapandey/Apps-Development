import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { AjaxserviceService } from 'src/app/ajaxservice.service';
import 'node_modules/text-encoding'; 
import * as $ from 'jquery';
import * as x from 'src/app/CONSTANTS';
import 'src/app/Jsfiles/sum.js';
import { ExternalreportsService } from 'src/app/externalreports.service';
import { UtilityserviceService } from '../utilityservice.service';

declare var cellSumFunction: any;

@Component({
  selector: 'app-alltables',
  templateUrl: './alltables.component.html',
  styleUrls: ['./alltables.component.css']
})
export class AlltablesComponent{
ou: any;
pe: any;
ds: any;
dsArray: typearr[];
globalvar : boolean = false;
eventUid = [];
eLength = 0;
  constructor(private callingBridge: SharedService, private ajax: AjaxserviceService) { 
       //method service which gets selectedOrgUnit from orgunitlibrary
       this.callingBridge.ouandPeServiceMethod.subscribe(
        (params) => {
          if(this.ou != params[0] || this.pe != params[1]){
          this.globalvar = false;
          this.ou = params[0];
          this.pe = params[1];
          this.eventUid = [];
          $(".custom-all-tables-div").empty();
          var doc = '<div class="row" style="height:15cm;margin-top:500px;margin-left:170px;width:20cm"><div class="col"><div class="row" style="width:100%;text-align:center;height:30%;"><p style="min-width:100vw;text-align:center;font-size:34px">Information and Documentation Center – Ministry of Health</p></div><div class="row" style="width:100%;height:30%;"><img src="head-icon.png" style="margin-left:43%;height:150px;width:150px"/></div><div class="row" style="width:100%;text-align:center;height:20%;"><p style="min-width:100vw;text-align:center;font-size:28px">Orgunit : '+$("#selected-ou-name").text()+'</p></div><div class="row" style="width:100%;text-align:center;height:5%;"><p style="min-width:100vw;text-align:center;font-size:28px">Period : '+$("#selected-period-name").text()+'</p></div></div></div>';
        $('.custom-all-tables-div').append(doc);
          }
         this.displayReport(this.ou, this.pe);
        }
      );

      this.callingBridge.dsArrayServiceMethod.subscribe(
        (value) => {
          this.getAllDatasets(value);
        }
      );
  
  }

  getAllDatasets(rn){
      if (rn == "Ewarn Report") this.dsArray = x.DATASET_ID_EWARN_REPORT.map(x => x);
      if (rn == "PHC Report") this.dsArray = x.DATASETS_ID_PHC.map(x => x);
      if (rn == "Hospital Report") this.dsArray = x.DATASETS_ID_HOSPITAL.map(x => x);
      if (rn == "Medical Center") this.dsArray = x.DATASETS_ID_MEDICALCENTER.map(x => x);
  }

  displayReport(ou, pe) {
    var counter = 0;
    for(let k=0;k<this.dsArray.length;k++){
     this.ds = this.dsArray[k].id;
     if(!this.globalvar) {
    this.ajax.getDatasetHTML(ou, pe, this.ds).subscribe(res => {
      this.modifyReport(res,this.dsArray[counter].id);counter++;
       if(counter == this.dsArray.length-1 && !this.globalvar){
        //this.globalvar = true;
        this.getExternalReports();
         
        setTimeout(this.printFunction,6000,1);
        }
      
      });
    }
    else{
      this.printFunction(0);
      break;
    }
  }
  }

  getExternalReports(){
    var data;

    //report 1
    this.ajax.extrenalReport1(this.ou,this.pe).subscribe(res => {
      let utility = new ExternalreportsService();
      data = utility.er1(res);
      this.modifyReport(data,"0");
   });

   //report 2
   this.ajax.extrenalReport2(this.ou,this.pe).subscribe(res5 => {
      this.eventUid = [];
    var thead = "<table><thead><tr class='headt'><td colspan='8'>Report on the nutritional status of all children under five years of age registered with the PHC facility</td></tr><tr><td colspan='3'>Degree of Malnutrition</td><td rowspan='2'>Weight</td><td rowspan='2'>Height</td><td rowspan='2'>Age</td><td rowspan='2'>ID</td><td rowspan='2'>S. No.</td></tr><tr><td>C (Severe)</td><td>B (Moderate)</td><td>A (Mild)</td></tr></thead>";
    var tabledata = thead + "<tr>";
    var adddata = "";
    for(var i = 0;i<res5.rows.length;i++)
     {   
        var temp = 0; 
        temp = res5.rows[i][0];
        this.eventUid.push(temp);
        this.eLength = this.eventUid.length;
     }
     debugger
  if(this.eLength != 0 && this.eLength != undefined)
    {
      var count = 0;
      var len = this.eLength;
      var utill = new ExternalreportsService();
      for(var j = 0; j<this.eventUid.length;j++)
        {
          this.ajax.extrenalReportEvents(this.eventUid[j]).subscribe(resp => {
            count = count + 1;
          adddata = adddata + utill.er2(resp,count);
          if(count==len){
            console.log(tabledata);
            this.modifyReport(tabledata + adddata + "</table>", "0");
          }
          });
        }
      }
   });
   
   //report 3
   this.ajax.extrenalReport3(this.ou,this.pe).subscribe(res5 => {
      this.eventUid = [];
    var thead = "<table><thead><tr class='headt'><td colspan='8'>Report on the nutritional status of all pregnant women registered within the PHC facility</td></tr><tr><td colspan='3'>Malnutrition</td><td rowspan='2'>Weight</td><td rowspan='2'>Height</td><td rowspan='2'>Age</td><td rowspan='2'>ID</td><td rowspan='2'>S. No.</td></tr><tr><td>Underweight</td><td>Vitamin Deficiency</td><td>Obesity</td></tr></thead>";
    var tabledata = thead + "<tr>";
    var adddata = "";
    for(var i = 0;i<res5.rows.length;i++)
     {   
        var temp = 0; 
        temp = res5.rows[i][0];
        this.eventUid.push(temp);
        this.eLength = this.eventUid.length;
     }
     debugger
  if(this.eLength != 0 && this.eLength != undefined)
    {
      var count = 0;
      var len = this.eLength;
      var utill = new ExternalreportsService();
      for(var j = 0; j<this.eventUid.length;j++)
        {
          this.ajax.extrenalReportEvents(this.eventUid[j]).subscribe(resp => {
            count = count + 1;
          adddata = adddata + utill.er3(resp,count);
          if(count==len){
            console.log(tabledata);
            this.modifyReport(tabledata + adddata + "</table>", "0");
          }
          });
        }
      }
   });

    //report 4
    this.ajax.extrenalReport4(this.ou,this.pe).subscribe(res5 => {
      this.eventUid = [];
    var thead = "<table><thead><tr class='headt'><td colspan='8'>Report on the nutritional status of elderly population registered with the PHC facility</td></tr><tr><td colspan='3'>Malnutrition</td><td rowspan='2'>Weight</td><td rowspan='2'>Height</td><td rowspan='2'>Age</td><td rowspan='2'>ID</td><td rowspan='2'>S. No.</td></tr><tr><td>Underweight</td><td>Vitamin Deficiency</td><td>Obesity</td></tr></thead>";
    var tabledata = thead + "<tr>";
    var adddata = "";
    for(var i = 0;i<res5.rows.length;i++)
     {   
        var temp = 0; 
        temp = res5.rows[i][0];
        this.eventUid.push(temp);
        this.eLength = this.eventUid.length;
     }
     debugger
  if(this.eLength != 0 && this.eLength != undefined)
    {
      var count = 0;
      var len = this.eLength;
      var utill = new ExternalreportsService();
      for(var j = 0; j<this.eventUid.length;j++)
        {
          this.ajax.extrenalReportEvents(this.eventUid[j]).subscribe(resp => {
            count = count + 1;
          adddata = adddata + utill.er3(resp,count);
          if(count==len){
            console.log(tabledata);
            this.modifyReport(tabledata + adddata + "</table>", "0");
          }
          });
        }
      }
   });
}

  printFunction(i){ 
    if(!this.globalvar || i == 1){
     cellSumFunction.sumReportsAll();
     cellSumFunction.verticalSumReport();
    }
      $("#alltables").show();
      window.print();
      this.globalvar = true;     
      $('#alltables').hide();
     // $('body').not("#alltables").show(); 
  }
    modifyReport(domstr,dsid) {
      debugger
      var response = $.parseHTML(domstr);
      console.log(response[0]);
      $(response).attr('id' , dsid);
    $(".custom-all-tables-div").append(response);
   // $(".custom-all-tables-div table").attr("id", dsid);
    $(".custom-all-tables-div table").removeAttr("style");
    $(".custom-all-tables-div style").remove();
    $(".custom-all-tables-div table tr td span span").removeAttr("style");
    $(".custom-all-tables-div table tr td span").removeAttr("style");
    $(".custom-all-tables-div table tr td").removeAttr("style");
    $(".custom-all-tables-div table tr").removeAttr("style");
    $(".custom-all-tables-div table tr").removeAttr("height");
    $(".custom-all-tables-div table tr td").removeAttr("bgcolor");
    $(".custom-all-tables-div table tr td").removeAttr("height");
    $(".custom-all-tables-div table tr td").removeAttr("width");
    $(".custom-all-tables-div table").removeAttr("height");
    $(".custom-all-tables-div table").removeAttr("width");
    $(".custom-all-tables-div tr td").attr("style", "word-wrap:break-word;");
    $(".custom-all-tables-div thead tr td").attr("style", "text-align:center");
    $(".custom-all-tables-div table").addClass("table table-bordered");
    
    $(".custom-all-tables-div table").attr("style", "max-width:100% !important;" +
      "background-color:white !important;" +
      "text-align:right;transition: transform .2s;" +
      "");
   
    $('table td:has(p)').text(function () {
          return $(this).text()
    })
    $('table td:has(span)').text(function () {
      return $(this).text()
    })

  }

 
}

export interface typearr{
  id: any,
  name: any
}