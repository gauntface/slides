'use strict';

const seleniumAssistant = require('selenium-assistant');

console.log('Starting browser download...');
Promise.all([
  seleniumAssistant.downloadLocalBrowser('firefox', 'stable'),
  seleniumAssistant.downloadLocalBrowser('firefox', 'beta'),
  seleniumAssistant.downloadLocalBrowser('firefox', 'unstable'),
  seleniumAssistant.downloadLocalBrowser('chrome', 'stable'),
  seleniumAssistant.downloadLocalBrowser('chrome', 'beta'),
  seleniumAssistant.downloadLocalBrowser('chrome', 'unstable')
])
.then(function() {
  console.log('Browser download complete.');
})
.catch(function(err) {
  console.error('Unable to download browsers.', err);
  process.exit(1);
});
