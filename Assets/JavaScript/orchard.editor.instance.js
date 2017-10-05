﻿(function () {
    var editorInstance = function ($el) {
        var instanceId = $el.getAttribute('data-id'),
            $input;
    

        /**
         * Returns object representing instance.
         */
        var getInstance = function () {
            return {
                id: instanceId,
                $el: $el,
                $visualIFrame: $el.querySelector('.js-editor-visual-iframe'),
                $input: $input
            };
        }

        /**
         * User has clicked an action within the toolbar.
         */
        var handleAction = function (e) {
            var action = e.currentTarget.getAttribute('data-action'),
                plugins = window.Editor.plugins;

            for (var i = 0; i < plugins.length; i++) {
                if (plugins[i].action === action) {
                    plugins[i].exec(getInstance());
                    return;
                }
            }
        }

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            $input = $el.querySelector('.editor-input');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }

            window.addEventListener('message', onMessage);

            // loop over plugins and execute any that are flagged to
            // exec on initialise.
            for (var i = 0; i < window.Editor.plugins.length; i++) {
                if (window.Editor.plugins[i].init) {
                    window.Editor.plugins[i].exec(getInstance());
                }
            }
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.id !== instanceId) {
                return;
            }

            if (e.data.action === 'update') {
                $input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                $el.dispatchEvent(new Event('editor:valueUpdate'));
            }
        };

        init();
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