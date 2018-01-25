﻿(function () {
    var KEY_ESC = 27,
        UPLOAD_MEDIA_URL = '/Admin/Editor/Media';

    var hasInit = false,
        editorInstance, instanceId,
        $element, $contentCss;

    /**
     * Add extra paragraph if needed
     */
    var addExtraParagraph = function (value) {
        if(!value || !value.endsWith('</p>')) {
            value = value + '<p><br /></p>';
        }

        return value;
    };

    /**
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
        $contentCss = document.querySelector('.js-editor-custom-css');
    };

    var loaded = function () {
        cacheDom();

        if (!hasInit) {
            sendMessage({
                action: 'init',
                id: instanceId
            });
        }
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

        editorInstance.elements[0].setAttribute('data-instance-id', instanceId);

        $($element).mediumInsert({
            editor: editorInstance,
            addons: {
                images: false,
                embeds: false,
                orchardMedia: true
            }
        });

        if (editorInstance.elements && editorInstance.elements.length > 0) {
            editorInstance.elements[0].style.display = 'block';
        }

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
        var isEmpty = data.value === '';

        if (!hasInit) {
            initialise(data);
        }

        data.value = addExtraParagraph(data.value);
        editorInstance.setContent(data.value);

        if (isEmpty) {
            setFocus();
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
    
    document.addEventListener('DOMContentLoaded', loaded);
    window.addEventListener('message', onMessage);
})();