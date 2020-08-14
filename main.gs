function doGet(e) {
   var ss = SpreadsheetApp.openById("1YG9oL_9bEprjN8d-cEIHtabp7JsbbtI-nlA2RHKgHXU");
   var sheet= "wilayah_indonesia";
  
   var output = ContentService.createTextOutput(),
   data = {};
  
   data = readData_(ss, sheet, e);
  
   var callback = e.parameters.callback;
   //var callback = null;
  
   if (callback === undefined) {
    output.setContent(JSON.stringify({status:'Success', data:data}));
   } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
   }
  
   output.setMimeType(ContentService.MimeType.JAVASCRIPT);
   //Logger.log(JSON.stringify(data))
   return output;
}

function readData_(ss, sheetname, e) {
    var level = e.parameter.level;
    var id    = e.parameter.id;
  
    if (typeof properties == "undefined") {
      properties = getHeaderRow_(ss, sheetname);
      properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
    }
    
    var rows = getDataRows_(ss, sheetname, level, id);
    var data = [];
    for (var r = 0, l = rows.length; r < l; r++) {
      var row = rows[r];
      var record = {};
      for (var p in properties) {
            record[properties[p]] = row[p];
      }
      data.push(record);
    }
    return data;
}

function getDataRows_(ss, sheetname, level, id) {
  var sh = ss.getSheetByName(sheetname);
  var first= 2;
  var last = 34;
  
  if(level=='kab'){
    first = 35;
    last  = 514;
  }
  
  if(level=='kec'){
    first = 515;
    last  = 7093;
  }
  
  if(level=='kel'){
    first = 7094;
    last  = sh.getLastRow()-1;
    
    if(typeof id == "undefined")
      return [];
  }
  
  data = sh.getRange(first, 1, last, sh.getLastColumn()).getValues();
  
  if(typeof id != "undefined"){
   return data.filter(function (r) {
        return r[1] == id
    });
  }
  
//  if(typeof query != "undefined"){
//    return data.filter(function (r) {
//        return r[2].indexOf(query.toUpperCase())
//    }); 
//  }
  return data;
}


function getHeaderRow_(ss, sheetname) {
  
    var sh = ss.getSheetByName(sheetname);
    return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  
}
