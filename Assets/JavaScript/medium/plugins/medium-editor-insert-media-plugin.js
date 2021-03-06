﻿;(function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'OrchardMedia', // first char is uppercase
        defaults = {
            label: '<span class="fa fa-camera"></span>',
            captions: true,
            captionPlaceholder: 'Type caption for image (optional)'
        };

    /**
     * Custom Addon object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */

    function OrchardMedia (el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_'+ pluginName);

        this.options = $.extend(true, {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        if (this.core.getEditor()) {
            this.core.getEditor()._serializePreImages = this.core.getEditor().serialize;
            this.core.getEditor().serialize = this.editorSerialize;
        }

        this.init();
    }

        /**
     * Add custom content
     *
     * This function is called when user click on the addon's icon
     *
     * @return {void}
     */

    OrchardMedia.prototype.add = function () {
        window.parent.postMessage({
            action: 'begin-insert-media',
            id: this.$el.data('instance-id')
        }, '*');
    };

    OrchardMedia.prototype.addImage = function (image, isSelect) {
        var $place = this.$el.find('.medium-insert-active');

        if ($place.is('p')) {
            $place.replaceWith('<figure class="medium-insert-active">' + $place.html() + '</figure>');
            $place = this.$el.find('.medium-insert-active');

            if ($place.next().is('p')) {
                this.core.moveCaret($place.next());
            } else {
                $place.after('<p><br></p>'); // add empty paragraph so we can move the caret to the next line.
                this.core.moveCaret($place.next());
            }
        } else {
            var $figure = $('<figure class="medium-insert-active"></figure>');
            $place.after($figure);
            $place = $figure;
        }

        $place.find('br').remove();
        $place.append('\n\t<img src="' + image.resource + '" alt="' + (image.alternateText || '') + '" />\n');

        if (image.caption) {
            $place.append('\t<figcaption contenteditable="true">' + image.caption + '</figcaption>\n');
        }

        this.core.triggerInput();

        if (!isSelect) {
            return;
        }

        this.core.hideButtons();

        $place.find('img').click();
    };

    OrchardMedia.prototype.addMedia = function (mediaCollection) {
        for (var i = 0; i < mediaCollection.length; i++) {
            switch (mediaCollection[i].contentType) {
                case 'Image':
                    this.addImage(mediaCollection[i], i + 1 === mediaCollection.length);
                    break;
                default:
                    continue;
            }
        }
    };

    /**
     * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

    OrchardMedia.prototype.editorSerialize = function () {
        var data = this._serializePreImages();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value),
                $last;

            $data.find('figcaption, figure').removeAttr('contenteditable');
            $data.find('figure').removeClass('medium-insert-image');
            $data.find('figcaption').removeAttr('data-placeholder').removeClass('medium-insert-caption-placeholder');
            $data.find('*[class=""]').removeAttr('class');

            data[key].value = $data.html();
        });
        

        return data;
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    OrchardMedia.prototype.events = function () {
        var _this = this;

        $(document).on('click', $.proxy(this, 'unselectImage'));
        this.$el.on('click', 'figure img', $.proxy(this, 'selectImage'));

        window.addEventListener('message', function (e) {
            var data = JSON.parse(e.data);

            if (data.id === _this.$el.data('instance-id') && data.action === 'insert-media') {
                _this.addMedia(data.selectedMedia);
            }
        });
    };

    /**
     * Get the Core object
     *
     * @return {object} Core object
     */
    OrchardMedia.prototype.getCore = function () {
        return this.core;
    };

    /**
     * Initialization
     *
     * @return {void}
     */

    OrchardMedia.prototype.init = function () {
        var $images = this.$el.find('figure');

        $images.attr('contenteditable', false);
        $images.find('figcaption').attr('contenteditable', true);

        this.events();
    };

    /**
     * Select clicked image
     *
     * @param {Event} e
     * @returns {void}
     */

    OrchardMedia.prototype.selectImage = function (e) {
        var that = this,
            $image;

        if (!this.core.options.enabled) {
            return;
        }

        e.stopPropagation();

        $image = $(e.target);

        this.$currentImage = $image;

        // Hide keyboard on mobile devices
        this.$el.blur();

        $image.addClass('medium-insert-image-active');
        $image.closest('.medium-insert-images').addClass('medium-insert-active');

        setTimeout(function () {
            if (that.options.captions) {
                that.core.addCaption($image.closest('figure'), that.options.captionPlaceholder);
            }
        }, 50);
    };

    /**
     * Unselect selected image
     *
     * @param {Event} e
     * @returns {void}
     */

    OrchardMedia.prototype.unselectImage = function (e) {
        var $el = $(e.target),
            $image = this.$el.find('.medium-insert-image-active');

        if ($el.is('img') && $el.hasClass('medium-insert-image-active')) {
            $image.not($el).removeClass('medium-insert-image-active');
            this.core.removeCaptions($el);
            return;
        }

        $image.removeClass('medium-insert-image-active');

        if ($el.is('.medium-insert-caption-placeholder')) {
            this.core.removeCaptionPlaceholder($image.closest('figure'));
        } else if ($el.is('figcaption') === false) {
            this.core.removeCaptions();
        }

        this.$currentImage = null;
    };

    /** Addon initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new OrchardMedia(this, options));
            }
        });
    };

})(jQuery, window, document);