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
      if (data.opperator[op].acceptAdress == undefined) data.opperator[op].acceptAdress = null;

      if (data.opperator[op].dependsOnpredecessor == undefined) data.opperator[op].dependsOnpredecessor = { Adress: null, offset: null };
      if (data.opperator[op].dependsOnpredecessor.Adress == undefined) data.opperator[op].dependsOnpredecessor.Adress = null;
      if (data.opperator[op].dependsOnpredecessor.offset == undefined) data.opperator[op].dependsOnpredecessor.offset = null;
      if (data.opperator[op].dependsOnpredecessor.waitFor == undefined) data.opperator[op].dependsOnpredecessor.waitFor = {};
      data.instruction.forEach((i) => {
        if (data.opperator[op].dependsOnpredecessor.waitFor[i] == undefined) data.opperator[op].dependsOnpredecessor.waitFor[i] = null;
      });

      if (data.opperator[op].dependsOnsuccessor == undefined) data.opperator[op].dependsOnsuccessor = { Adress: null, offset: null };
      if (data.opperator[op].dependsOnsuccessor.Adress == undefined) data.opperator[op].dependsOnsuccessor.Adress = null;
      if (data.opperator[op].dependsOnsuccessor.offset == undefined) data.opperator[op].dependsOnsuccessor.offset = null;
      if (data.opperator[op].dependsOnsuccessor.waitFor == undefined) data.opperator[op].dependsOnsuccessor.waitFor = {};
      data.instruction.forEach((i) => {
        if (data.opperator[op].dependsOnsuccessor.waitFor[i] == undefined) data.opperator[op].dependsOnsuccessor.waitFor[i] = null;
      });

      if (data.opperator[op].move == undefined || data.opperator[op].move == {}) {
        data.opperator[op].move = {};
        data.instruction.forEach((i) => {
          data.opperator[op].move[i] = 0;
        });
      }

      data.instruction.forEach((i) => {
        if (data.opperator[op].move[i] == undefined || data.opperator[op].move[i] == {}) {
          data.opperator[op].move[i] = 0;
        }
      });
    });

    file.JSON(data);
    file.sync();
    //console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(`The file '${fileName}' do not exists`);
  }
});
