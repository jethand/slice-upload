
const folderName = 'Uploads';

import path from 'path'
import fs from 'fs'
import child_process from 'child_process'
import os from 'os'
import concatfile from 'concat-files'

export const checkFolderExist = () => {
  return new Promise(resolve => {
    try {
      fs.stat(path.join(process.cwd(), folderName), (err, stats) => {
        if (err && err.code === 'ENOENT') {
          child_process.exec('chmod 777 -R' + process.cwd(), () => {
            child_process.exec('mkdir -p' + folderName, error => {
              if(err){
                resolve(false);
              }else{
                resolve(true);
              }
            });
          });
        }else{
          resolve(true);
        }
      });
  }
  catch (error) {
    console.log(error);
  }
  })
};
export const createWriteStream = (body, file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // 添加延迟的目的是，上传文件会在Temp文件生成临时文件，为了等待文件生成完成
      const readStream = fs.createReadStream(file.path);
      console.log(readStream.size);
      let filePath = path.join(process.cwd(), folderName) + `/${body.md5File}(${body.current}-${body.total})`;
      const writeStream = fs.createWriteStream(filePath);
      readStream.pipe(writeStream);
      /* readStream.on('end', function () {
        fs.unlinkSync(file.path);
      }); */
      readStream.on('error', (error) => {
        console.log('readStream error', error.message);
      })
      writeStream.on('error', function () {
        console.log(error);
      });
      resolve(true);
    }, 100);
  });
};
export const listDirFiles = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (data && data.length > 0 && data[0] === '.DS_Store') {
        data.splice(0, 1);
      }
      resolve(data);
    });
})
};
export const mergeFile = () => {
  return new Promise((resolve, reject) => {
    const dirname = process.cwd();
    listDirFiles(path.join(process.cwd(), folderName)).then(files => {
      const filesArr = files.map(itemFile => {
        return dirname + '/' + folderName + '/' + itemFile
      });
      concatfile(filesArr, path.join(dirname, folderName, '合并后的文件'), () => {
        resolve(true);
      });
    });
  });
};