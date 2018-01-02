// var xlsx = require('node-xlsx');
// import fs = require('fs');
// var json = [{
//     name: 'sheet1',
//     data: [
//         [
//             'A',
//             'B'

//         ],
//         [
//             '1',
//             '2'
//         ]
//     ]
// }, {
//     name: 'sheet2',
//     data: [
//         [
//             'A',
//             'B'
//         ],
//         [
//             '3',
//             '4'
//         ]
//     ]
// }]

// var buffer = xlsx.build(json);
// fs.writeFile('c:/files/result.xlsx', buffer, function (err) {
//     if (err) throw err;
//     console.log('has finished');
// });  


import xlsx from 'node-xlsx';
import fs = require('fs');
// Or var xlsx = require('node-xlsx').default;

const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 3 } }; // A1:A4
const option = { '!merges': [range] };

var buffer = xlsx.build([{ name: "mySheetName", data: data }], option); // Returns a buffer
fs.writeFile('c:/files/result.xlsx', buffer, function (err) {
    if (err) throw err;
    console.log('has finished');
});  