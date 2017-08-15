(function () {
    var KEY_ESC = 27,
        UPLOAD_MEDIA_URL = '/Admin/Editor/Media';

    var editorInstance,
        $element;

    /**
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
    };

    /**
     * Checks if the user has keyed `ESC` to trigger the editor closing.
     */
    var checkKeyPressForHide = function (e) {
        if (e.keyCode === KEY_ESC) {
            hide();
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
     * Hides the medium editor
     */
    var hide = function () {
        sendMessage({
            action: 'close',
            value: getValue()
        });
    };
    
    /**
     * Initialises Medium editor.
     */
    var initialise = function (data) {
        window.addEventListener('keydown', checkKeyPressForHide);

        $element.value = data.value;
        editorInstance = new MediumEditor($element, {
            buttonLabels: 'fontawesome',
            extensions: {
                'insert': new MediumEditorInsert({
                    addons: {
                        images: {
                            descriptionPlaceholder: '',
                            uploadUrl: UPLOAD_MEDIA_URL + '?mediaPath=' + data.mediaPath
                        }
                    }
                })
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