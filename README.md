# control-analytics-binding

A plugin to emit analytics events after a [control](https://github.com/nib-health-funds/control) is validated.

## Installation

    component install control-analytics-binding


## Usage

HTML:

    <div class="js-control">
        <label class="js-label">
            My control:
            <input class="js-input" data-analytics-category="Test Controls" data-analytics-label="My Control"/>
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
