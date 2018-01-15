/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

;(function ($, window, document, undefined) {

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
        var adminIndex = location.href.toLowerCase().indexOf("/admin/"),
            _this = this,
            url;

        if (adminIndex === -1) {
            return;
        }

        url = location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true";

        $.colorbox({
            href: url,
            iframe: true,
            reposition: true,
            width: '90%',
            height: '90%',
            onLoad: function () {
                // hide the scrollbars from the main window
                $('html, body').css('overflow', 'hidden');
            },
            onClosed: function () {
                var selectedData = $.colorbox.selectedData;

                if (!selectedData || selectedData.length === 0) {
                    return;
                }

                _this.addMedia(selectedData);

                $('html, body').css('overflow', '');
            }
        });
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
        $(document)
            .on('click', $.proxy(this, 'unselectImage'));

        this.$el
            .on('click', 'figure img', $.proxy(this, 'selectImage'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lZGl1bS1lZGl0b3ItaW5zZXJ0LW1lZGlhLXBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1lZGl1bS1lZGl0b3ItaW5zZXJ0LW1lZGlhLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKiogRGVmYXVsdCB2YWx1ZXMgKi9cclxuICAgIHZhciBwbHVnaW5OYW1lID0gJ21lZGl1bUluc2VydCcsXHJcbiAgICAgICAgYWRkb25OYW1lID0gJ09yY2hhcmRNZWRpYScsIC8vIGZpcnN0IGNoYXIgaXMgdXBwZXJjYXNlXHJcbiAgICAgICAgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnPHNwYW4gY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L3NwYW4+JyxcclxuICAgICAgICAgICAgY2FwdGlvbnM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhcHRpb25QbGFjZWhvbGRlcjogJ1R5cGUgY2FwdGlvbiBmb3IgaW1hZ2UgKG9wdGlvbmFsKSdcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VzdG9tIEFkZG9uIG9iamVjdFxyXG4gICAgICpcclxuICAgICAqIFNldHMgb3B0aW9ucywgdmFyaWFibGVzIGFuZCBjYWxscyBpbml0KCkgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7RE9NfSBlbCAtIERPTSBlbGVtZW50IHRvIGluaXQgdGhlIHBsdWdpbiBvblxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIG92ZXJyaWRlIGRlZmF1bHRzXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcblxyXG4gICAgZnVuY3Rpb24gT3JjaGFyZE1lZGlhIChlbCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZWwgPSBlbDtcclxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gd2luZG93Lk1lZGl1bUluc2VydC5UZW1wbGF0ZXM7XHJcbiAgICAgICAgdGhpcy5jb3JlID0gdGhpcy4kZWwuZGF0YSgncGx1Z2luXycrIHBsdWdpbk5hbWUpO1xyXG5cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBwbHVnaW5OYW1lO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb3JlLmdldEVkaXRvcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29yZS5nZXRFZGl0b3IoKS5fc2VyaWFsaXplUHJlSW1hZ2VzID0gdGhpcy5jb3JlLmdldEVkaXRvcigpLnNlcmlhbGl6ZTtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLmdldEVkaXRvcigpLnNlcmlhbGl6ZSA9IHRoaXMuZWRpdG9yU2VyaWFsaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQWRkIGN1c3RvbSBjb250ZW50XHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrIG9uIHRoZSBhZGRvbidzIGljb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcblxyXG4gICAgT3JjaGFyZE1lZGlhLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFkbWluSW5kZXggPSBsb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIi9hZG1pbi9cIiksXHJcbiAgICAgICAgICAgIF90aGlzID0gdGhpcyxcclxuICAgICAgICAgICAgdXJsO1xyXG5cclxuICAgICAgICBpZiAoYWRtaW5JbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXJsID0gbG9jYXRpb24uaHJlZi5zdWJzdHIoMCwgYWRtaW5JbmRleCkgKyBcIi9BZG1pbi9PcmNoYXJkLk1lZGlhTGlicmFyeT9kaWFsb2c9dHJ1ZVwiO1xyXG5cclxuICAgICAgICAkLmNvbG9yYm94KHtcclxuICAgICAgICAgICAgaHJlZjogdXJsLFxyXG4gICAgICAgICAgICBpZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcG9zaXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHdpZHRoOiAnOTAlJyxcclxuICAgICAgICAgICAgaGVpZ2h0OiAnOTAlJyxcclxuICAgICAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBoaWRlIHRoZSBzY3JvbGxiYXJzIGZyb20gdGhlIG1haW4gd2luZG93XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbG9zZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZERhdGEgPSAkLmNvbG9yYm94LnNlbGVjdGVkRGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkRGF0YSB8fCBzZWxlY3RlZERhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIF90aGlzLmFkZE1lZGlhKHNlbGVjdGVkRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIE9yY2hhcmRNZWRpYS5wcm90b3R5cGUuYWRkSW1hZ2UgPSBmdW5jdGlvbiAoaW1hZ2UsIGlzU2VsZWN0KSB7XHJcbiAgICAgICAgdmFyICRwbGFjZSA9IHRoaXMuJGVsLmZpbmQoJy5tZWRpdW0taW5zZXJ0LWFjdGl2ZScpO1xyXG5cclxuICAgICAgICBpZiAoJHBsYWNlLmlzKCdwJykpIHtcclxuICAgICAgICAgICAgJHBsYWNlLnJlcGxhY2VXaXRoKCc8ZmlndXJlIGNsYXNzPVwibWVkaXVtLWluc2VydC1hY3RpdmVcIj4nICsgJHBsYWNlLmh0bWwoKSArICc8L2ZpZ3VyZT4nKTtcclxuICAgICAgICAgICAgJHBsYWNlID0gdGhpcy4kZWwuZmluZCgnLm1lZGl1bS1pbnNlcnQtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHBsYWNlLm5leHQoKS5pcygncCcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcmUubW92ZUNhcmV0KCRwbGFjZS5uZXh0KCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHBsYWNlLmFmdGVyKCc8cD48YnI+PC9wPicpOyAvLyBhZGQgZW1wdHkgcGFyYWdyYXBoIHNvIHdlIGNhbiBtb3ZlIHRoZSBjYXJldCB0byB0aGUgbmV4dCBsaW5lLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JlLm1vdmVDYXJldCgkcGxhY2UubmV4dCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciAkZmlndXJlID0gJCgnPGZpZ3VyZSBjbGFzcz1cIm1lZGl1bS1pbnNlcnQtYWN0aXZlXCI+PC9maWd1cmU+Jyk7XHJcbiAgICAgICAgICAgICRwbGFjZS5hZnRlcigkZmlndXJlKTtcclxuICAgICAgICAgICAgJHBsYWNlID0gJGZpZ3VyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRwbGFjZS5maW5kKCdicicpLnJlbW92ZSgpO1xyXG4gICAgICAgICRwbGFjZS5hcHBlbmQoJ1xcblxcdDxpbWcgc3JjPVwiJyArIGltYWdlLnJlc291cmNlICsgJ1wiIGFsdD1cIicgKyAoaW1hZ2UuYWx0ZXJuYXRlVGV4dCB8fCAnJykgKyAnXCIgLz5cXG4nKTtcclxuXHJcbiAgICAgICAgaWYgKGltYWdlLmNhcHRpb24pIHtcclxuICAgICAgICAgICAgJHBsYWNlLmFwcGVuZCgnXFx0PGZpZ2NhcHRpb24gY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiPicgKyBpbWFnZS5jYXB0aW9uICsgJzwvZmlnY2FwdGlvbj5cXG4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29yZS50cmlnZ2VySW5wdXQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc1NlbGVjdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvcmUuaGlkZUJ1dHRvbnMoKTtcclxuXHJcbiAgICAgICAgJHBsYWNlLmZpbmQoJ2ltZycpLmNsaWNrKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIE9yY2hhcmRNZWRpYS5wcm90b3R5cGUuYWRkTWVkaWEgPSBmdW5jdGlvbiAobWVkaWFDb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWRpYUNvbGxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3dpdGNoIChtZWRpYUNvbGxlY3Rpb25baV0uY29udGVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0ltYWdlJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEltYWdlKG1lZGlhQ29sbGVjdGlvbltpXSwgaSArIDEgPT09IG1lZGlhQ29sbGVjdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHRlbmQgZWRpdG9yJ3Mgc2VyaWFsaXplIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBTZXJpYWxpemVkIGRhdGFcclxuICAgICAqL1xyXG5cclxuICAgIE9yY2hhcmRNZWRpYS5wcm90b3R5cGUuZWRpdG9yU2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fc2VyaWFsaXplUHJlSW1hZ2VzKCk7XHJcblxyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciAkZGF0YSA9ICQoJzxkaXYgLz4nKS5odG1sKGRhdGFba2V5XS52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAkbGFzdDtcclxuXHJcbiAgICAgICAgICAgICRkYXRhLmZpbmQoJ2ZpZ2NhcHRpb24sIGZpZ3VyZScpLnJlbW92ZUF0dHIoJ2NvbnRlbnRlZGl0YWJsZScpO1xyXG4gICAgICAgICAgICAkZGF0YS5maW5kKCdmaWd1cmUnKS5yZW1vdmVDbGFzcygnbWVkaXVtLWluc2VydC1pbWFnZScpO1xyXG4gICAgICAgICAgICAkZGF0YS5maW5kKCdmaWdjYXB0aW9uJykucmVtb3ZlQXR0cignZGF0YS1wbGFjZWhvbGRlcicpLnJlbW92ZUNsYXNzKCdtZWRpdW0taW5zZXJ0LWNhcHRpb24tcGxhY2Vob2xkZXInKTtcclxuICAgICAgICAgICAgJGRhdGEuZmluZCgnKltjbGFzcz1cIlwiXScpLnJlbW92ZUF0dHIoJ2NsYXNzJyk7XHJcblxyXG4gICAgICAgICAgICBkYXRhW2tleV0udmFsdWUgPSAkZGF0YS5odG1sKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICAgKi9cclxuXHJcbiAgICBPcmNoYXJkTWVkaWEucHJvdG90eXBlLmV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLCAndW5zZWxlY3RJbWFnZScpKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWxcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsICdmaWd1cmUgaW1nJywgJC5wcm94eSh0aGlzLCAnc2VsZWN0SW1hZ2UnKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBDb3JlIG9iamVjdFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gQ29yZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgT3JjaGFyZE1lZGlhLnByb3RvdHlwZS5nZXRDb3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvcmU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6YXRpb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcblxyXG4gICAgT3JjaGFyZE1lZGlhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW1hZ2VzID0gdGhpcy4kZWwuZmluZCgnZmlndXJlJyk7XHJcblxyXG4gICAgICAgICRpbWFnZXMuYXR0cignY29udGVudGVkaXRhYmxlJywgZmFsc2UpO1xyXG4gICAgICAgICRpbWFnZXMuZmluZCgnZmlnY2FwdGlvbicpLmF0dHIoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdCBjbGlja2VkIGltYWdlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxyXG4gICAgICogQHJldHVybnMge3ZvaWR9XHJcbiAgICAgKi9cclxuXHJcbiAgICBPcmNoYXJkTWVkaWEucHJvdG90eXBlLnNlbGVjdEltYWdlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgICRpbWFnZTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvcmUub3B0aW9ucy5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICRpbWFnZSA9ICQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgICB0aGlzLiRjdXJyZW50SW1hZ2UgPSAkaW1hZ2U7XHJcblxyXG4gICAgICAgIC8vIEhpZGUga2V5Ym9hcmQgb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICB0aGlzLiRlbC5ibHVyKCk7XHJcblxyXG4gICAgICAgICRpbWFnZS5hZGRDbGFzcygnbWVkaXVtLWluc2VydC1pbWFnZS1hY3RpdmUnKTtcclxuICAgICAgICAkaW1hZ2UuY2xvc2VzdCgnLm1lZGl1bS1pbnNlcnQtaW1hZ2VzJykuYWRkQ2xhc3MoJ21lZGl1bS1pbnNlcnQtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmNhcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvcmUuYWRkQ2FwdGlvbigkaW1hZ2UuY2xvc2VzdCgnZmlndXJlJyksIHRoYXQub3B0aW9ucy5jYXB0aW9uUGxhY2Vob2xkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuc2VsZWN0IHNlbGVjdGVkIGltYWdlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxyXG4gICAgICogQHJldHVybnMge3ZvaWR9XHJcbiAgICAgKi9cclxuXHJcbiAgICBPcmNoYXJkTWVkaWEucHJvdG90eXBlLnVuc2VsZWN0SW1hZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciAkZWwgPSAkKGUudGFyZ2V0KSxcclxuICAgICAgICAgICAgJGltYWdlID0gdGhpcy4kZWwuZmluZCgnLm1lZGl1bS1pbnNlcnQtaW1hZ2UtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIGlmICgkZWwuaXMoJ2ltZycpICYmICRlbC5oYXNDbGFzcygnbWVkaXVtLWluc2VydC1pbWFnZS1hY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAkaW1hZ2Uubm90KCRlbCkucmVtb3ZlQ2xhc3MoJ21lZGl1bS1pbnNlcnQtaW1hZ2UtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29yZS5yZW1vdmVDYXB0aW9ucygkZWwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkaW1hZ2UucmVtb3ZlQ2xhc3MoJ21lZGl1bS1pbnNlcnQtaW1hZ2UtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIGlmICgkZWwuaXMoJy5tZWRpdW0taW5zZXJ0LWNhcHRpb24tcGxhY2Vob2xkZXInKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUucmVtb3ZlQ2FwdGlvblBsYWNlaG9sZGVyKCRpbWFnZS5jbG9zZXN0KCdmaWd1cmUnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWwuaXMoJ2ZpZ2NhcHRpb24nKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnJlbW92ZUNhcHRpb25zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRjdXJyZW50SW1hZ2UgPSBudWxsO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogQWRkb24gaW5pdGlhbGl6YXRpb24gKi9cclxuXHJcbiAgICAkLmZuW3BsdWdpbk5hbWUgKyBhZGRvbk5hbWVdID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ3BsdWdpbl8nICsgcGx1Z2luTmFtZSArIGFkZG9uTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncGx1Z2luXycgKyBwbHVnaW5OYW1lICsgYWRkb25OYW1lLCBuZXcgT3JjaGFyZE1lZGlhKHRoaXMsIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
