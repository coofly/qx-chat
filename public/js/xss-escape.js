// xss-escape
// https://github.com/DubFriend/xss-escape

// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet

(function () {
    'use strict';

    var isString = function (data) {
        return typeof data === 'string';
    };

    var isArray = function (value) {
        return toString.call(value) === "[object Array]";
    };

    var isObject = function (value) {
        return !isArray(value) && value instanceof Object;
    };

    var isNumber = function (value) {
        return typeof value === 'number';
    };

    var charForLoopStrategy = function (unescapedString) {
        var i, character, escapedString = '';

        for(i = 0; i < unescapedString.length; i += 1) {
            character = unescapedString.charAt(i);
            switch(character) {
                case '<':
                    escapedString += '&lt;';
                    break;
                case '>':
                    escapedString += '&gt;';
                    break;
                case '&':
                    escapedString += '&amp;';
                    break;
                case '/':
                    escapedString += '&#x2F;';
                    break;
                case '"':
                    escapedString += '&quot;';
                    break;
                case "'":
                    escapedString += '&#x27;';
                    break;
                default:
                    escapedString += character;
            }
        }

        return escapedString;
    };

    var regexStrategy = function (string) {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, "&#x27;")
            .replace(/\//g, '&#x2F;');
    };

    var shiftToRegexStrategyThreshold = 32;

    var xssEscape = function (data, forceStrategy) {
        var escapedData, character, key, i, charArray = [], stringLength;

        if(isString(data)) {
            stringLength = data.length;
            if(forceStrategy === 'charForLoopStrategy') {
                escapedData = charForLoopStrategy(data);
            }
            else if(forceStrategy === 'regexStrategy') {
                escapedData = regexStrategy(data);
            }
            else if(stringLength > shiftToRegexStrategyThreshold) {
                escapedData = regexStrategy(data);
            }
            else {
                escapedData = charForLoopStrategy(data);
            }
        }
        else if(isNumber(data)) {
            escapedData = data;
        }
        else if(isArray(data)) {
            escapedData = [];
            for(i = 0; i < data.length; i += 1) {
                escapedData.push(xssEscape(data[i]));
            }
        }
        else if(isObject(data)) {
            escapedData = {};
            for(key in data) {
                if(data.hasOwnProperty(key)) {
                    escapedData[key] = xssEscape(data[key]);
                }
            }
        }

        return escapedData;
    };

    // use in browser or nodejs
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = xssEscape;
        }
        exports.xssEscape = xssEscape;
    } else {
        this.xssEscape = xssEscape;
    }

}).call(this);
