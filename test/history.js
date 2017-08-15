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
  describe(`History API - ${webDriverBrowser.getPrettyName()}`, function() {
    this.timeout(20000);
    if (process.env.TRAVIS || process.env.RELEASE) {
      this.retries(4);
    }

    let driver;
    let testServer;
    let testServerUrl;

    before(function() {
      testServer = new TestServer();
      return testServer.startServer(path.join(__dirname, '..'), 8888)
      .then((portNumber) => {
        testServerUrl = `http://localhost:${portNumber}`;
      });
    });

    after(function() {
      testServer.killServer();
    });

    afterEach(function() {
      // Can take time to kill driver
      this.timeout(10000);

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

    it('should update when the back button is pressed', function() {
      return webDriverBrowser.getSeleniumDriver()
        .then((d) => {
          driver = d;
        })
        .then(() => {
          return driver.get(`${testServerUrl}/demo/`);
        })
        .then(waitForMode)
        .then(() => {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').getAttribute('is-overview');
          });
        })
        .then((isOVerviewMode) => {
          isOVerviewMode.should.equal('true');
        })
        .then(() => {
          return driver.executeScript(function() {
            const slide = document.querySelector('gf-slide');
            slide.click();
            return document.body.getAttribute('is-presenting');
          });
        })
        .then((isPresentingClassOnBody) => {
          isPresentingClassOnBody.should.equal('true');
        })
        .then(() => {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').getAttribute('is-presenting');
          });
        })
        .then((isPresentingMode) => {
          isPresentingMode.should.equal('true');
        })
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return window.location.hash === '#0';
            });
          });
        })
        .then(() => {
          return new ActionSequence(driver)
            .sendKeys(webdriver.Key.RIGHT)
            .perform();
        })
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return window.location.hash === '#1';
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').getAttribute('is-presenting');
          });
        })
        .then((isPresenting) => {
          isPresenting.should.equal('true');
        })
        .then(() => {
          return driver.navigate().back();
        })
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return window.location.hash === '#0';
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').getAttribute('is-presenting');
          });
        })
        .then((isPresenting) => {
          isPresenting.should.equal('true');
        }).then(() => {
          return driver.navigate().back();
        })
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return window.location.hash === '';
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return document.querySelector('gf-slide-container').getAttribute('is-overview');
          });
        })
        .then((isOverview) => {
          isOverview.should.equal('true');
        });
    });
  });
}

const discoverableBrowsers = seleniumAssistant.getLocalBrowsers();
discoverableBrowsers.forEach((webDriverBrowser) => {
  if (webDriverBrowser.getId() === 'opera' &&
    webDriverBrowser.getVersionNumber() <= 37) {
    // Opera 37 doesn't seem happy with web components
    return;
  }

  if (webDriverBrowser.getId() === 'firefox' &&
    webDriverBrowser.getVersionNumber() <= 47) {
    // There is a bug in FF 47 that prevents Marionette working - skipping;
    return;
  }

  if (webDriverBrowser.getId() !== 'chrome') {
    // TODO: Polyfill isn't working well.
    return;
  }

  addTestSuite(webDriverBrowser);
});
