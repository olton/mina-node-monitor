/*!
 * Christmas Balls - A Metro 4 Component v1.0.0  (https://github.com/olton/christmas-balls.git)
 * Copyright 2020 Sergey Pimenov
 * Built at 27/12/2021 20:07:18
 * Licensed under MIT
 !*/
(function(Metro, $) {
    'use strict';

    var partSize = 373;

    var ChristmasBallsDefaultConfig = {
        soundPath: "/sounds/",
        soundVolume: 1,
        onChristmasBallsCreate: Metro.noop
    };

    Metro.christmasBallsSetup = function (options) {
        ChristmasBallsDefaultConfig = $.extend({}, ChristmasBallsDefaultConfig, options);
    };

    if (typeof window["metroChristmasBallsSetup"] !== undefined) {
        Metro.christmasBallsSetup(window["metroChristmasBallsSetup"]);
    }

    Metro.Component('christmas-balls', {
        init: function( options, elem ) {
            this._super(elem, options, ChristmasBallsDefaultConfig, {
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._preloadSounds();
            this._createStructure();
            this._createEvents();

            this._fireEvent('christmas-balls-create');

            element.click();
        },

        _preloadSounds: function(){
            for (var i = 1; i <= 36; i++) {
                new Audio(this.options.soundPath + "sound"+i+".mp3");
            }
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var inner;
            var i, f, b;
            var note = 1;

            element.addClass("christmas-balls");

            for (i = 0; i < 10; i++) {
                element.append(inner = $("<div>").addClass("christmas-balls-inner").css({
                    left: i * partSize
                }));
                for(b = 1; b <= 9; b++) {
                    $("<div>").addClass("ball ball-" + b).attr("data-note", note++).appendTo(inner);
                }
                for(f = 1; f <= 6; f++) {
                    $("<div>").addClass("fir fir-" + f).appendTo(inner);
                }

                if (note === 37) note = 1;
            }

        },

        _playSound: function(note){
            var o = this.options;
            var audioSrc = o.soundPath + "sound"+note+".mp3";
            var sound = new Audio(audioSrc);

            sound.volume = parseFloat(o.soundVolume);
            sound.addEventListener("loadeddata", function(){
                sound.play();
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var balls = element.find(".ball");

            balls.on(Metro.events.enter, function(e){
                var ball = $(this);
                var x = Metro.utils.pageXY(e).x - ball.offset().left;
                var w = ball.width();
                var left = x - w / 2 < 0;

                that._playSound(ball.attr("data-note"));

                if (!ball.data("animated")) {
                    ball.data("animated", true).addClass("bounce-" + (left ? "left" : "right"));
                    ball.on("animationend", function () {
                        ball.data("animated", false).removeClass("bounce-" + (left ? "left" : "right"));
                    })
                }
            })
        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, m4q));