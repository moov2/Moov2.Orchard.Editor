(function () {
    var editorInstance = function ($el) {
        var editor, session, $input;

        /**
         * Filters out unwanted annotations (e.g. warning about doctype) due to common
         * case is the HTML being edited is not a full HTML document but a piece of HTML.
         */
        var filterAnnotation = function () {
            var annotations = session.getAnnotations() || [], i = len = annotations.length;

            while (i--) {
                if (/doctype first\. Expected/.test(annotations[i].text)) {
                    annotations.splice(i, 1);
                }
            }

            if (len > annotations.length) {
                session.setAnnotations(annotations);
            }
        };

        /**
         * Returns textarea that needs to get turned into Ace editor.
         */
        var getTextArea = function () {
            return $el.querySelector('.editor--ace > textarea');
        };

        /**
         * Initialises Ace editor.
         */
        var init = function () {
            editor = ace.edit(getTextArea().id);
            session = editor.getSession();

            $input = $el.querySelector('.editor-input');

            editor.setTheme('ace/theme/monokai');
            editor.setShowPrintMargin(false);

            session.setMode('ace/mode/html');
            session.setUseWrapMode(true);

            session.on('changeAnnotation', filterAnnotation);
            session.on('change', update);

            window.addEventListener('editor:valueUpdate', updateSession);
        };

        /**
         * Updates hidden HTML input with latest content from Ace editor.
         */
        var update = function () {
            $input.value = session.getValue();
        };

        var updateSession = function () {
            session.setValue($input.value);
        };

        init();
    }

    /**
     * Initialises instances of the Ace editor.
     */
    var initialise = function () {
        var $editors = document.querySelectorAll('.js-editor');

        for (var i = 0; i < $editors.length; i++) {
            editorInstance($editors[i]);
        }
    };

    document.addEventListener('DOMContentLoaded', initialise);
})();