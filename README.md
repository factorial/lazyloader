# LazyLoader

A stupidly simple JavaScript lazy loader for the web. 

* Calls your callback function on every element matching the CSS selector `div[data-lazyload]` when it enters the viewport. 
* Optionally lets you change that CSS selector and define how many pixels outside of the viewport to call the callback.

## Requirements
LazyLoader just needs jQuery. I wrote it using 1.9.1, so aim for that.

## Browser support
So far I've tested it in Chrome, IE 9, and a few mobile browsers like
IOS Safari and it seems to be working. Other browsers, performance info, etc. are forthcoming.

## Usage
```
LazyLoader(loadCallback, options);
```

### Constructor Arguments   
* loadCallback `function`
* options `object` (optional)

### Constructor Options & Default Values

    options = {
        /* CSS selector matching elements to lazy load. */
        "selector": "div[data-lazyload]", // Default: divs with data-lazyload attribute set.

        /* Start loading elements when they are <threshold> pixels away from entering the viewport */
        "threshold": {
            "x": 0, // Default: load elements when they are truly in the viewport
            "y": 0
        }
    }

### Load Callback Arguments

When the load callback function is called it is passed one parameter object:

    {
        el: <the jQuery object for the element to be loaded>
    }

For now, the parameter object has only one property, `el`, the element that has entered
the viewport.



### The simplest way to use LazyLoader

    <!-- 1. Include your jQuery script and LazyLoader script -->
    <script src='jquery.js'></script>
    <script src='lazyloader.js'></script>

    <!-- 2. Define the callback function that should "load" an element -->
    <script>
        function loadFn(params) { /* ... */ }
    </script>

    <!-- 3. Instantiate the LazyLoader class with that load function -->
    <script>
        jQuery().ready(function() { LazyLoader(loadFn); });
    </script>

Whenever a user finishes scrolling or resizing the browser,
LazyLoader will execute the loadFn() function once for each div with a
`data-lazyload` attribute that is within the viewport.

### Loading different classes of elements differently

If you need to lazy load some elements of your page differently than other
lazy loading elements, you can create multiple instances of LazyLoader, each
with its own load function and selector. See the constructor documentation above 
and/or the example code in this package for more info on that.


## Contact
John Hayes - https://github.com/factorial
