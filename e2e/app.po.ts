import { browser, element, by } from 'protractor/globals';

export class PonyracerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('pr-root h1')).getText();
  }
}
