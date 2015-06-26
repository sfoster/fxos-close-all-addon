// This file is licensed under the
// Creative Commons Attribution-Share Alike 3.0 Unported license.
// http://creativecommons.org/licenses/by-sa/3.0/deed.en
(function() {
  'use strict';

  var app = {
    name: 'close-all-addon',
    initialize: function() {
      var isInitialized = document.documentElement.dataset.closeAllInitialized;
      this.debug(this.name + ': initialize, isInitialized: ', isInitialized);
      if (isInitialized) {
        return;
      }
      var container = document.getElementById('cards-view');
      if (container) {
        var btn = document.createElement('button');
        btn.id = 'close-all-btn';
        container.appendChild(btn);
        document.documentElement.dataset.closeAllInitialized = true;
      } else {
        document.
        this.debug(this.name + ': failed to find task manager element to inject into');
      }
      this.registerListeners();
    },
    registerListeners: function() {
      document.getElementById('close-all-btn').addEventListener('click', this);
      window.addEventListener('cardviewshown', this);
      window.addEventListener('cardviewbeforeclose', this);
    },
    unregisterListeners: function() {
      document.getElementById('close-all-btn').removeEventListener('click', this);
      window.removeEventListener('cardviewshown', this);
      window.removeEventListener('cardviewbeforeclose', this);
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
          if (evt.target.id === 'close-all-btn' &&
              this._showing && !this._closing) {
            console.log(this.name + ': handle click on ' + evt.target.id);
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
      var self = this;
      function next() {
        var card = cards.pop();
        if (self._showing && card) {
          if (card.app.killable()) {
            card.killApp();
            setTimeout(next, 120);
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
      console.log.apply(console,arguments);
    }
  };

  app.initialize();
}());
