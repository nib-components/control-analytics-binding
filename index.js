var ga = require('analytics');

/**
 * A control plugin - binds analytics to the control validate event
 * @param   options
 * @returns {function}
 */
module.exports = function(options) {
  options = options || {};

  return function(control) {

    var gaCategory  = options.category || control.inputView.el.getAttribute('data-analytics-category');
    var gaLabel     = options.label || control.inputView.el.getAttribute('data-analytics-label');
    var gaIgnore    = control.inputView.el.getAttribute('data-analytics-ignore') !== null;

    if (gaIgnore) {
      return;
    }

    control.on('validate', function(valid, value) {

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