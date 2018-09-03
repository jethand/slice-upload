import Koa from 'koa';
const app = new Koa();
import routerF from 'koa-router';
const router = routerF();
import fs from 'fs';
import bodyParser from 'koa-body'
import { checkFolderExist, createWriteStream, mergeFile} from './utils';
import path from 'path';
const folderName = 'Uploads';

app.use(bodyParser({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}));
app.use( router.routes()).use(router.allowedMethods() );

app.use(async ctx => {
  ctx.body = 'Hello World';
});

router.get('/', async function (ctx) {
  ctx.response.redirect('/upload-page');
});
router.get('/upload-page', function(ctx){
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./upload-page.html');
});

router.post('/upload', async function(ctx){
  const fileBody = ctx.request.body;
  const fileInfo = ctx.request.files.file;
  const folderExist = await checkFolderExist();
  if (folderExist) {
    const result = await createWriteStream(fileBody, fileInfo);
    if (result) {
      ctx.body = {
        errorCode: 0,
        errorMsg: `${fileBody.fileName} chunk ${fileBody.current} upload success!`,
        data: {
          current: fileBody.current
        }
      };
    }
  }
});
router.post('/upload-merge', async function(ctx){
  const mergeResult = await mergeFile();
  if (mergeResult) {
    ctx.body = {
      errorCode: 0,
      errorMsg: `merge success!`,
    };
  }
});
app.listen(3000);
