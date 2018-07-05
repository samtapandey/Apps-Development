import { Injectable } from '@angular/core';
import { AjaxserviceService } from './ajaxservice.service';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ExternalreportsService {

  constructor() { }
 
  data = "";
 

  er2main(res4,count){
  
    var value1 = 0;
    var temp1_value2 = "";
    var temp2_value2 = "";
    var value2 = "";
    var value3 = "";
    var value4 = "";
    var temp1_value567 = '';
    var value5 = '';
    var value6 = '';
    var value7 = '';
        for(var j = 0; j<res4.dataValues.length; j++)
        {

            if (res4.dataValues[j].dataElement == 'sm6rhE9y9cn') 
            {
                value1 =res4.dataValues[j].value;
            }
           else if (res4.dataValues[j].dataElement == 'hDPezniOnwQ') 
            {
                temp1_value2 =res4.dataValues[j].value;
            }
            else if (res4.dataValues[j].dataElement == 'uimufzGdwwj') 
            {
                temp2_value2 =res4.dataValues[j].value;
            }
           else if (res4.dataValues[j].dataElement == 'yyn9Xy91k3u') 
            {
                value3 =res4.dataValues[j].value;
            }
           else if (res4.dataValues[j].dataElement == 'AoDeAFlDyCC') 
            {
                value4 =res4.dataValues[j].value;
            }
            else if (res4.dataValues[j].dataElement == 'uneKxjdwTQt') 
            {                    
                temp1_value567 = res4.dataValues[j].value;                
            }
            else if (temp1_value567 == 'Mild') 
            {                    
                value5 = 'Yes';   
                value6 = ''
                value7 = '';   
            }
            else if (temp1_value567 == 'Moderate') 
            {                    
                value5 = '';   
                value6 = 'Yes'
                value7 = '';   
            }
            else if (temp1_value567 == 'Severe') 
            {                    
                value5 = '';   
                value6 = ''
                value7 = 'Yes';   
            }
            else if(temp1_value2 == "" || temp2_value2 != "")
            {
                value2 = temp2_value2+" months";
            }
            else if(temp1_value2 != "" || temp2_value2 == "")
            {
                value2 = temp1_value2+" years";
            }
            else if(temp1_value2 == "" || temp2_value2 == "")
            {
                value2 = "";
            }
            else if(temp1_value2 != "" || temp2_value2 != "")
            {
                value2 = temp1_value2+" years"+temp2_value2+" months";
            }
            
        }

       var data = '<td>'+value7+'</td><td>'+value6+'</td><td>'+value5+'</td><td>'+value4+'</td><td>'+value3+'</td><td>'+value2+'</td><td>'+value1+'</td><td>'+count+'</td></tr>';
       
          return data;
  }

  er1(response) {
             
    var value1 = this.datavalue(response,'WtfVifSU2Ai');
    var value2 = this.datavalue(response,'UU8umBgSEQh');
    var value3 = this.datavalue(response,'Sg59a7l8SaM');
    var value4 = this.datavalue(response,'lYlmBU9D1hb');
    var value5 = this.datavalue(response,'ShfbN9bWSNR');
    var value6 = this.datavalue(response,'DR1wMYGMdJO');
    var value7 = this.datavalue(response,'VFmOJP8mWGL');
    var value8 = this.datavalue(response,'MoLEI8oADoU');
    var value9 = this.datavalue(response,'lnk4xZbjb57');
    var value10 = this.datavalue(response,'rpgEFkPOzdM');
    var value11 = this.datavalue(response,'eMyLXuvjQpY');
    var value12 = this.datavalue(response,'SOVwX7rreHs');
    var value13 = this.datavalue(response,'RWzaSEzzOFV');
    var value14 = this.datavalue(response,'z3KodlNdN7q');
    var value15 = this.datavalue(response,'rpFCV9LHEHz');
    var value16 = this.datavalue(response,'MuKEN1itOv0');
    var value17 = this.datavalue(response,'MGqh8GuU91p');
    var value18 = this.datavalue(response,'ks1EPfFG4xM');
    var value19 = this.datavalue(response,'EIYAuWcXSQc');
    var value20 = this.datavalue(response,'MOi1AUjSSEo');
    var value21 = this.datavalue(response,'E82SfFcIgOV');
    var value22 = this.datavalue(response,'BKDoyXKeGN6');
    var value23 = this.datavalue(response,'eYGVpV4Ozwk');
    var value24 = this.datavalue(response,'e61NNT1d8QT');
    var value25 = this.datavalue(response,'DNvxp9a63q2');
    var value26 = this.datavalue(response,'zlqokFy4Hax');
    var value27 = this.datavalue(response,'Z0k1zEJ1nZQ');
    var value28 = this.datavalue(response,'G4OYaFJJgjV');
    var value29 = this.datavalue(response,'hPh2Zt2Q3aU');
    var value30 = this.datavalue(response,'mVQ0rggrmem');
    var value31 = this.datavalue(response,'mDXxQD59bW1');
    var value32 = this.datavalue(response,'rvfNtKKXKdj');  

    var tot_row1 = value1+value5+value9+value13+value17+value21+value25+value29;
    var tot_row2 = value2+value6+value10+value14+value18+value22+value26+value30;
    var tot_row3 = value3+value7+value11+value15+value19+value23+value27+value31;
    var tot_row4 = value4+value8+value12+value16+value20+value24+value28+value32; 
    
    var thead = "<table><thead><tr><td colspan='5'>Monthly Report on Children Nutrition and Degrees of Malnutrition</td></tr><tr><td colspan='5'>Nutrition Type</td></tr><tr class='headt'><td>Number of Children</td><td>Natural Breastfeeding</td><td>Bottle Feeding</td><td>Feeding Solids</td><td>Child Age in Months	</td></tr></thead>";

    var tabledata = thead + '<tr><td>'+value1+'</td><td>'+value2+'</td><td>'+value3+'</td><td>'+value4+'</td><td style="font:bold;">0 -  3</td></tr><tr><td>'+value5+'</td><td>'+value6+'</td><td>'+value7+'</td><td>'+value8+'</td><td style="font:bold;">3 - 6</td></tr><tr><td>'+value9+'</td><td>'+value10+'</td><td>'+value11+'</td><td>'+value12+'</td><td style="font:bold;">6 - 9</td></tr><tr><td>'+value13+'</td><td>'+value14+'</td><td>'+value15+'</td><td>'+value16+'</td><td style="font:bold;">9 - 12</td></tr><tr><td>'+value17+'</td><td>'+value18+'</td><td>'+value19+'</td><td>'+value20+'</td><td style="font:bold;">12 - 18</td></tr><tr><td>'+value21+'</td><td>'+value22+'</td><td>'+value23+'</td><td>'+value24+'</td><td style="font:bold;">18  - 24</td></tr><tr><td>'+value25+'</td><td>'+value26+'</td><td>'+value27+'</td><td>'+value28+'</td><td style="font:bold;">24  -  36</td></tr><tr><td>'+value29+'</td><td>'+value30+'</td><td>'+value31+'</td><td>'+value32+'</td><td style="font:bold;">36 - 60</td></tr><tr><td>'+tot_row1+'</td><td>'+tot_row2+'</td><td>'+tot_row3+'</td><td>'+tot_row4+'</td><td style="font:bold;">Total</td></tr></table>';

    return tabledata;
  };

  datavalue(dataJSON, id) {
    var value1 = 0;
    for (var i = 0; i < dataJSON.rows.length; i++) {
        if (dataJSON.rows[i][0] == id) {
            value1 = parseInt(dataJSON.rows[i][2]);
        }
    }
    return (value1);
  };

  er2(res4) {
   
};

  arraySorting(a, b) {
    return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
  };
}
