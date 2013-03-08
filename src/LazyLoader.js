/*jslint browser: true*/
/*globals jQuery */

window.LazyLoader = function (loadCallback, optionOverride) {
    'use strict';
    var fnElIsVisible,
        fnDelay,
        fnLoadVisibleEls,
        lazyLoader = {},
        elsToLazyLoad = [], /* I like to say "el" for "element" everywhere. */
        delayTimeout,
        handleEvents = true,
        options = {
            "lockTime": 100, /* Milliseconds to wait before handling the onscroll/onresize events again. */
            "selector": "div[data-lazyload]", /* CSS selector matching elements to lazy load. Default: divs with data-lazyload attribute set. */
            "threshold": { /* start loading element when it is <threshold> pixels away from the viewport */
                "x": 0,
                "y": 0
            }
        };

    /* PRIVATE */
    /* ******* */
    if (optionOverride) {
        options.selector        = optionOverride.selector        || options.selector;
        if (optionOverride.threshold) {
            options.threshold.x     = optionOverride.threshold.x     || options.threshold.x;
            options.threshold.y     = optionOverride.threshold.y     || options.threshold.y;
        }
    }

    /* bool fnElIsVisible(el) - return whether element is within viewport + threshold */
    fnElIsVisible = function (el) {
        el = jQuery(el);
        var win = jQuery(window),

            elTop = el.offset().top,
            elLeft = el.offset().left,
            elBot = el.offset().top + el.height(),
            elRight = el.offset().left + el.width(),

            /* The options.threshold lets you define a bigger area within which to start
               loading an element.
             */
            viewportCoords = {
                top: win.scrollTop() + options.threshold.y,
                bot: win.height() + win.scrollTop() + options.threshold.y,
                left: win.scrollLeft() + options.threshold.x,
                right: win.width() + win.scrollLeft() + options.threshold.x
            };

        /* Return true if the top OR bottom edge of the element is visible AND
           the left OR right edge of the element is visible.
         */
        return ((elTop < viewportCoords.bot && elTop > viewportCoords.top) || (elBot < viewportCoords.bot && elBot > viewportCoords.top)) &&
               ((elLeft < viewportCoords.right && elLeft > viewportCoords.left) || (elRight < viewportCoords.right && elRight > viewportCoords.left));
    };

    /* void fnDelay(callback, ms) - delay executing a callback function until it hasn't been called for <ms> milliseconds */
    fnDelay = function (callback, ms) {
        /* some reasonable defaults, uses private variable delayTimeout as default timeout object */
        ms = ms || 100;
        window.clearTimeout(delayTimeout);
        delayTimeout = window.setTimeout(callback, 100);
    };

    /* This is the main function, which will be attached to the window onscroll and onresize events */
    fnLoadVisibleEls = function () {
        /* First, manage the lock for executing this handler */
        if (!handleEvents) { return; }
        handleEvents = false;

        var callbackParam = {};

        elsToLazyLoad.each(function (index) {
            if (elsToLazyLoad[index] && fnElIsVisible(this)) {
                callbackParam.el = jQuery(this);
                lazyLoader.loadCallback(callbackParam);

                /* Set this element to null so it's not loaded again */
                elsToLazyLoad[index] = null;
            }
        });

        /* Set handleEvents back to true after <lockTime> ms */
        window.setTimeout(function () { handleEvents = true; }, options.lockTime);
    };


    /* PUBLIC */
    /* ****** */

    /* Hey look, you can change the load callback at run time! */
    lazyLoader.loadCallback = loadCallback;

    /* CONSTRUCTOR */
    /* Register the elements to lazy load with LazyLoader */
    elsToLazyLoad = jQuery(options.selector);

    /* Attach event handlers */
    /* We delay execution of handlers until the user has stopped scrolling/resizing entirely. See fnDelay(), defined above */
    jQuery(window).scroll(function () { fnDelay(fnLoadVisibleEls); });
    jQuery(window).resize(function () { fnDelay(fnLoadVisibleEls); });

    /* Go ahead and call the event handler on instantiation */
    window.setTimeout(fnLoadVisibleEls, 1);
    return lazyLoader;
};

