/**
 * Editor can be toggled between code / visual editor.
 */

window.Editor.plugins.push({
    action: 'context',
    init: true,
    exec: function (instance) {
        var CSS_CODE_EDITOR = 'is-code-editor',
            CSS_VISUAL_EDITOR = 'is-visual-editor';

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        var sendMessage = function (msg) {
            msg.instanceId = instanceId;
            instance.$visualIFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
        };

        var toggleCodeEditor = function () {
            instance.$el.classList.remove(CSS_VISUAL_EDITOR);
            instance.$el.classList.add(CSS_CODE_EDITOR);

            instance.$el.dispatchEvent(new Event('editor:valueUpdate'));
        };

        /**
         * Displays visual editor.
         */
        var toggleVisualEditor = function () {
            // send information to iframe.
            var message = {
                action: 'update',
                value: instance.$input.value,
                mediaPath: getContentType(),
                id: instance.id
            };

            instance.$visualIFrame.contentWindow.postMessage(JSON.stringify(message), '*');

            instance.$el.classList.remove(CSS_CODE_EDITOR);
            instance.$el.classList.add(CSS_VISUAL_EDITOR);
        };


        if (instance.$el.classList.contains(CSS_CODE_EDITOR)) {
            toggleVisualEditor();
            return;
        }

        toggleCodeEditor();
    }
});