(function () {
    var editorInstance = function ($el) {
        var $editor, $html, $iframe, $input;

        /**
         * Returns path for storing media.
         */
        var getMediaPath = function () {
            return document.querySelector('#Body_MediaPath').value;
        };

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
            if (e.data.action === 'close') {
                $input.value = html_beautify ? html_beautify(e.data.value) : e.data.value;
                window.dispatchEvent(new Event('editor:valueUpdate'));

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
                mediaPath: getMediaPath()
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