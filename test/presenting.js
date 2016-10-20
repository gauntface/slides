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
  describe(`Presenting Mode - ${webDriverBrowser.getPrettyName()}`, function() {
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
      this.timeout(4000);
      return seleniumAssistant.killWebDriver(driver);
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
      return driver.get(`${testServerUrl}/demo/#0`)
      .then(() => {
        return driver.wait(() => {
          return driver.executeScript(() => {
            return document.title === '<gf-slide>';
          });
        }, 1000);
      });
    });

    it('should have a mode of presenting', function() {
      return driver.get(`${testServerUrl}/demo/#0`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.body.getAttribute('is-presenting');
        });
      })
      .then(isBodyPresenting => {
        isBodyPresenting.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
      });
    });

    it('should go to slide zero for negative bad slide number', function() {
      return driver.get(`${testServerUrl}/demo/#-1`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.body.getAttribute('is-presenting');
        });
      })
      .then(isBodyPresenting => {
        isBodyPresenting.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return window.location.hash;
        });
      })
      .then(windowHash => {
        windowHash.should.equal('#0');
      });
    });

    it('should go to last slide for for positive bad slide number', function() {
      return driver.get(`${testServerUrl}/demo/#999`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.body.getAttribute('is-presenting');
        });
      })
      .then(isBodyPresenting => {
        isBodyPresenting.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
      })
      .then(() => {
        return driver.executeScript(function() {
          const slides = document.querySelectorAll('gf-slide');
          return window.location.hash === '#' + (slides.length - 1);
        });
      })
      .then(correctHash => {
        correctHash.should.equal(true);
      });
    });

    it('should go to next slide on clicking right', function() {
      return driver.get(`${testServerUrl}/demo/#0`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
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
      .then(isPresenting => {
        isPresenting.should.equal('true');
      });
    });

    it('should go to next slide on clicking up', function() {
      return driver.get(`${testServerUrl}/demo/#0`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
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
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
      });
    });

    it('should go to previous slide on clicking left', function() {
      return driver.get(`${testServerUrl}/demo/#2`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
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
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
      });
    });

    it('should go to previous slide on clicking down', function() {
      return driver.get(`${testServerUrl}/demo/#2`)
      .then(waitForMode)
      .then(() => {
        return driver.executeScript(function() {
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
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
          return document.querySelector('gf-slide-container').getAttribute('is-presenting');
        });
      })
      .then(isPresenting => {
        isPresenting.should.equal('true');
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
