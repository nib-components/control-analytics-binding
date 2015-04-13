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
    var gaIgnore    = element.getAttribute('data-analytics-ignore') !== null;

    //ignore the event
    if (gaIgnore) {
      return;
    }

    //check a category is specified
    if (gaCategory == '') {
      throw new Error('Category not set on control named "'+control.getName()+'"');
    }

    control.on('blur', function() {
      afterBlur = true;
    });

    //track the event
    control.on('validate', function(valid, value) {
      //need to re-get the label here in case the index for the field changed
      var gaLabel     = options.label || element.getAttribute('data-analytics-label') || '';

      //only send the event to GA if the user triggered it i.e. after a blur
      if (!afterBlur) {
        return;
      }
      afterBlur = false;

      //send the event
      var action  = value ? (valid ? 'Valid' : 'Invalid') : 'Empty';
      value       = value || '<NO-VALUE>';
      ga.trackEvent({
        category: gaCategory.replace('{{value}}', value), //replace template value with actual value
        action:   action,
        label:    gaLabel.replace('{{value}}', value) //replace template value with actual value
      });

    });

  };

};