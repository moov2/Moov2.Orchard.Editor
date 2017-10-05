(function () {
    var KEY_ESC = 27,
        UPLOAD_MEDIA_URL = '/Admin/Editor/Media';

    var hasInit = false,
        editorInstance, instanceId,
        $element, $contentCss;

    /**
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
        $contentCss = document.querySelector('.js-editor-custom-css');
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
        data.value = addExtraParagraph(data.value);
        $element.value = data.value;
        editorInstance = new MediumEditor($element);

        editorInstance.subscribe('editableInput', sendUpdate);

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

        hasInit = true;
    };

    /**
     * Process message from the parent window.
     */
    var onMessage = function (e) {
        var data = JSON.parse(e.data);

        instanceId = data.id;

        if (data.action === 'update') {
            receivedUpdate(data);
        }
    };

    /**
     * Receives a message from parent window to update value.
     */
    var receivedUpdate = function (data) {
        if (!hasInit) {
            initialise(data);
            setFocus();
            return;
        }

        data.value = addExtraParagraph(data.value);

        editorInstance.setContent(data.value);
        setFocus();
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
    var sendUpdate = function () {
        sendMessage({
            action: 'update',
            id: instanceId,
            value: getValue()
        });
    };

    /**
     * Set focus on medium editor
     */
    var setFocus = function () {
        if(!editorInstance) {
            return;
        }

        editorInstance.selectElement(editorInstance.elements[0]);
        MediumEditor.selection.moveCursor(document, editorInstance.elements[0], 0);
    };

    /**
     * Add extra paragraph if needed
     */
    var addExtraParagraph = function (value) {
        if(value.length > 0 && !value.endsWith('</p>')) {
            value = value + '<p><br /></p>';
        }

        return value;
    };
    
    document.addEventListener('DOMContentLoaded', cacheDom);
    window.addEventListener('message', onMessage);
})();