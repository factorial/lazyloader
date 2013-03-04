# LazyLoader

A stupidly simple JavaScript lazy loader for the web.

## Requirements
LazyLoader just needs jQuery. I wrote it using 1.9.1, so aim for that.

## Browser support
So far I've tested it in Chrome and IE 9 and it seems to be working.
Other browsers, performance info, etc. are forthcoming.

## Usage
### We can do this the easy way...

The simplest way to use LazyLoader is like this:

    <!-- 1. Include your jQuery script -->
    <script src='jquery.js'></script>

    <!-- 2. Define the function that "loads" an element -->
    function loadFn(params) { ... }

    <!-- 3. Instantiate the LazyLoader class with that load function -->
    jQuery().ready(LazyLoader(loadFn));

Done this way, whenever a user finishes scrolling or resizing the browser,
LazyLoader will execute the loadFn() function once for each div with a
`data-lazyload` attribute set that is within the viewport.

#### Load function parameters

The load function is called with one parameter:

    params = {
        el: <the jQuery object for the element to be loaded>
    }

### or we can do it the still really easy way...

You may find need for some of the options available to the LazyLoader() constructor.
Here are the constructor interface and default option values:

#### LazyLoader constructor parameters
    LazyLoader ll = LazyLoader(loadFn, options);

    options = {
        /* Milliseconds to wait before handling the onscroll/onresize events again. */
        "lockTime": 100,

        /* CSS selector matching elements to lazy load. Default: divs with data-lazyload attribute set. */
        "selector": "div[data-lazyload]",

        /* Start loading elements when they are <threshold> pixels away from entering the viewport */
        "threshold": {
            "x": 0,
            "y": 0
        }
    }

## Contact
John Hayes - https://github.com/factorial
