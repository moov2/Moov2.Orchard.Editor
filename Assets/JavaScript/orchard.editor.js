﻿(function () {
    var CSS_CODE_EDITOR = 'is-code-editor',
        CSS_VISUAL_EDITOR = 'is-visual-editor';

    var editorInstance = function ($el) {
        var $visualEditor, $iframe, $input;

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        /**
         * User has clicked an action within the toolbar.
         */
        var handleAction = function (e) {
            var action = e.currentTarget.getAttribute('data-action');

            switch (action) {
                case 'insert-media':
                    openMediaPicker();
                    break;
                case 'toggle-code-editor':
                    toggleCodeEditor();
                    break;
                case 'toggle-visual-editor':
                    toggleVisualEditor();
                    break;
            }
        }

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            $visualEditor = $el.querySelector('.js-editor-visual');
            $input = $el.querySelector('.editor-input');
            $iframe = $el.querySelector('.js-editor-visual-iframe');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }

            window.addEventListener('message', onMessage);

            toggleCodeEditor();
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.action === 'update') {
                $input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                $el.dispatchEvent(new Event('editor:valueUpdate'));
            }
        };

        /**
         * Opens media library picker.
         */
        var openMediaPicker = function () {
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

                    $('html, body').css('overflow', '');

                    if (selectedData.length === 0) {
                        return;
                    }
                    
                    $el.dispatchEvent(new CustomEvent('editor:addMedia', {
                        detail: {
                            mediaItems: selectedData
                        }
                    }));
                }
            });
        };
    
        /**
         * Displays code editor.
         */
        var toggleCodeEditor = function () {
            $el.classList.remove(CSS_VISUAL_EDITOR);
            $el.classList.add(CSS_CODE_EDITOR);

            $el.dispatchEvent(new Event('editor:valueUpdate'));
        };

        /**
         * Displays visual editor.
         */
        var toggleVisualEditor = function () {
            // send information to iframe.
            sendMessage({
                action: 'update',
                value: $input.value,
                mediaPath: getContentType()
            });

            $el.classList.remove(CSS_CODE_EDITOR);
            $el.classList.add(CSS_VISUAL_EDITOR);
        };

        /**
         * Sends a message to the iframe.
         */
        var sendMessage = function (msg) {
            $iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
        };

        init()
    }

    /**
     * Initialises instances of the Ace editor.
     */
    var initialise = function () {
        var $editors = document.querySelectorAll('.js-editor');

        for (var i = 0; i < $editors.length; i++) {
            editorInstance($editors[i]);
        }
    };

    document.addEventListener('DOMContentLoaded', initialise);
})();