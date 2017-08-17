(function () {
    var $editor, $iframe, $html;

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

        $html.style.overflow = '';

        $editor.style.display = 'none';
    };

    /**
     * Initialises Medium editor.
     */
    var initialise = function () {
        $editor = document.querySelector('.js-editor-medium');
        $input = document.querySelector('.editor-input');
        $iframe = document.querySelector('.js-editor-medium-iframe');
        $html = document.querySelector('html');

        document.querySelector('.js-launch-medium-editor').addEventListener('click', show);
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

        $html.style.overflow = 'hidden';
        $editor.style.display = '';
    };

    document.addEventListener('DOMContentLoaded', initialise);
    window.addEventListener('message', onMessage);
})();