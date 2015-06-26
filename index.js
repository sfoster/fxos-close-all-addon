// This file is licensed under the
// Creative Commons Attribution-Share Alike 3.0 Unported license.
// http://creativecommons.org/licenses/by-sa/3.0/deed.en
(function() {
  'use strict';

  var app = {
    name: 'close-all-addon',
    buttonId: 'cards-view-close-all-btn',
    initialize: function() {
      var isInitialized = document.documentElement.dataset.closeAllInitialized;
      var taskManager = window.wrappedJSObject.appWindowManager.taskManager;
      this.debug(this.name + ': isInitialized: ', isInitialized);
      if (isInitialized) {
        this.uninitialize();
        setTimeout(this.initialize.bind(this));
        return;
      }
      this._showing = taskManager.isShown();
      this._closing = false;

      var container = document.getElementById('cards-view');
      if (container) {
        var btn = document.createElement('button');
        btn.id = this.buttonId;
        container.appendChild(btn);
        document.documentElement.dataset.closeAllInitialized = true;

        document.getElementById(this.buttonId).addEventListener('click', this);
        window.addEventListener('cardviewshown', this);
        window.addEventListener('cardviewbeforeclose', this);
      } else {
        this.debug(this.name + ': failed to find task manager element to inject into');
        document.addEventListener('DOMContentLoaded', this.initialize.bind(this));
      }
    },
    uninitialize: function() {
      var btn = document.getElementById('show-windows-button');
      if (btn) {
        btn.removeEventListener('click', this);
        btn.remove();
      }
      window.removeEventListener('cardviewshown', this);
      window.removeEventListener('cardviewbeforeclose', this);
      delete document.documentElement.dataset.closeAllInitialized;
      this._closing = false;
      this._showing = false;
    },
    handleEvent: function(evt) {
      switch(evt.type) {
        case 'cardviewshown':
          this._showing = true;
          break;
        case 'cardviewbeforeclose':
          this._showing = false;
          break;
        case 'click':
          if (evt.target.id === this.buttonId &&
              this._showing && !this._closing) {
            this.closeAllCards();
          }
          break;
      }
    },
    closeAllCards: function() {
      this._closing = true;
      var taskManager = window.wrappedJSObject.appWindowManager.taskManager;
      var cards = Array.from(taskManager.cardsList.children).map(function(elem) {
        return taskManager.getCardForElement(elem);
      });
      var openCount = cards.length;
      var closedCount = 0;
      var self = this;
      function next() {
        var card = cards.pop();
        window.removeEventListener('appterminated', next);
        if (self._showing && card) {
          if (card.app.killable()) {
            window.addEventListener('appterminated', next);
            closedCount++;
            self.debug(self.name + ': kill %s (%s/%s)', card.title, closedCount, openCount);
            card.killApp();
          } else {
            setTimeout(next);
          }
        } else {
          self._closing = false;
        }
      }
      next();
    },
    debug: function() {
      var cons = window.console || window.wrappedJSObject.console;
      cons.log.apply(cons,arguments);
    }
  };

  app.initialize();
}());
