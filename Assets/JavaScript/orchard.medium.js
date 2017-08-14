(function () {
    var KEY_ESC = 27;
    var $editor, $iframe;

    /**
     * Checks if the user has keyed `ESC` to trigger the editor closing.
     */
    var checkKeyPressForHide = function (e) {
        if (e.keyCode === KEY_ESC) {
            hide();
        }
    };

    /**
     * Launches the medium editor.
     */
    var hide = function () {
        sendMessage({ action: 'destroy' });

        $editor.style.display = 'none';

        window.removeEventListener('keydown', checkKeyPressForHide);
    };

    /**
     * Initialises Medium editor.
     */
    var initialise = function () {
        $editor = document.querySelector('.js-editor-medium');
        $input = document.querySelector('.editor-input');
        $iframe = document.querySelector('.js-editor-medium-iframe');

        document.querySelector('.js-launch-medium-editor').addEventListener('click', show);
    };

    /**
     * Received a message from the iframe editor.
     */
    var onMessage = function (e) {
        if (e.data.action === 'close') {
            $input.value = e.data.value;
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
        window.addEventListener('keydown', checkKeyPressForHide);

        // send information to iframe.
        sendMessage({
            action: 'initialise',
            value: $input.value
        });

        $editor.style.display = '';
    };

    document.addEventListener('DOMContentLoaded', initialise);
    window.addEventListener('message', onMessage);
})();