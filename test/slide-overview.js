'use strict';

const path = require('path');
const webdriver = require('selenium-webdriver');
const ActionSequence = require('selenium-webdriver/lib/actions').ActionSequence;

require('geckodriver');
require('chromedriver');
require('chai').should();

const seleniumAssistant = require('selenium-assistant');
const TestServer = require('sw-testing-helpers').TestServer;

function addTestSuite(webDriverBrowser) {
  describe(`Overview Mode - ${webDriverBrowser.getPrettyName()}`, function() {
    this.timeout(20000);
    if (process.env.TRAVIS) {
      this.retries(4);
    }

    let driver;
    let testServer;
    let testServerUrl;

    before(function() {
      testServer = new TestServer();
      return testServer.startServer(path.join(__dirname, '..'), 8888)
      .then(portNumber => {
        testServerUrl = `http://localhost:${portNumber}`;
      });
    });

    after(function() {
      testServer.killServer();
    });

    beforeEach(function() {
      return webDriverBrowser.getSeleniumDriver()
      .then(d => {
        driver = d;
      });
    });

    afterEach(function() {
      return seleniumAssistant.killWebDriver(driver)
      .then(() => {
        driver = null;
      });
    });

    const waitForMode = () => {
      return driver.wait(function() {
        return driver.executeScript(function() {
          const container = document.querySelector('gf-slide-container');
          return container.hasAttribute('is-overview') ||
            container.hasAttribute('is-presenting');
        });
      });
    };

    it('should be able to open test page', function() {
      return driver.get(`${testServerUrl}/demo/`)
      .then(() => {
        return driver.wait(() => {
          return driver.executeScript(() => {
            return document.title === '<gf-slide>';
          });
        }, 1000);
      });
    });

    it('should have a mode of overview', function() {
      return driver.get(`${testServerUrl}/demo/`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.body.getAttribute('is-overview');
        });
      })
      .then(isOverviewClassOnBody => {
        isOverviewClassOnBody.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-overview');
        });
      });
    });

    it('should go to present mode after clicking a slide', function() {
      return driver.get(`${testServerUrl}/demo/`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          const slide = document.querySelector('gf-slide');
          slide.click();
          return document.body.getAttribute('is-presenting');
        });
      })
      .then(isPresentingClassOnBody => {
        isPresentingClassOnBody.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresentingMode => {
        isPresentingMode.should.equal('true');
      });
    });

    it('should go to overview mode from present on clicking escape', function() {
      return driver.get(`${testServerUrl}/demo/#0`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresentingMode => {
        isPresentingMode.should.equal('true');
      })
      .then(() => {
        return new ActionSequence(driver)
           .sendKeys(webdriver.Key.ESCAPE)
           .perform();
      })
      .then(() => {
        return driver.wait(function() {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').hasAttribute('is-overview');
          });
        });
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-overview');
        });
      })
      .then(isOverviewMode => {
        isOverviewMode.should.equal('true');
      });
    });
  });
}

const discoverableBrowsers = seleniumAssistant.getAvailableBrowsers();
discoverableBrowsers.forEach(webDriverBrowser => {
  if (webDriverBrowser.getSeleniumBrowserId() === 'opera' &&
    webDriverBrowser.getVersionNumber() <= 37) {
    // Opera 37 doesn't seem happy with web components
    return;
  }

  if (webDriverBrowser.getSeleniumBrowserId() === 'firefox' &&
    webDriverBrowser.getVersionNumber() <= 47) {
    // There is a bug in FF 47 that prevents Marionette working - skipping;
    return;
  }

  if (webDriverBrowser.getSeleniumBrowserId() !== 'chrome') {
    // TODO: Polyfill isn't working well.
    return;
  }

  addTestSuite(webDriverBrowser);
});
