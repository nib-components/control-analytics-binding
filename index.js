var ga = require('analytics');

/**
 * A control plugin - binds analytics to the control validate event
 * @param   {Object} options
 * @param   {string} [options.category]   Override the event category set on the element
 * @param   {string} [options.label]      Override the event label set on the element
 * @returns {function(ControlPresenter)}
 */
module.exports = function(options) {
  options = options || {};

  return function(control) {
    var afterBlur = false;

    //get the event data
    var element = control.controlView.el;
    var gaCategory  = options.category || element.getAttribute('data-analytics-category') || '';
    var gaLabel     = options.label || element.getAttribute('data-analytics-label') || '';
    var gaIgnore    = element.getAttribute('data-analytics-ignore') !== null;

    //ignore the event
    if (gaIgnore) {
      return;
    }

    control.on('blur', function() {
      afterBlur = true;
    });

    //track the event
    control.on('validate', function(valid, value) {

      //only send the event to GA if the user triggered it i.e. after a blur
      if (!afterBlur) {
        return;
      }
      afterBlur = false;

      //replace template values
      value = value || '<NO-VALUE>';
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