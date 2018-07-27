

var cellSumFunction = (function() {

    return {

        //sum function starts here
        sumReports: function() {
          var limit = $(".headt").index();
        $(".custom-table-div table").each(function (index) {
           $(this).find("tr").each(function (index) {
            var sum = 0;
            var flag = false;
            $(this).find("td").each(function (cellindex) {
             
              var value = 0;
              if ($(this)[0].innerText == "") {
                value = 0;
              }
              else {
                if($(this)[0].innerText.match(/^\d+$/)){
                  value = parseInt($(this)[0].innerText);
                }
                
              }
              if(!isNaN(value)){
                sum = sum + value;
                flag = true;
              }
             
            });
  
  
            if (flag && sum != 0) { 
              var cell = "<td>" + sum + "</td>";
              $(this).prepend(cell);
           }
          else if ($(this).hasClass("headt")) {
           var cell =  "<td><b>Total</b></td>";
            $(this).prepend(cell);
          }
          else if (!flag && index < limit) {
            var col = $(this).find("td:first").prop("colSpan");
            $(this).find("td:first").attr('colspan',col+1);
           }
          else {
            var cell = "<td></td>";
            $(this).prepend(cell);
          }
  
        });
          });

          //sum function ends here
      },
      sumReportsAll: function() {
        var REMOVE_TOTAL = [
          "bGnNmKSuZlw","ShLvZi45WYv","FN9wO5d2jmN","fyIza2Ggy2G","NVirEUvg4lE","i5doaVaayYN","YcywkvYogw3"
        ]
       
        var limit = $(".headt").index();
        $(".custom-all-tables-div table").each(function (index) {
          var id = $(this).attr('id');
          console.log(id);
          if(!REMOVE_TOTAL.includes(id)){
            $(this).find("tr").each(function (index) {
          var sum = 0;
            var flag = false;
            $(this).find("td").each(function (cellindex) {
             
              var value = 0;
              if ($(this)[0].innerText == "") {
                value = 0;
              }
              else {
                if($(this)[0].innerText.match(/^\d+$/)){
                  value = parseInt($(this)[0].innerText);
                }
              }
              if(!isNaN(value)){
                sum = sum + value;
                flag = true;
              }
             
            });
  
  
            if (flag && sum != 0) { 
              var cell = "<td>" + sum + "</td>";
              $(this).prepend(cell);
           }
          else if ($(this).hasClass("headt")) {
           var cell =  "<td><b>Total</b></td>";
            $(this).prepend(cell);
          }
          else if (!flag && index < limit) {
            var col = $(this).find("td:first").prop("colSpan");
            $(this).find("td:first").attr('colspan',col+1);
           }
          else {
            var cell = "<td></td>";
            $(this).prepend(cell);
          }
  
  
          });

        }
        });
          //sum function ends here
      },

      verticalSumReport : function(){
        $(".custom-table-div table tbody").each(function (indexTable) {
          var arrayLength = $(this).find("tr").first().children("td").length;
          var array = [];
          var countflag = true;
          // console.log(arrayLength);
          $(this).find("tr").each(function (indexRow) {
            var tdcount = $(this).children("td").length;
            // console.log(arrayLength);
            if(arrayLength == tdcount && countflag){
              $(this).find("td").each(function (indexCell) {
                var value = 0;
              // console.log($(this));
                  if($(this)[0].innerText.match(/^\d+$/)){
                    value = parseInt($(this)[0].innerText);
                  }
                  
               array.push(value);
              
              });  
              // console.log(array);
              countflag = false; 
            }
            else if(arrayLength == tdcount && !countflag){
              $(this).find("td").each(function (indexCell) {
                var value = 0;
                if ($(this)[0].innerText == "") {
                  value = 0;
                }
                else {
                  if($(this)[0].innerText.match(/^\d+$/)){
                    value = parseInt($(this)[0].innerText);
                  }
                  
                }
                if(!isNaN(value)){
                  array[indexCell] =   parseInt(array[indexCell]) + value; 
                }
                else{
                  array[indexCell] =   parseInt(array[indexCell]); 
                }
              

              });   
             // console.log(array);
            }
          });
          var newrow = "<tr>";
          for(var k in array){
          if(array.length-1 == k){ newrow += "<td><b>Total<b></td>";}
          else  {
            if(array[k]==0) newrow += "<td></td>"; 
            else newrow += "<td>"+ array[k] + "</td>";
          
            }
          }
          $(this).append(newrow+"</tr>");
        });
      },

      verticalSumReportAll : function(){

        var ADD_TOTAL = [
          "bGnNmKSuZlw","fyIza2Ggy2G","NVirEUvg4lE","vQeZkk8Fz2y","TKR665WfTQd","n71AgyCV7gp"
        ]

        $(".custom-all-tables-div table").each(function (indexTable) {
          var id = $(this).attr('id');
          console.log(id);
          if(ADD_TOTAL.includes(id)){
          var arrayLength = $(this).children("tbody").children("tr").first().children("td").length;
          var array = [];
          var countflag = true;
          // console.log(arrayLength);
          $(this).children("tbody").find("tr").each(function (indexRow) {
            var tdcount = $(this).children("td").length;
            // console.log(arrayLength);
            if(arrayLength == tdcount && countflag){
              $(this).find("td").each(function (indexCell) {
                var value = 0;
              // console.log($(this));
                  if($(this)[0].innerText.match(/^\d+$/)){
                    value = parseInt($(this)[0].innerText);
                  }
                  
               array.push(value);
              
              });  
              // console.log(array);
              countflag = false; 
            }
            else if(arrayLength == tdcount && !countflag){
              $(this).find("td").each(function (indexCell) {
                var value = 0;
                if ($(this)[0].innerText == "") {
                  value = 0;
                }
                else {
                  if($(this)[0].innerText.match(/^\d+$/)){
                    value = parseInt($(this)[0].innerText);
                  }
                  
                }
                if(!isNaN(value)){
                  array[indexCell] =   parseInt(array[indexCell]) + value; 
                }
                else{
                  array[indexCell] =   parseInt(array[indexCell]); 
                }
              

              });   
             // console.log(array);
            }
          });
          console.log(array);
          var newrow = "<tr>";
          for(var k in array){
          if(array.length-1 == k){ newrow += "<td><b>Total<b></td>";}
          else  {
            if(array[k]==0) newrow += "<td></td>"; 
            else newrow += "<td>"+ array[k] + "</td>";
          
            }
          }
          $(this).append(newrow+"</tr>");
        }
        });
      }
    }
  
  })(cellSumFunction||{})