/*
   LazyLoader
   a stupidly simple lazy loader for the web
   https://github.com/factorial/LazyLoader

   Licensed under the MIT License (http://opensource.org/licenses/MIT)
   -----

   Usage:
        <script src='jquery.js'></script>
        function loadFn(params) { ... }
        jQuery().ready(LazyLoader(loadFn));

   Constructor Parameters:
   param 1 - loadCallback:
       the callback function that will be called to "load" the element.
       it can actually do anything you want to be done when the element
       enters the viewport - load a template, launch a rocket, whatever.

       loadCallback will be passed a single parameters object:
       {
       "el": <the element entering the viewport. a jquery object.>
       }

   param 2 - optionOverride:
       optional options that are optional
       (for changing things from their default behavior)

       options are specified in a JSON object. look below at the
       options initial variable definition for the available options and
       their default values.
 */

window.LazyLoader = function(loadCallback, optionOverride) {
    var lazyLoader = {},
        elsToLazyLoad = [], /* I like to say "el" for "element" everywhere. */
        i,
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
    if (optionOverride) {
        options.selector        = optionOverride.selector        || options.selector;
        options.threshold.x     = optionOverride.threshold.x     || options.threshold.x;
        options.threshold.y     = optionOverride.threshold.y     || options.threshold.y;
    }

    /* bool elIsVisible(el) - return whether element is within viewport + threshold */
    elIsVisible = function(el) {
        var el = jQuery(el),
            win = jQuery(window);

            elTop = el.offset().top,
            elLeft = el.offset().left,
            elBot = el.offset().top + el.height(),
            elRight = el.offset().left + el.width(),

            /* The options.threshold lets you define a bigger area within which to start
             * loading an element.
             */
            viewportCoords = {
                top: win.scrollTop() + options.threshold.y,
                bot: win.height() + win.scrollTop() + options.threshold.y,
                left: win.scrollLeft() + options.threshold.x,
                right: win.width() + win.scrollLeft() + options.threshold.x
            };

        /* Return true if the top OR bottom edge of the element is visible AND
         *                the left OR right edge of the element is visible.
         */
        return ((elTop < viewportCoords.bot && elTop > viewportCoords.top) || (elBot < viewportCoords.bot && elBot > viewportCoords.top)) &&
               ((elLeft < viewportCoords.right && elLeft > viewportCoords.left) || (elRight < viewportCoords.right && elRight > viewportCoords.left));
    }

    /* Delay executing a function until it hasn't been called for <ms> milliseconds */
    delay = function(callback, ms, timeoutObj) {
        /* some reasonable defaults, uses private variable delayTimeout as default timeout object */
        var ms = ms || 100,
            timeoutObj = timeoutObj || delayTimeout;
        window.clearTimeout(delayTimeout);
        delayTimeout = window.setTimeout(callback, ms);
    }

    /* This is the main function, which will be attached to the window onscroll and onresize events */
    loadVisibleEls = function() {
        /* First, manage the lock for executing this handler */
        if (!handleEvents) { return; }
        else { handleEvents = false; }

        var elIndexesLoaded = [],
            callbackParam = {};

        elsToLazyLoad.each(function(index) {
            if (elsToLazyLoad[index] && elIsVisible(this)) {
                callbackParam.el = jQuery(this);
                lazyLoader.loadCallback(callbackParam);

                /* Set this element to null so it's not loaded again */
                elsToLazyLoad[index] = null;
            }
        });

        /* Set handleEvents back to true after <lockTime> ms */
        window.setTimeout(function() { handleEvents = true; }, options.lockTime);
    };


    /* PUBLIC */
    /* Hey look, you can change the load callback at run time! */
    lazyLoader.loadCallback = loadCallback;

    /* CONSTRUCTOR */
    /* Register the elements to lazy load with LazyLoader */
    elsToLazyLoad = jQuery(options.selector);

    /* Attach event handlers */
    /* We delay execution of handlers until the user has stopped scrolling/resizing entirely. See delay(), defined above */
    jQuery(window).scroll(function() { delay(loadVisibleEls) });
    jQuery(window).resize(function() { delay(loadVisibleEls) });

    /* Go ahead and call the event handler on instantiation */
    loadVisibleEls();
    return lazyLoader;
};
