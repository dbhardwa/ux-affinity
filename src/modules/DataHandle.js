/*
  "DataHandle" Module:
    - works with the acquired excel data.
*/

import * as d3 from "d3";
import DataVisualization from './DataVisualization';


const DataHandle = {

  settings: {
    workbook: {},
    fileUploaded: false
  },

  getData: function(workbook) {
    this.settings.workbook = workbook;
    this.settings.fileUploaded = true;
    this.render()
    this.handleData();
  },

  handleData: function() {
    let workbook = this.settings.workbook;
    let codesData = formatCodesData(workbook);

    // Iterates through 'INTERVIEW' worksheets.
    for (let i = 1; i < workbook.SheetNames.length; i++) {
      let currentSheetName = 'Interview ' + i;

      workbook.SheetNames.forEach((sheetName) => {
        if (sheetName.includes(currentSheetName)) {
          let interviewWorksheet = workbook.Sheets[sheetName];
          let interviewData = formatInterviewData(interviewWorksheet)

          interviewData.forEach((piece) => {
            codesData.forEach((code) => {
              if (piece.id === code.id)
                code.scripts.push(piece);
            });
          });
        }
      });
    }

    // console.log(codesData);

    let testRootData = {
      text: 'THEME',
      scripts: codesData
    }

    DataVisualization.getData(testRootData);
  },

  render: function() {
    if (this.settings.fileUploaded) {
      d3.select('#fileInputFields')
        .remove();
    }
  }

}

export default DataHandle;



// Formats code data from 'CODES' worksheet.
function formatCodesData(workbook) {
  let codesWorksheet = workbook.Sheets['CODES'],
      codesData = [];

  for (let cell in codesWorksheet) {
    if (cell.includes('A')) {
      let cellNumber = cell.substring(1);

      codesData.push({
        text: codesWorksheet[cell].v,
        id: codesWorksheet['B' + cellNumber].v,
        scripts: []
      });
    }
  }

  return codesData;
}


// Takes in an interview worksheet and formats the data so it can be matched to it's code.
function formatInterviewData(worksheet) {
  let interviewData = [];

  for (let cell in worksheet) {
    if (cell.includes('A')) {
      let cellNumber = cell.substring(1);
      let userInfo = {USERID: '', NAME: ''}

      if (worksheet['B' + cellNumber] && worksheet['B' + cellNumber].v === 'INTRO') {
        // let tag = worksheet[cell].v.split(':')[0];
        // let value = worksheet[cell].v.split(':')[1];
        // userInfo.tag = value;
      } else if (worksheet['B' + cellNumber]) {
        interviewData.push({
          text: worksheet[cell].v,
          id: worksheet['B' + cellNumber].v,
          userInfo: userInfo
        });
      }
    }
  }

  return interviewData;
}











// NOTE(S):




// [
//   {
//     type: "introduction"
//   }
//   {
//     script: "Has to take public transit to get to work",
//     code: 1,
//     type: "script"
//   },
// ]

// An array that stores all CODES and their corresponding scripts (with specified user ID).
// [
//   {
//     code: "TEST CODE"
//     id: "1"
//     scripts: [
//       {
//         userid: '001',
//         name: 'Mubasher',
//         script: 'Has to take public transit to get to work'
//       },
//       {
//         id: '002',
//         name: 'Sam Sawyer',
//         script: 'Uses the metro and bus'
//       }
//     ]
//   },
//   {
//     code: "ANOTHER ONE"
//     id: "2"
//     scripts: [
//       {
//         userid: '003',
//         name: 'Devansh Bhardwaj',
//         script: 'Detests biking in snow'
//       }
//     ]
//   }
// ]
