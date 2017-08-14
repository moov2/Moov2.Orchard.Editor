(function () {
    var KEY_ESC = 27;
    var $editor, $editorElement, editorInstance;

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
        $input.value = $editorElement.value

        window.dispatchEvent(new Event('editor:valueUpdate'));

        $editor.style.display = 'none';

        editorInstance.destroy();
        editorInstance = undefined;

        window.removeEventListener('keydown', checkKeyPressForHide);
    };

    /**
     * Initialises Medium editor.
     */
    var initialise = function () {
        $editor = document.querySelector('.js-editor-medium');
        $input = document.querySelector('.editor-input');
        $editorElement = document.querySelector('.js-editor-medium-element');

        document.querySelector('.js-launch-medium-editor').addEventListener('click', show);
    };

    /**
     * Launches the medium editor.
     */
    var show = function () {
        window.addEventListener('keydown', checkKeyPressForHide);

        $editorElement.value = $input.value;
        editorInstance = new MediumEditor($editorElement);

        $editor.style.display = '';
    };

    document.addEventListener('DOMContentLoaded', initialise);
})();