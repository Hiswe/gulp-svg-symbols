import gulp from 'gulp';
import es from 'event-stream';
import test from 'ava';
import intercept from 'intercept-stdout';

import svgSymbols from '../index.js';
// import templates from '../lib/templates.js';

test.beforeEach( t => {
  t.context.stdout = [];
  t.context.unhookIntercept = intercept( txt => {
    t.context.stdout.push(txt);
    // mute stdout
    // https://github.com/sfarthin/intercept-stdout/issues/8#issuecomment-250521176
    return ``;
  });
});

test.afterEach(t => {
  t.context.unhookIntercept();
});

const title = `Warning`;

test.serial.cb( `${title} - className deprecation notice`, t => {
  gulp
    .src(`test/source/ios.svg`)
    .pipe(svgSymbols({className: `foobar`, }))
    .pipe(es.writeArray( (err, output) => {
      const messageRegex = /options\.className\sis\sdeprecated/;
      const warnMessage = t.context.stdout.find( e => messageRegex.test(e) );
      t.truthy( warnMessage, `has the className deprecation warning` );
      t.end();
    }));
});

test.serial.cb( `${title} - svgClassname deprecation notice`, t => {
  gulp
    .src(`test/source/ios.svg`)
    .pipe(svgSymbols({svgClassname: `foobar`, }))
    .pipe(es.writeArray( (err, output) => {
      const messageRegex = /options\.svgClassname\sis\sdeprecated/;
      const warnMessage = t.context.stdout.find( e => messageRegex.test(e) );
      t.truthy( warnMessage, `has the svgClassname deprecation warning` );
      t.end();
    }));
});

test.serial.cb( `${title} - Missing viewbox warning`, t => {
  gulp
    .src(`test/source/gradient.svg`)
    .pipe(svgSymbols())
    .pipe(es.writeArray( (err, output) => {
      const { stdout, } = t.context;
      const reasonRegex = /viewbox\smissing\sin\sfile/;
      const filenameRegex = /test\/source\/gradient\.svg/;
      const reasonMessage = stdout.find( e => reasonRegex.test(e) );
      const filenameMessage = stdout.find( e => filenameRegex.test(e) );
      t.truthy( reasonMessage, `has the missing viewbox warning` );
      t.truthy( filenameMessage, `has the right filename` );
      t.end();
    }));
});

test.serial.cb( `${title} - <mask> outside defs`, t => {
  gulp
    .src(`test/source/figma-mask-outside-defs.svg`)
    .pipe(svgSymbols())
    .pipe(es.writeArray( (err, output) => {
      const { stdout, } = t.context;
      const reasonRegex = /<mask>\stag\sfound\soutside\sa\s<defs>\stag/;
      const filenameRegex = /test\/source\/figma-mask-outside-defs\.svg/;
      const reasonMessage = stdout.find( e => reasonRegex.test(e) );
      const filenameMessage = stdout.find( e => filenameRegex.test(e) );
      t.truthy( reasonMessage, `has the mask warning` );
      t.truthy( filenameMessage, `has the right filename` );
      t.end();
    }));
});

test.serial.cb( `${title} - <clipPath> outside defs`, t => {
  gulp
    .src(`test/source/affinity-clip-path-outside-defs.svg`)
    .pipe(svgSymbols())
    .pipe(es.writeArray( (err, output) => {
      const { stdout, } = t.context;
      /* eslint-disable max-len */
      const reasonRegex = /<clipPath>\stag\sfound\soutside\sa\s<defs>\stag/;
      const filenameRegex = /test\/source\/affinity-clip-path-outside-defs\.svg/;
      const reasonMessage = stdout.find( e => reasonRegex.test(e) );
      const filenameMessage = stdout.find( e => filenameRegex.test(e) );
      /* eslint-enable max-len */
      t.truthy( reasonMessage, `has the mask warning` );
      t.truthy( filenameMessage, `has the right filename` );
      t.end();
    }));
});

test.serial.cb( `${title} - duplicated ids`, t => {
  gulp
    .src(`test/source/duplicated-defs-ids-*.svg`)
    .pipe(svgSymbols())
    .pipe(es.writeArray( (err, output) => {
      const { stdout, } = t.context;
      /* eslint-disable max-len */
      const reasonRegex = /<defs>\shas\ssome\sduplicated\sids:/;
      const firstDuplicatedRegex = /id\s“gradient-background”\sfound\sin\sdifferent\sfiles\s\(duplicated-defs-ids-1,\sduplicated-defs-ids-2\)/;
      const secondDuplicatedRegex = /id\s“shape-clip”\sfound\sin\sdifferent\sfiles\s\(duplicated-defs-ids-1,\sduplicated-defs-ids-2\)/;
      const reasonMessage = stdout.find( e => reasonRegex.test(e) );
      const firstDuplicatedMessage = stdout.find( e => firstDuplicatedRegex.test(e) );
      const secondDuplicatedMessage = stdout.find( e => secondDuplicatedRegex.test(e) );
      /* eslint-enable max-len */
      t.truthy( reasonMessage, `has the mask warning` );
      t.truthy( firstDuplicatedMessage, `has the right filename` );
      t.truthy( secondDuplicatedMessage, `has the right filename` );
      t.end();
    }));
});
