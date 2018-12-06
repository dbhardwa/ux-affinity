/*
  "FileInput" Module:
    - accepts excel sheet as drag-and-drop or manual upload.
    - parses the workbook and returns an object of the spreadsheet data.
*/

import * as d3 from "d3";
import XLSX from 'xlsx';
import DataHandle from './DataHandle';


const FileInput = {

  init: function() {
    this.render();
  },

  handleFileUpload: function() {
    let file = this.files[0],
        reader = new FileReader();

    // FileReader instance parses raw file.
    reader.readAsBinaryString(file);

    // Triggers when reader has read the file.
    reader.onload = function(e) {
      let data = e.target.result;
      // XLSX parses raw cryptic data.
      let workbook = XLSX.read(data, {type: 'binary'});

      console.log(workbook);
      // Passes workbook object on to DataHandle module to be properly organized.
      DataHandle.getData(workbook);
    };
  },

  render: function() {
    let fileInput = d3.select('#fileInputFields')
                      .append('input')
                      .attr('type', 'file')
                      .attr('id', 'fileInput')
                      .on('change', this.handleFileUpload); // This is for binding.
  }

}

export default FileInput;
