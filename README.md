rev-rewriter
============

input revMap and string, output string replaced based on revMap


##usage

I'm too lazy to write the doc, if you want to use it you can refer to test/rewrite plz, here's the whole file ;)

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

    tape('well all options setted', function (t) {
        t.plan(1);
        var original = '<script src="/static/a.js"></script>';
        var result = rewrite({
            assetPathPrefix: '/static',
            revMap: {
                '/a.js': '/b.js'
            },
            revPost: function(revvedFilePath) {
                return '/assets' + revvedFilePath;
            }
        }, original);
        t.equal(result, '<script src="/assets/b.js"></script>');
    });