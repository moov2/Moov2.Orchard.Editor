(function () {
    var CSS_CODE_EDITOR = 'is-code-editor',
        CSS_VISUAL_EDITOR = 'is-visual-editor';

    var editorInstance = function ($el) {
        var instanceId = $el.getAttribute('data-id'),
            $visualEditor, $visualEditorIFrame, $input, $resizer;
        
        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        /**
         * Returns object representing instance.
         */
        var getInstance = function () {
            return {
                id: instanceId,
                $el: $el,
                $visualIFrame: $visualEditorIFrame
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

            switch (action) {
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
            $visualEditorIFrame = $el.querySelector('.js-editor-visual-iframe');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }

            window.addEventListener('message', onMessage);

            toggleCodeEditor();

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
            msg.instanceId = instanceId;
            $visualEditorIFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
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