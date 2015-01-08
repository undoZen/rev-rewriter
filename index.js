'use strict';

module.exports = rewrite;
module.exports.escapeRegExp = escapeRegExp;

function escapeRegExp(string) {
    return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}

function rewrite(opts, contents) {
    var revMap = opts.revMap || {};
    var assetPathPrefix = opts.assetPathPrefix || '/assets/';
    var revPost = typeof opts.revPost === 'function' ? opts.revPost : identity;
    function identity(p, rewritten) {
        return p;
    }
    /*
     * copy from broccoli-assets-rewrite with some modification
     *
     * Replace all of the assets with their new fingerprint name
     *
     * Uses a regular expression to find assets in html tags, css backgrounds, handlebars pre-compiled templates, etc.
     * (
     * ["\'\\(=]{1} - Match one of "'(= exactly one time
     * \\s* - Any amount of white space
     * ) - here ends $1 (left)
     * escapeRegExp(assetPathPrefix) - prefix is costomizable，default is '/assets/'
     * ( - $2 (filePath) begins
     * [^"\'\\(\\)\\\\>]* - Do not match any of ^"'()\> 0 or more times - Explicitly add \ here because of handlebars compilation
     * )( - $3 (right) begins
     * \\s* - Any amount of white space
     * [\\\\]* - Allow any amount of \ - For handlebars compilation (includes \\\)
     * \\s* - Any amount of white space
     * ["\'\\)> ]{1} - Match one of "'( > exactly one time
     */

    var filePathRegex = new RegExp('(["\'\\(=]{1}\\s*)' + escapeRegExp(
            assetPathPrefix) +
        '([^"\'\\(\\)\\\\>]*)(\\s*[\\\\]*\\s*["\'\\)> ]{1})', 'g');
    return contents.replace(filePathRegex, function (all, left,
        filePath, right) {
        var index, indexs, indexh, search;
        //filePath = filePath.substring('/assets/'.length);
        if ((indexs = filePath.indexOf('?')) > -1 || (indexh = filePath.indexOf(
            '#')) > -1) {
            //like ../../font/fontawesome-webfont.svg#fontawesomeregular?v=3.2.1
            index = 'undefined' !== typeof indexh ? indexh :
                (indexh = filePath.indexOf('#')) > -1 ? Math.min(indexs,
                indexh) : indexs;
            search = filePath.substring(index);
            filePath = filePath.substring(0, index);
        }
        if (revMap[filePath]) {
            return left + revPost(revMap[filePath], true) + (search || '') +
                right;
        } else if (revPost !== identity) {
            return left + revPost(filePath, false) + (search || '') + right;
        } else {
            return all;
        }
    });
}