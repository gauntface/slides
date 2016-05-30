'use strict';

const path = require('path');
const webdriver = require('selenium-webdriver');
const ActionSequence = require('selenium-webdriver/lib/actions').ActionSequence;

require('chai').should();

const automatedBrowserTesting = require('sw-testing-helpers').automatedBrowserTesting;
const TestServer = require('sw-testing-helpers').TestServer;

function addTestSuite(webDriverBrowser) {
  describe(`Overview Mode - ${webDriverBrowser.getPrettyName()}`, function() {
    this.timeout(20000);

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
      driver = webDriverBrowser.getSeleniumDriver();
    });

    afterEach(function() {
      this.timeout(4000);
      return automatedBrowserTesting.killWebDriver(driver);
    });

    it('should be able to open test page', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/`)
        .then(() => {
          driver.wait(webdriver.until.titleIs('Demo 1'), 1000);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should have a mode of overview', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/`)
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return (typeof window.GauntFace !== 'undefined') &&
                (typeof window.GauntFace.SlideController !== 'undefined');
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return document.body.classList.contains('is-overview');
          });
        })
        .then(isOverviewClassOnBody => {
          isOverviewClassOnBody.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.OVERVIEW;
          });
        })
        .then(isOverviewMode => {
          isOverviewMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to present mode after clicking a slide', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/`)
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return (typeof window.GauntFace !== 'undefined') &&
                (typeof window.GauntFace.SlideController !== 'undefined');
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            const slide = document.querySelector('gf-slide');
            slide.click();
            return document.body.classList.contains('is-presenting');
          });
        })
        .then(isPresentingClassOnBody => {
          isPresentingClassOnBody.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPresentingMode => {
          isPresentingMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to overview mode from present on clicking exit', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/#0`)
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return (typeof window.GauntFace !== 'undefined') &&
                (typeof window.GauntFace.SlideController !== 'undefined');
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPresentingMode => {
          isPresentingMode.should.equal(true);
        })
        .then(() => {
          return new ActionSequence(driver)
             .sendKeys(webdriver.Key.ESCAPE)
             .perform();
        })
        .then(() => {
          return driver.wait(function() {
            return driver.executeScript(function() {
              return document.body.classList.contains('is-overview');
            });
          });
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.OVERVIEW;
          });
        })
        .then(isOverviewMode => {
          isOverviewMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });
  });
}

const discoverableBrowsers = automatedBrowserTesting.getDiscoverableBrowsers();
discoverableBrowsers.forEach(webDriverBrowser => {
  if (webDriverBrowser.getSeleniumBrowserId() !== 'chrome') {
    return;
  }

  addTestSuite(webDriverBrowser);
});
