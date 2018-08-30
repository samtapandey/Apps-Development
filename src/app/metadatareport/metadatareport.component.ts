import { Component, OnInit } from '@angular/core';
import * as x from 'src/app/CONSTANTS';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  public selectedMetaDataGroup = "";

  constructor() { }

  ngOnInit() {
  }

  public getReport(event) {
    alert('Group ' + event.target);
  }

  filterForeCasts(value) {
    // alert(value);
    if (value == "Please Select" || value == "" || value == undefined) {
      return true;
    }
    else {
      return false;
    }
  }
}
