/**
 * Editor can be toggled between code / visual editor.
 */

window.Editor.plugins.push({
    action: 'context',
    init: true,
    exec: function (instance) {
        var CSS_CODE_EDITOR = 'is-code-editor',
            CSS_VISUAL_EDITOR = 'is-visual-editor',
            hasReceivedInit = false,
            $visualIFrame = instance.$el.querySelector('.js-editor-visual-iframe');

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        var onMessage = function (e) {
            if (!hasReceivedInit && e.data.action === 'init') {
                hasReceivedInit = true;
                sendInitInfo();
            }
        };

        var sendMessage = function (msg) {
            $visualIFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
        };

        var sendInitInfo = function () {
            sendMessage({
                action: 'update',
                value: instance.$input.value,
                mediaPath: getContentType(),
                id: instance.id
            });
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
            sendInitInfo();

            instance.$el.classList.remove(CSS_CODE_EDITOR);
            instance.$el.classList.add(CSS_VISUAL_EDITOR);
        };
        
        if (instance.$el.classList.contains(CSS_VISUAL_EDITOR)) {
            toggleCodeEditor();
            return;
        }

        if (instance.$el.classList.contains(CSS_CODE_EDITOR)) {
            toggleVisualEditor();
            return;
        }

        toggleVisualEditor();

        window.addEventListener('message', onMessage);
    }
});