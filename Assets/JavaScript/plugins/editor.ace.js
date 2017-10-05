window.Editor.plugins.push({
    action: 'ace',
    init: true,
    exec: function (instance) {
        var editor, session, $input;

        /**
         * Add provided media to editor, dictated by current ace editor selection state.
         */
        var addMedia = function (e) {
            if (!e || !e.detail || !e.detail.mediaItems) {
                return;
            }

            for (var i = 0; i < e.detail.mediaItems.length; i++) {

                if (e.detail.mediaItems[i].contentType.toLowerCase() === 'document') {
                    insertDocument(e.detail.mediaItems[i]);
                    continue;
                }

                if (e.detail.mediaItems[i].contentType.toLowerCase() === 'image' || e.detail.mediaItems[i].contentType.toLowerCase() === 'vectorimage') {
                    insertImage(e.detail.mediaItems[i]);
                    continue;
                }
            }
        };

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
            return instance.$el.querySelector('.js-editor-code > textarea');
        };

        /**
         * Initialises Ace editor.
         */
        var init = function () {
            editor = ace.edit(getTextArea().id);
            session = editor.getSession();

            $input = instance.$el.querySelector('.editor-input');

            editor.setTheme('ace/theme/monokai');
            editor.setShowPrintMargin(false);
            editor.$blockScrolling = Infinity;

            session.setMode('ace/mode/html');
            session.setUseWrapMode(true);

            session.on('changeAnnotation', filterAnnotation);
            session.on('change', update);

            $input.addEventListener('change', updateSession);
            instance.$el.addEventListener('editor:valueUpdate', updateSession);
            instance.$el.addEventListener('editor:addMedia', addMedia);
            instance.$el.addEventListener('editor:insertHtml', insertHTML);
        };

        /**
         * Inserts hyperlink for document.
         */
        var insertDocument = function(asset) {
            var cursorPosition = editor.selection.getRange().start,
                line = editor.session.getLine(cursorPosition.row);

            // inserting media URL between two quotes
            if (line.substr(cursorPosition.column - 5, 5).toLowerCase() === 'href="') {
                editor.insert(asset.resource);
                return;
            }

            // inserting media URL with quotes
            if (line.substr(cursorPosition.column - 4, 4).toLowerCase() === 'href=') {
                editor.insert('"' + asset.resource + '"');
                return;
            }

            // ensure that the current cursor position warrants a complete anchor HTML
            // tag instead of the URL.
            var character = line.substr(cursorPosition.column - 1, 1).toLowerCase()

            if (character === '>' || character === '' || character === ' ') {
                editor.insert('<a href="' + asset.resource + '" title="' + asset.alternateText + '" class="" />\n');
                return;
            }

            editor.insert(asset.resource);        
        }

        /**
         * Inserts an image at the current cursor position.
         */
        var insertImage = function (image) {
            var cursorPosition = editor.selection.getRange().start,
                line = editor.session.getLine(cursorPosition.row);

            // inserting media URL between two quotes
            if (line.substr(cursorPosition.column - 5, 5).toLowerCase() === 'src="') {
                editor.insert(image.resource);
                return;
            }

            // inserting media URL with quotes
            if (line.substr(cursorPosition.column - 4, 4).toLowerCase() === 'src=') {
                editor.insert('"' + image.resource + '"');
                return;
            }

            // inserting media as an inline style
            if (line.substr(cursorPosition.column - 4, 4).toLowerCase() === 'url(') {
                editor.insert(image.resource);
                return;
            }

            // ensure that the current cursor position warrants a complete img HTML
            // tag instead of the URL.
            var character = line.substr(cursorPosition.column - 1, 1).toLowerCase()

            if (character === '>' || character === '' || character === ' ') {
                editor.insert('<img src="' + image.resource + '" alt="' + image.alternateText + '" class="" />\n');
                return;
            }

            editor.insert(image.resource);
        };

        /**
         * Inserts HTML into editor.
         */
        var insertHTML = function (e) {
            if (!e || !e.detail || !e.detail.html) {
                return;
            }

            editor.insert(e.detail.html);
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
});