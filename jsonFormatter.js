const JSONdb = require("simple-json-db");
const fs = require("fs");
const path = require("path");

const existingFiles = ["x86", "CISC"];
const cpath = path.join(__dirname, "src/logic");

existingFiles.forEach((fileName) => {
  console.log(`checking: ${fileName}`);
  console.log(`path: ${cpath}\\${fileName}.json`);

  if (fs.existsSync(`${cpath}\\${fileName}.json`)) {
    const file = new JSONdb(`${cpath}\\${fileName}.json`);
    let data = file.JSON();
    Object.keys(data.opperator).forEach((op) => {
      if (data.opperator[op].hasSuffix == undefined) data.opperator[op].hasSuffix = [];
      if (data.opperator[op].hasPrefix == undefined) data.opperator[op].hasPrefix = [];

      if (data.opperator[op].waitFor == undefined) data.opperator[op].waitFor = {};
      data.instruction.forEach((i) => {
        if (data.opperator[op].waitFor[i] == undefined) data.opperator[op].waitFor[i] = null;
      });

      if (data.opperator[op].duration == undefined || data.opperator[op].duration == {}) {
        data.opperator[op].duration = {};
        data.instruction.forEach((i) => {
          data.opperator[op].duration[i] = 0;
        });
      }
    });

    file.JSON(data);
    file.sync();
  } else {
    console.log(`The file '${fileName}' do not exists`);
  }
});
