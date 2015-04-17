# control-analytics-binding

A plugin to emit analytics events after a [control](https://github.com/nib-health-funds/control) is validated.

- This component only sends the analytics event after a `validate` event has been triggered on the control by a `blur` event i.e. when the user triggers validation by interacting with the field - if you're not triggering validation on blur than this component might not be applicable or need some refactoring

## Installation

    component install nib-components/control-analytics-binding

## Usage

HTML:

    <div class="js-control" data-analytics-category="Test Controls" data-analytics-label="My Control - {{value}}"> <!-- including the value is optional --!>
        <label class="js-label">
            My control:
            <input class="js-input"/>
        </label>
        <p class="js-feedback-message"></p>
    </div>

JavaScript:

    var plugin  = require('control-analytics-binding');
    var control = require('control').create({
        el: document.querySelector('.js-control'),
        name: 'my-control',
        validators: [
            [required, 'Oops! Please enter a value!']
        ]
    });

    control.use(plugin({
        //category:   'Other Test Controls',    //this option overrides the `data-analytics-category` attribute
        //label:      'My Other Control'        //this option overrides the `data-analytics-label` attribute
    }));

Analytics Data:

    - Category: Test Controls
    - Action:   Valid or Invalid
    - Label:    My Control

## Testing

    $ component test browser
