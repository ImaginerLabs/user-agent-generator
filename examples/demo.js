const { generateUserAgent } = require('../dist');

console.log('Chrome + Mac（带 meta）:');
console.dir(generateUserAgent({ browser: 'chrome', device: 'mac', count: 2, withMeta: true }), {
  depth: null,
});

console.log('Safari + iPhone:');
console.dir(generateUserAgent({ browser: 'safari', device: 'iphone' }), { depth: null });

console.log('Firefox + Windows（带 meta）:');
console.dir(generateUserAgent({ browser: 'firefox', device: 'windows', withMeta: true }), {
  depth: null,
});
