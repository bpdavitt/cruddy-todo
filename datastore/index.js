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
  new Promise((resolve, reject) => {
    return fs.readdir(exports.dataDir, (err, filenames) => {
      if (err) {
        reject(err);
      } else {
        let result = [];
        if (filenames.length === 0) {
          return callback(null, result);
        }
        // console.log(filenames)
        for (let i = 0; i < filenames.length; i++) {
          filenames[i] = filenames[i].substring(0, 5);
          result.push(exports.readOne(filenames[i], (err, item) => {
            if (err) {
              console.log(`Error when reading file ${id} for readAll`);
              callback(err);
            } else {
              resolve(item);
              // console.log(result)
            }
          }));
        }
        console.log(result);
        Promise.all(result)
          .then(result => callback(null, result), err => callback(err))
          .catch(() => {
            console.log('Error when processing readAll');
          });
      }
    });
  });
};

exports.readOne = (id, callback) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(exports.dataDir, `/${id}.txt`), 'utf-8', (err, text) => {
      if (err) {
        callback(err);
        reject(err);
      } else {
        let result = {
          id: id,
          text: text
        };
        callback(null, result);
        resolve(result);
      }
    });
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `/${id}.txt`), 'utf-8', (err, oldText) => {
    if (err) {
      console.log('File not found while reading for update');
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `/${id}.txt`), text, (err) => {
        if (err) {
          console.log('Error while updating');
          callback(err);
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `/${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      console.log('File deleted');
      callback(null, 'File deleted');
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
