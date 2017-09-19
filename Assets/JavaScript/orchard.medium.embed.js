(function () {
    var KEY_ESC = 27,
        UPLOAD_MEDIA_URL = '/Admin/Editor/Media';

    var editorInstance,
        $element, $applyBtn, $discardBtn, $state, $contentCss;

    /**
     * Apply changes and hide editor.
     */
    var apply = function () {
        sendMessage({
            action: 'apply',
            value: getValue()
        });
    };

    /**
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
        $applyBtn = document.querySelector('.js-apply-changes');
        $discardBtn = document.querySelector('.js-discard-changes');
        $state = document.querySelector('.js-state');
        $contentCss = document.querySelector('.js-editor-custom-css');
    };

    /**
     * Checks if the user has keyed `ESC` to trigger the editor closing.
     */
    var checkKeyPressForHide = function (e) {
        if (e.keyCode === KEY_ESC) {
            apply();
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
     * Sends message to parent to discard the changes and close the editor.
     */
    var discard = function () {
        sendMessage({
            action: 'discard',
            value: getValue()
        });
    }

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
        $applyBtn.addEventListener('click', apply)
        $discardBtn.addEventListener('click', discard)

        $state.innerHTML = data.state;
        $element.value = data.value;
        editorInstance = new MediumEditor($element);

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
    
    document.addEventListener('DOMContentLoaded', cacheDom);
    window.addEventListener('message', onMessage);
})();