(function () {
    var KEY_ESC = 27,
        UPLOAD_MEDIA_URL = '/Admin/Editor/Media';

    var editorInstance,
        $element, $closeBtn, $state, $contentCss;

    /**
     * Hides thed editor.
     */
    var close = function () {
        sendMessage({
            action: 'close',
            value: getValue()
        });
    };

    /**
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
        $closeBtn = document.querySelector('.js-close-btn');
        $state = document.querySelector('.js-state');
        $contentCss = document.querySelector('.js-editor-custom-css');
    };

    /**
     * Checks if the user has keyed `ESC` to trigger the editor closing.
     */
    var checkKeyPressForHide = function (e) {
        if (e.keyCode === KEY_ESC) {
            close();
        }
    };

    /**
     * Destroys the instance of medium editor.
     */
    var destroy = function () {
        editorInstance.destroy();
        editorInstance = undefined;

        window.removeEventListener('keydown', checkKeyPressForHide);
    };

    /**
     * Gets the value.
     */
    var getValue = function () {
        return editorInstance.serialize()[editorInstance.elements[0].id].value;
    };
    
    /**
     * Initialises Medium editor.
     */
    var initialise = function (data) {
        window.addEventListener('keydown', checkKeyPressForHide);
        $closeBtn.addEventListener('click', close)

        $state.innerHTML = data.state;
        $element.value = data.value;
        editorInstance = new MediumEditor($element);

        editorInstance.subscribe('editableInput', update);

        if ($contentCss.value !== '') {
            editorInstance.elements[0].className += ' ' + $contentCss.value;
        }

        $($element).mediumInsert({
            editor: editorInstance,
            addons: {
                images: false,
                embeds: false,
                orchardMedia: true
            }
        });
    };

    /**
     * Process message from the parent window.
     */
    var onMessage = function (e) {
        var data = JSON.parse(e.data);

        if (data.action === 'initialise') {
            initialise(data);
        }

        if (data.action === 'destroy') {
            destroy();
        }
    };

    /**
     * Sends message to parent window.
     */
    var sendMessage = function (msg) {
        window.parent.postMessage(msg, '*');
    };

    /**
     * Sends message to parent window to update value.
     */
    var update = function () {
        sendMessage({
            action: 'update',
            value: getValue()
        });
    };
    
    document.addEventListener('DOMContentLoaded', cacheDom);
    window.addEventListener('message', onMessage);
})();