const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id;
  counter.getNextUniqueId((err, string)=> {
    if (err) {
      console.log('Sorry, you failed');
      return;
    }
    id = string;
    let item = {id: text};
    // when not testing path should be /data/${id}.txt
    fs.writeFile(path.join(exports.dataDir, `/${id}.txt`), text, (err) => {
      if (err) {
        throw ('error writing new todo list item');
      } else {
        // callback(null, counterString);
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  new Promise((resolve, reject) => {
    return fs.readdir(exports.dataDir, (err, filenames) => {
      if (err) {
        reject(err);
      } else {
        for (let i = 0; i < filenames.length; i++) {
          filenames[i] = filenames[i].substring(0, 5);
        }
        callback(null, filenames);
        resolve(filenames);
      }
    });
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  new Promise((resolve, reject) => {
    return fs.readFile(path.join(exports.dataDir, `/${id}.txt`), 'utf-8', (err, text) => {
      if (err) {
        // console.log('Someone readOne wrong');
        callback(err);
        reject();
      } else {
        let result = {
          'id': id,
          'text': text
        };
        callback(null, result);
        resolve(JSON.stringify(result));
      }
    });
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  const testFolder = './tests/';
  const fs = require('fs');
  // plans for tomorrow
  // fs.readdir(testFolder, (err, files) => {
  //   files.forEach(file => {
  //     console.log(file);
  //   });
  // });
  
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
