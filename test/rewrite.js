'use strict';
var tape = require('tape');
var rewrite = require('../');

tape('keep original', function (t) {
    t.plan(1);
    var original = '<script src="/assets/a.js"></script>';
    var result = rewrite({}, original);
    t.equal(result, original);
});

tape('replace with revMap without leading slash', function (t) {
    t.plan(1);
    var original = '<script src="/assets/a.js"></script>';
    var result = rewrite({
        revMap: {
            'a.js': 'b.js'
        }
    }, original);
    t.equal(result, '<script src="b.js"></script>');
});

tape('replace with revMap and assetPathPrefix and leading slash', function (t) {
    t.plan(1);
    var original = '<script src="/static/a.js"></script>';
    var result = rewrite({
        assetPathPrefix: '/static',
        revMap: {
            '/a.js': '/b.js'
        }
    }, original);
    t.equal(result, '<script src="/b.js"></script>');
});

tape('with all options set', function (t) {
    t.plan(1);
    var original = '<link rel="stylesheet" href="/static/a.css" /><script src="/static/a.js"></script>';
    var result = rewrite({
        assetPathPrefix: '/static',
        revMap: {
            '/a.js': '/b.js',
            '/a.ie.css': '/b.ie.css'
        },
        revPre: function(filePath) {
            var match;
            if ((match = filePath.match(/(\.ie)?\.css$/)) && !match[1]) {
                return filePath.replace(/\.css$/, '.ie.css');
            } else {
                return filePath;
            }
        },
        revPost: function(revvedFilePath) {
            return '/assets' + revvedFilePath;
        }
    }, original);
    t.equal(result, '<link rel="stylesheet" href="/assets/b.ie.css" /><script src="/assets/b.js"></script>');
});

tape('no need to match in revMap, revPost still apply', function (t) {
    t.plan(1);
    var original = '<script src="/static/a.js"></script>';
    var result = rewrite({
        assetPathPrefix: '/static',
        revPost: function(revvedFilePath) {
            return '/assets' + revvedFilePath;
        }
    }, original);
    t.equal(result, '<script src="/assets/a.js"></script>');
});
