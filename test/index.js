var assert = require('assert');

/**
 * Mock the Google Analytics method
 */
var lastGaEvent = {};
window.ga = function(cmd, type, category, action, label, value) {
  lastGaEvent = {
    category: category,
    action:   action,
    label:    label,
    value:    value
  };
};

/**
 * Create a new control
 * @param   {Object}  options
 * @param   {string}  options.category
 * @param   {string}  options.label
 * @param   {string}  options.ignoreAttr
 * @returns {ControlPresenter}
 */
function createControl(options) {
  options = options || {};

  var element = document.createElement('div');
  element.setAttribute('data-analytics-category', 'Test Controls');
  element.setAttribute('data-analytics-label', 'My Control');
  if (options.ignoreAttr) element.setAttribute('data-analytics-ignore', 'Test Controls');
  element.innerHTML =
    '<label class="js-label">' +
    '  My control:' +
    '  <input class="js-input"/>' +
    '</label>' +
    '<p class="js-feedback-message"></p>'
  ;

  var required    = require('validation-methods').required;
  var plugin      = require('control-analytics-binding');
  var control     = require('control').create({
    el:         element,
    name:       'my-control',
    validators: [
      [required, 'Oops! Please enter a value!']
    ]
  }).use(plugin(options));

  return control;
}

describe('control-analytics-binding', function() {

  beforeEach(function() {
    lastGaEvent = {};
  });

  it('it should not emit an event when I haven\'t  blurred the control', function(done) {
    createControl()
      .on('validate', function() {
        assert.equal(typeof(lastGaEvent.category), 'undefined');
        assert.equal(typeof(lastGaEvent.action), 'undefined');
        assert.equal(typeof(lastGaEvent.label), 'undefined');
        done();
      })
      .validate()
    ;
  });

  it('it should not emit an event when I have the ignore attribute in markup', function(done) {
    createControl({ignoreAttr: true})
      .on('validate', function() {
        assert.equal(typeof(lastGaEvent.category), 'undefined');
        assert.equal(typeof(lastGaEvent.action), 'undefined');
        assert.equal(typeof(lastGaEvent.label), 'undefined');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with an action of "Valid"', function(done) {
    createControl()
      .setValue('foobar')
      .on('validate', function() {
        assert.equal(lastGaEvent.action, 'Valid');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with an action of "Invalid"', function(done) {
    createControl()
      .setValue('')
      .on('validate', function() {
        assert.equal(lastGaEvent.action, 'Invalid');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with a category of "Test Controls" when I set a category in the HTML', function(done) {
    createControl()
      .on('validate', function() {
        assert.equal(lastGaEvent.category, 'Test Controls');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with a category of "Other Test Controls" when I pass a category to the plugin', function(done) {
    createControl({category: 'Other Test Controls'})
      .on('validate', function() {
        assert.equal(lastGaEvent.category, 'Other Test Controls');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with a label of "My Control" when I set a label in the HTML', function(done) {
    createControl()
      .on('validate', function() {
        assert.equal(lastGaEvent.label, 'My Control');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should emit an event with a label of "My Other Control" when I pass a label to the plugin', function(done) {
    createControl({label: 'My Other Control'})
      .on('validate', function() {
        assert.equal(lastGaEvent.label, 'My Other Control');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should replace template values in the category', function(done) {
    createControl({category: 'Test Controls - "{{value}}"'})
      .setValue('Hello Kitty!')
      .on('validate', function() {
        assert.equal(lastGaEvent.category, 'Test Controls - "Hello Kitty!"');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

  it('it should replace template values in the label', function(done) {
    createControl({label: 'My control - "{{value}}"'})
      .setValue('Hello Kitty!')
      .on('validate', function() {
        assert.equal(lastGaEvent.label, 'My control - "Hello Kitty!"');
        done();
      })
      .emit('blur')
      .validate()
    ;
  });

});