# jQuery Scroll N' Show
jQuery plugin for show the elements on HTML page togehter with scroll moviment

## Download

```bash
git clone https://github.com/hebsix/jquery-scroll-n-show.git
```

## Usage

```html
<element 
    data-jss-effect="bottom(40)"
    data-jss-duration="500"
    data-jss-delay="0"
    data-jss-easing="easeOutCubic"
    data-jss-spaceBetween="270">Foo</element>
```
```javascript
$.scroll.nShow();
```

### Default values
```javascript
{
    spaceBetween: 500,
    duration: 500,
    delay: 0,
    easing: 'easeOutCubic',
    cssTransitions: true
};

```

## Methods
    'refresh': reset the plugin
    'destroy': remove all effects used in plugin
    'hide': hide all or an element
    'show': show all or an element     
 
 
## Notes
    1. "data-jss-effect" is required.
    2. in example "usage" the values are defaults (Except "data-jss-effect").
    3. spaceBetween is defined in plugin options, but can be defined in element.

## Aditional Plugins:

Required if using jQuery Animation: jQuery Easing (By gdsmith, https://github.com/gdsmith/jquery.easing, thanks :D)

## About
- Author: Gustavo Sales (http://github.com/hebsix)
- Made in: Simplex Web (http://simplexweb.com.br/)
- Created in: 11/2015

## Contact
- Skype: guustavosales

## Changelog
### 0.2
- Hidden elements on init fixed.

### 0.1
- The build with basic resources. 