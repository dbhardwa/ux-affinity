import "./scss/main.scss";
import * as d3 from "d3";
import XLSX from 'xlsx';

let fileInput = d3.select('body')
                  .append('input')
                  .attr('type', 'file')
                  .attr('id', 'fileInput')
                  .on('change', handleFileUpload, false);


function handleFileUpload() {
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
  };
}
