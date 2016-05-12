/*!
 * jQuery Scroll N' Show
 * Author: Gustavo Sales (http://github.com/hebsix)
 * Made in: Simplex Web (http://www.rmcbrothers.com.br)
 * Created in: 11/2015
 * 
 * 
 * Aditional Plugins:
 *      Required if using jQuery Animation: jQuery Easing (By gdsmith, https://github.com/gdsmith/jquery.easing, thanks :D)
 * 
 * 
 * Logs: 
 *      0.1 - The build with basic resources.
 *      0.2 - Hidden elements on init fixed.
 * 
 * 
 * Usage: 
 *      <element 
 *         data-jss-effect="bottom(40)"
 *         data-jss-duration="500"
 *         data-jss-delay="0"
 *         data-jss-easing="easeOutCubic"
 *         data-jss-spaceBetween="270">Foo</element>
 * 
 * 
 * Notes:
 *      1. "data-jss-effect" is required.
 *      2. in example "usage" the values are defaults (Except "data-jss-effect").
 *      3. spaceBetween is defined in plugin options, but can be defined in element.
 * 
 * 
 * Methods:
 *      'refresh': reset the plugin
 *      'destroy': remove all effects used in plugin
 *      'hide': hide all or an element
 *      'show': show all or an element
 * 
 */

; (function ($) {
    if (!$.scroll) $.scroll = {};

    var els = [],
        cssMotors = ['', '-webkit-', '-moz-', '-o-', '-ms-'],
        timing = //  By matthewlein (https://github.com/matthewlein/Ceaser), thanks :D
        {
            'linear': 'linear',
            'ease': 'ease',
            'easeIn': 'ease-in',
            'easeOut': 'ease-out',
            'easeInOut': 'ease-in-out',
            'easeInCubic': 'cubic-bezier(.55,.055,.675,.19)',
            'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
            'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
            'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
            'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
            'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
            'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
            'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
            'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
            'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
            'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
            'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
            'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
            'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
            'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
            'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
            'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
            'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
            'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
            'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
            'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
            'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
            'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
            'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
        };

    $.scroll.nShow = function (options, $el) {
        var base = this;

        base.init = function () {
            if (typeof options == 'string') {
                switch (options) {
                    case 'refresh':
                        base.refresh($el);
                        break;
                    case 'destroy':
                        base.destroy($el);
                        break;
                    case 'hide':
                        base.hide($el);
                        break;
                    case 'show':
                        base.show($el);
                        break;
                }
            } else {
                base.options = $.extend({}, $.scroll.nShow.defaultOptions, options);

                if (navigator.userAgent.toLowerCase().indexOf('msie 9.0') != -1)
                    base.options.cssTransitions = false;

                base.defineElements();
                base.prepareElements();

                $(window).on('scroll', base.movimentation).trigger('scroll');
                $(window).on('resize', base.onResize);
            }
        };

        base.getElementData = function ($e) {
            if ($e == undefined) return undefined;

            var effect = $e.data('jss-effect');

            if (effect == undefined || effect == null || effect == '') {
                console.error('jQuery Scroll Show: Effect not found in "' + e.outerHTML + '"');
                return false;
            }

            var position = $e.offset(),
                obj = {
                    top: position.top,
                    left: position.left,
                    duration: base.options.duration,
                    delay: base.options.delay,
                    easing: base.options.easing,
                    spaceBetween: base.options.spaceBetween
                };

            for (var key in $e.data()) {
                //  Removes the prefix in properties and adjusts the name for camelcase pattern
                var newKey = key.replace('jss', '');

                newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);

                obj[newKey] = $e.data(key);
            }

            obj.stopIn = position.top;
            obj.startIn = position.top - obj.spaceBetween;

            if (obj.spaceBetween != base.options.spaceBetween)
                obj.startIn = position.top - obj.spaceBetween;

            if (obj.startIn < 0)
                obj.startIn = 0;

            obj.$e = $e;

            return obj;
        };

        base.defineElements = function () {
            $('[data-jss-effect]').each(function (i, e) {
                var $e = $(e),
                    obj = base.getElementData($e);

                els.push(obj);
            });
        };

        base.prepareElements = function ($e) {
            if ($e != undefined) {
                var obj = base.getElementData($e);

                prepare(obj);
            } else {
                for (var i = 0; i < els.length; i++) {
                    var obj = els[i];

                    prepare(obj);
                };
            }

            function prepare(obj) {
                var $e = obj.$e;

                if (base.options.cssTransitions) { //  CSS3 allowed
                    switch (obj.effect.split('(')[0]) {
                        case 'left':
                        case 'right':
                            $e.css(transform('translate', { x: eval(obj.effect), y: 0 }, $e));
                            break;
                        case 'top':
                        case 'bottom':
                            $e.css(transform('translate', { x: 0, y: eval(obj.effect) }, $e));
                            break;
                        case 'zoom':
                            $e.css(transform('scale', eval(obj.effect)));
                            break;
                    };
                } else {
                    if ($e.css('position') == 'static')
                        $e.css({ position: 'relative' });

                    switch (obj.effect.split('(')[0]) {
                        case 'left':
                        case 'right':
                            $e.css({ left: eval(obj.effect) });
                            break;
                        case 'top':
                        case 'bottom':
                            $e.css({ top: eval(obj.effect) });
                            break;
                        case 'zoom':
                            $e.css({ zoom: eval(obj.effect) });
                            break;
                    }
                }
            }
        }

        base.movimentation = function () {
            var scrlTop = $(this).scrollTop();

            for (var i = 0; i < els.length; i++) {
                var data = els[i];

                if (scrlTop >= data.startIn && scrlTop <= data.stopIn && data.$e.css('opacity') == 0)
                    base.animate(data);
            }
        };

        base.animate = function (data) {
            if (base.options.cssTransitions) { //  CSS3 allowed
                data.$e.css(transition('all', data.duration, timing[data.easing], data.delay));
                data.$e.css({ opacity: 1 });

                switch (data.effect.split('(')[0]) {
                    case 'left':
                    case 'right':
                        data.$e.css(transform('translate', { x: 0, y: 0 }, data.$e));
                        break;
                    case 'top':
                    case 'bottom':
                        data.$e.css(transform('translate', { x: 0, y: 0 }, data.$e));
                        break;
                    case 'zoom':
                        data.$e.css(transform('scale', { value: 1 }));
                        break;
                }
            } else {
                switch (data.effect.split('(')[0]) {
                    case 'left':
                    case 'right':
                        data.$e.delay(data.delay).animate({ opacity: 1, left: 0 }, data.duration, data.easing);
                        break;
                    case 'top':
                    case 'bottom':
                        data.$e.delay(data.delay).animate({ opacity: 1, top: 0 }, data.duration, data.easing);
                        break;
                    case 'zoom':
                        data.$e.delay(data.delay).animate({ opacity: 1, zoom: '100%' }, data.duration, data.easing);
                        break;
                    case 'show':
                        data.$e.delay(data.delay).animate({ opacity: 1 }, data.duration, data.easing);
                        break;
                }
            }
        }

        base.animateWithoutMovimentation = function () {
            for (var i = 0; i < els.length; i++)
                base.animate(els[i]);
        }

        base.refresh = function () {
            base.destroy();
            base.prepareElements();
        }

        base.hide = function ($e) {
            base.destroy($e);
            base.prepareElements($e);
        }

        base.show = function ($e) {
            if ($e != undefined) {
                var obj = base.getElementData($e);

                base.animate(obj);
            } else
                base.animateWithoutMovimentation();
        }

        base.destroy = function ($e) {
            if ($e != undefined)
                $e.attr('style', deleteUsedStyles($e));
            else {
                for (var i = 0; i < els.length; i++) {
                    var data = els[i];

                    data.$e.attr('style', deleteUsedStyles(data.$e));
                }
            }

            function deleteUsedStyles($el) {
                var styles = $el.attr('style').split(';'),
                    temp = [];

                for (var s = 0; s < styles.length; s++)
                    if (styles[s].indexOf('transform') == -1 && styles[s].indexOf('transition') == -1 && styles[s].indexOf('opacity') == -1)
                        temp.push(styles[s]);

                return temp.join(';');
            }
        }

        base.onResize = function () {
            for (var i = 0; i < els.length; i++) {

                if (base.options.cssTransitions) {
                    if (els[i].$e.css('opacity') == 1)
                        base.destroy(els[i].$e);
                } else {
                    if (els[i].$e.is(':visible'))
                        base.destroy(els[i].$e);
                }
            }

        };

        base.init();


        //  Methods to use in CSS
        function transform(property, opts, $obj) {
            var cssLine = '';

            if ($obj != undefined && $obj.css('transform') != 'none')
                cssLine += $obj.css('transform');

            if (cssLine == '')
                cssLine = 'matrix(1, 0, 0, 1, 0, 0)';

            switch (property) {
                case 'translate':
                    if ($obj == undefined) {
                        if (opts.x == undefined)
                            opts.x == 0;

                        if (opts.y == undefined)
                            opts.y = 0;
                    } else {
                        var pos = $obj.position();

                        if (opts.x == undefined)
                            opts.x = pos.left;

                        if (opts.y == undefined)
                            opts.y = pos.top;
                    }

                    var matrix = cssLine.replace('matrix(', '').replace(')', '').split(', ');

                    generateMatrix(matrix[0], matrix[3], matrix[1], matrix[2], opts.x, opts.y);

                    break;
                case 'scale':
                    cssLine = 'scale(#value#)'.replace('#value#', opts.value);
                    break;
            };

            if (cssLine != '') {
                return applyCssMotors('transform', cssLine);
            }

            function generateMatrix(scaleX, scaleY, skewR, skewL, x, y) {
                cssLine = ' matrix(#scale-x#, #skew-r#, #skew-l#, #scale-y#, #x#, #y#)'
                                    .replace('#scale-x#', scaleX)
                                    .replace('#skew-r#', skewR)
                                    .replace('#skew-l#', skewL)
                                    .replace('#scale-y#', scaleY)
                                    .replace('#x#', x)
                                    .replace('#y#', y);
            }

        };

        function transition(property, duration, easing, delay) {
            return applyCssMotors('transition', '#property# #duration#ms #easing#  #delay#ms'
                                                        .replace('#property#', property)
                                                        .replace('#duration#', duration)
                                                        .replace('#easing#', easing)
                                                        .replace('#delay#', delay));
        };

        function removeTransition() {
            return this.applyCssMotors('transition', 'none');
        };

        function applyCssMotors(property, value) {
            var css = {};

            for (var i = 0; i < cssMotors.length; i++)
                css[cssMotors[i] + property] = value;

            return css;
        };

        function left(distance) {
            return -distance;
        };

        function right(distance) {
            return distance;
        };

        function top(distance) {
            return -distance;
        };

        function bottom(distance) {
            return distance;
        };

        function zoom(value) {
            if (base.options.cssTransitions)
                return { value: value };

            return value * 100 + '%';
        };

    };

    $.scroll.nShow.defaultOptions = {
        spaceBetween: 500, //  Distance to start the show of element (can be changed in element)
        duration: 500,
        delay: 0,
        easing: 'easeOutCubic',
        cssTransitions: true //  Allow CSS3 transitions
    };

    $.fn.scroll_nShow = function (options) {
        return this.each(function () {
            (new $.scroll.nShow(options));
        });
    };

})(jQuery);