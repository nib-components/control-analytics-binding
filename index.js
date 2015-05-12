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

    //get the event data
    var element = control.controlView.el;
    var gaCategory  = options.category || element.getAttribute('data-analytics-category') || '';
    var gaLabel     = options.label || element.getAttribute('data-analytics-label') || '';
    var gaIgnore    = element.getAttribute('data-analytics-ignore') !== null;

    //ignore the event
    if (gaIgnore) {
      return;
    }

    //check a category is specified
    if (gaCategory == '') {
      throw new Error('Category not set on control named "'+control.getName()+'"');
    }

    //check a label is specified
    if (gaLabel == '') {
      //throw new Error('Label not set on control named "'+control.getName()+'"');
    }

    //track the event
    control.on('validate', function(valid, value) {

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