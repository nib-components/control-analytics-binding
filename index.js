var ga = require('analytics');

/**
 * Find the input element with the matching value
 * @param   {HTMLElement} element
 * @param   {string}      value
 * @returns {HTMLElement}
 */
function findElement(element, value) {

  //find the inputs on the element
  var inputs = element.querySelectorAll('input,textarea,select');
  for (var i=0; i<inputs.length; ++i) {
    if (inputs[i].value === value) {
      return inputs[i];
    }
  }

  //fallback to the input element
  return element;
}

/**
 * A control plugin - binds analytics to the control validate event
 * @param   options
 * @returns {function}
 */
module.exports = function(options) {
  options = options || {};

  return function(control) {

    //track the event
    control.on('validate', function(valid) {

      //find the input element
      var value = control.inputView.getValue(); //use the raw view value otherwise we won't find an element if we use the filtered control value
      var element = findElement(control.inputView.el, value);

      //get the event data
      var gaCategory  = options.category || element.getAttribute('data-analytics-category') || '';
      var gaLabel     = options.label || element.getAttribute('data-analytics-label') || '';
      var gaIgnore    = element.getAttribute('data-analytics-ignore') !== null;

      //ignore the event
      if (gaIgnore) {
        return;
      }

      //replace template values
      gaCategory  = gaCategory.replace('{{value}}', value);
      gaLabel     = gaLabel.replace('{{value}}', value);

      ga.trackEvent({
        category: gaCategory,
        action:   valid ? 'Valid' : 'Invalid',
        label:    gaLabel
      });

    });

  };

};