(function () {
    var editorInstance = function ($el) {
        var $editor, $html, $iframe, $input;

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        /**
         * Gets the `state`, which is a text representation of what the
         * user is editing.
         */
        var getState = function () {
            var $title = document.querySelector('#Title_Title'),
                $url = document.querySelector('#AutoroutePart_CurrentUrl'),
                contentType = getContentType(),
                state = '';

            if ($title) {
                state += ($url && $url.value) ? '<a href="/' + $url.value + '" target="_blank" title="View current page">' + $title.value + '</a>' : $title.value;
            } else {
                return 'HTML Element within Layout'
            }

            if (contentType && contentType !== 'LayoutElement') {
                state += ' (' + contentType + ')';
            }

            return state || 'Unknown';
        }

        /**
         * Launches the medium editor.
         */
        var hide = function () {
            sendMessage({ action: 'destroy' });

            window.removeEventListener('message', onMessage);

            $html.style.overflow = '';

            $editor.style.display = 'none';
        };

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            $editor = $el.querySelector('.js-editor-medium');
            $input = $el.querySelector('.editor-input');
            $iframe = $el.querySelector('.js-editor-medium-iframe');
            $html = document.querySelector('html');

            $el.querySelector('.js-launch-medium-editor').addEventListener('click', show);
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.action === 'apply') {
                $input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                window.dispatchEvent(new Event('editor:valueUpdate'));
            }

            if (e.data.action === 'apply' || e.data.action === 'discard') {
                hide();
            }
        };

        /**
         * Sends a message to the iframe.
         */
        var sendMessage = function (msg) {
            $iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
        };

        /**
         * Launches the medium editor.
         */
        var show = function () {
            // send information to iframe.
            sendMessage({
                action: 'initialise',
                value: $input.value,
                mediaPath: getContentType(),
                state: getState()
            });

            window.addEventListener('message', onMessage);

            $html.style.overflow = 'hidden';
            $editor.style.display = '';
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