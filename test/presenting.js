'use strict';

const path = require('path');
const webdriver = require('selenium-webdriver');
const ActionSequence = require('selenium-webdriver/lib/actions').ActionSequence;

require('chai').should();

const automatedBrowserTesting = require('sw-testing-helpers').automatedBrowserTesting;
const TestServer = require('sw-testing-helpers').TestServer;

function addTestSuite(webDriverBrowser) {
  describe(`Presenting Mode - ${webDriverBrowser.getPrettyName()}`, function() {
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
        driver.get(`${testServerUrl}/test/data/demo/#0`)
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

    it('should have a mode of presenting', function() {
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
            return document.body.classList.contains('is-presenting');
          });
        })
        .then(isPresentBodyClass => {
          isPresentBodyClass.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPresentMode => {
          isPresentMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to slide zero for negative bad slide number', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/#-1`)
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
            return document.body.classList.contains('is-presenting');
          });
        })
        .then(isPresentBodyClass => {
          isPresentBodyClass.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPresentMode => {
          isPresentMode.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.location.hash;
          });
        })
        .then(windowHash => {
          windowHash.should.equal('#0');
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to last slide for for positive bad slide number', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/#999`)
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
            return document.body.classList.contains('is-presenting');
          });
        })
        .then(isPresentBodyClass => {
          isPresentBodyClass.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPresentMode => {
          isPresentMode.should.equal(true);
        })
        .then(() => {
          return driver.executeScript(function() {
            const slides = document.querySelectorAll('gf-slide');
            return window.location.hash === '#' + (slides.length - 1);
          });
        })
        .then(correctHash => {
          correctHash.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to next slide on clicking right', function() {
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
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPrsentMode => {
          isPrsentMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to next slide on clicking up', function() {
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
             .sendKeys(webdriver.Key.UP)
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
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPrsentMode => {
          isPrsentMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to previous slide on clicking left', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/#2`)
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
             .sendKeys(webdriver.Key.LEFT)
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
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPrsentMode => {
          isPrsentMode.should.equal(true);
        })
        .then(() => {
          resolve();
        })
        .thenCatch(err => {
          reject(err);
        });
      });
    });

    it('should go to previous slide on clicking down', function() {
      return new Promise((resolve, reject) => {
        driver.get(`${testServerUrl}/test/data/demo/#2`)
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
             .sendKeys(webdriver.Key.DOWN)
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
            return window.GauntFace.SlideController.getMode() ===
              window.GauntFace.SlideController.MODE.PRESENT;
          });
        })
        .then(isPrsentMode => {
          isPrsentMode.should.equal(true);
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
