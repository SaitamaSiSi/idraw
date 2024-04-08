const fs = require('fs');
const path = require('path');
const assert = require('assert');
const jimp = require('jimp');
const pixelmatch = require('pixelmatch');
const pngjs = require('pngjs');
const { delay } = require('./../scripts/util/time');
const { pageList } = require('./../scripts/screen.config');
const { createScreenshot } = require('../scripts/util/screen');

const snapshotDir = path.join(__dirname, 'snapshot');
const diffDir = path.join(__dirname, 'diff');
const testResultDir = path.join(__dirname, 'test-result');
const { PNG } = pngjs;

async function diff() {
  const middlewares = [];
  const diffRateList = [];
  pageList.forEach((p, i) => {
    middlewares.push(async (ctx = {}, next) => {
      const { page, port } = ctx;
      const width = p.w;
      const height = p.h;

      await page.setViewport( { width: p.w, height: p.h } );
      const pageUrl = `http://127.0.0.1:${port}/examples/${p.path || ''}`;
      await page.goto(pageUrl);
      await delay(p.delay || 100);
      const buf = await page.screenshot();
      
      const snapshotPicPath = parsePicPath(path.join(snapshotDir, p.path));
      const actual = (await jimp.read(buf)).scale(1).quality(100).bitmap;
      const expected = (await jimp.read(fs.readFileSync(snapshotPicPath))).bitmap;
      const diffBuf = new PNG({ width, height });
      const failedPixel = pixelmatch(expected.data, actual.data, diffBuf.data, actual.width, actual.height);
      const failRate = failedPixel / (width * height);
      if (failRate > 0) {
        (await jimp.read(actual)).scale(1).quality(100).write(parsePicPath(path.join(testResultDir, p.path)));
        (await jimp.read(diffBuf)).scale(1).quality(100).write(parsePicPath(path.join(diffDir, p.path)));
      }
      diffRateList.push({
        path: p.path,
        rate: failRate,
      });
      console.log(`[${i+1}/${pageList.length}] E2E Testing: ${p.path} | diff: ${failRate}`)
      await next();
    });
  });
  await createScreenshot(middlewares, { baseDir: path.join(__dirname, '..') });
  return diffRateList; 
}

function parsePicPath(pagePath) {
  // const picPath = pagePath.replace(/\.html$/, '.jpg');
  const picPath = pagePath + '.jpg';
  return picPath;
}



describe('Screenshot testing', function() {
  it('testing...', function(done){
    this.timeout(1000 * 60 * 2);
    diff().then((rateList) => {
      
      assert.ok(Array.isArray(rateList));
      assert.ok(rateList.length > 0);
      rateList.forEach((data) => {
        // console.log(`${data.path}]diff-rate: ${data.rate}`, );
        assert.ok(data.rate < 0.04);
      });

      done();
    }).catch(done);
  });
});