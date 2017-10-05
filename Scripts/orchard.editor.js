/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

window.Editor = window.Editor || {
    plugins: [],
    instances: []
};
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

            var alt, cursorPosition, line, url;

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
/**
 * Editor can be toggled between code / visual editor.
 */

window.Editor.plugins.push({
    action: 'context',
    init: true,
    exec: function (instance) {
        var CSS_CODE_EDITOR = 'is-code-editor',
            CSS_VISUAL_EDITOR = 'is-visual-editor',
            $visualIFrame = instance.$el.querySelector('.js-editor-visual-iframe');

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        var sendMessage = function (msg) {
            $visualIFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
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

            $visualIFrame.contentWindow.postMessage(JSON.stringify(message), '*');

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
/**
 * Switches editor between fullscreen and normal.
 */

window.Editor.plugins.push({
    action: 'toggle-fullscreen',
    init: false,
    exec: function (instance) {
        var CSS_FULLSCREEN = 'is-fullscreen',
            KEY_ESC = 27;

        var toggleFullscreen = function (e) {
            if (e && e.keyCode !== KEY_ESC) {
                return;
            }
    
            if (instance.$el.classList.contains(CSS_FULLSCREEN)) {
                instance.$el.classList.remove(CSS_FULLSCREEN);
    
                document.querySelector('html').style.overflow = '';
                window.removeEventListener('keydown', toggleFullscreen);
                return;
            }
    
            instance.$el.classList.add(CSS_FULLSCREEN);
            document.querySelector('html').style.overflow = 'hidden';
    
            window.addEventListener('keydown', toggleFullscreen);
        };

        toggleFullscreen();
    }
});
/**
 * Inserts media into the editor from the Orchard media library.
 */

window.Editor.plugins.push({
    action: 'insert-media',
    init: false,
    exec: function (instance) {
        var adminIndex = location.href.toLowerCase().indexOf("/admin/"),
            cachedScrollPosition = 0;

        if (adminIndex === -1) {
            return;
        }

        $.colorbox({
            href: location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true",
            iframe: true,
            reposition: true,
            width: '90%',
            height: '90%',
            onLoad: function () {
                cachedScrollPosition = $('html').scrollTop();
                // hide the scrollbars from the main window
                $('html, body').css('overflow', 'hidden');
            },
            onClosed: function () {
                var selectedData = $.colorbox.selectedData;

                $('html, body').css('overflow', '');
                $('html').scrollTop(cachedScrollPosition);

                if(!selectedData || selectedData.length === 0) {
                    return;
                }
                
                instance.$el.dispatchEvent(new CustomEvent('editor:addMedia', {
                    detail: {
                        mediaItems: selectedData
                    }
                }));
            }
        });
    }
});
/**
 * Editor can be resized to custom height.
 */

window.Editor.plugins.push({
    action: 'resize',
    init: true,
    exec: function (instance) {
        var initialY, initialHeight,
            $resizer = instance.$el.querySelector('.js-editor-resizer'),
            $visualIFrame = instance.$el.querySelector('.js-editor-visual-iframe');
        
        var dispose = function () {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', dispose);
            $visualIFrame.contentWindow.removeEventListener('mousemove', onIFrameDrag);
            $visualIFrame.contentWindow.removeEventListener('mouseup', dispose);
        };

        var onDrag = function (e) {
            instance.$el.style.height = (initialHeight + (e.clientY - initialY)) + 'px';
        };

        var onIFrameDrag = function (e) {
            var boundingClientRect = $visualIFrame.getBoundingClientRect(),
                evt = new CustomEvent('mousemove', { bubbles: true, cancelable: false });

            evt.clientX = e.clientX + boundingClientRect.left;
            evt.clientY = e.clientY + boundingClientRect.top;

            $visualIFrame.dispatchEvent(evt);
        };

        $resizer.addEventListener('mousedown', function (e) {
            initialY = e.clientY;
            initialHeight = instance.$el.offsetHeight;

            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', dispose);
            $visualIFrame.contentWindow.addEventListener('mousemove', onIFrameDrag);
            $visualIFrame.contentWindow.addEventListener('mouseup', dispose);
        });
    }
});
(function () {
    var editorInstance = function ($el) {
        var state = {
            $el: $el,
            id: $el.getAttribute('data-id')
        };

        /**
         * User has clicked an action within the toolbar.
         */
        var handleAction = function (e) {
            var action = e.currentTarget.getAttribute('data-action'),
                plugins = window.Editor.plugins;

            for (var i = 0; i < plugins.length; i++) {
                if (plugins[i].action === action) {
                    plugins[i].exec(state);
                    return;
                }
            }
        }

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            state.$input = $el.querySelector('.editor-input');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }

            window.addEventListener('message', onMessage);

            // loop over plugins and execute any that are flagged to
            // exec on initialise.
            for (var i = 0; i < window.Editor.plugins.length; i++) {
                if (window.Editor.plugins[i].init) {
                    window.Editor.plugins[i].exec(state);
                }
            }
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.id !== state.id) {
                return;
            }

            if (e.data.action === 'update') {
                state.$input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                $el.dispatchEvent(new Event('editor:valueUpdate'));
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yY2hhcmQuZWRpdG9yLmpzIiwiZWRpdG9yLmFjZS5qcyIsImVkaXRvci5jb250ZXh0LmpzIiwiZWRpdG9yLmZ1bGxzY3JlZW4uanMiLCJlZGl0b3IuaW5zZXJ0TWVkaWEuanMiLCJlZGl0b3IucmVzaXplci5qcyIsIm9yY2hhcmQuZWRpdG9yLmluc3RhbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQUxBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJvcmNoYXJkLmVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5FZGl0b3IgPSB3aW5kb3cuRWRpdG9yIHx8IHtcbiAgICBwbHVnaW5zOiBbXSxcbiAgICBpbnN0YW5jZXM6IFtdXG59OyIsIndpbmRvdy5FZGl0b3IucGx1Z2lucy5wdXNoKHtcbiAgICBhY3Rpb246ICdhY2UnLFxuICAgIGluaXQ6IHRydWUsXG4gICAgZXhlYzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBlZGl0b3IsIHNlc3Npb24sICRpbnB1dDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIHByb3ZpZGVkIG1lZGlhIHRvIGVkaXRvciwgZGljdGF0ZWQgYnkgY3VycmVudCBhY2UgZWRpdG9yIHNlbGVjdGlvbiBzdGF0ZS5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBhZGRNZWRpYSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIWUgfHwgIWUuZGV0YWlsIHx8ICFlLmRldGFpbC5tZWRpYUl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWx0LCBjdXJzb3JQb3NpdGlvbiwgbGluZSwgdXJsO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuZGV0YWlsLm1lZGlhSXRlbXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLmRldGFpbC5tZWRpYUl0ZW1zW2ldLmNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0RG9jdW1lbnQoZS5kZXRhaWwubWVkaWFJdGVtc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlLmRldGFpbC5tZWRpYUl0ZW1zW2ldLmNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkgPT09ICdpbWFnZScgfHwgZS5kZXRhaWwubWVkaWFJdGVtc1tpXS5jb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpID09PSAndmVjdG9yaW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc2VydEltYWdlKGUuZGV0YWlsLm1lZGlhSXRlbXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRlcnMgb3V0IHVud2FudGVkIGFubm90YXRpb25zIChlLmcuIHdhcm5pbmcgYWJvdXQgZG9jdHlwZSkgZHVlIHRvIGNvbW1vblxuICAgICAgICAgKiBjYXNlIGlzIHRoZSBIVE1MIGJlaW5nIGVkaXRlZCBpcyBub3QgYSBmdWxsIEhUTUwgZG9jdW1lbnQgYnV0IGEgcGllY2Ugb2YgSFRNTC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBmaWx0ZXJBbm5vdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFubm90YXRpb25zID0gc2Vzc2lvbi5nZXRBbm5vdGF0aW9ucygpIHx8IFtdLCBpID0gbGVuID0gYW5ub3RhdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKC9kb2N0eXBlIGZpcnN0XFwuIEV4cGVjdGVkLy50ZXN0KGFubm90YXRpb25zW2ldLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFubm90YXRpb25zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsZW4gPiBhbm5vdGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnNldEFubm90YXRpb25zKGFubm90YXRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0ZXh0YXJlYSB0aGF0IG5lZWRzIHRvIGdldCB0dXJuZWQgaW50byBBY2UgZWRpdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGdldFRleHRBcmVhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLiRlbC5xdWVyeVNlbGVjdG9yKCcuanMtZWRpdG9yLWNvZGUgPiB0ZXh0YXJlYScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXNlcyBBY2UgZWRpdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlZGl0b3IgPSBhY2UuZWRpdChnZXRUZXh0QXJlYSgpLmlkKTtcbiAgICAgICAgICAgIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpO1xuXG4gICAgICAgICAgICAkaW5wdXQgPSBpbnN0YW5jZS4kZWwucXVlcnlTZWxlY3RvcignLmVkaXRvci1pbnB1dCcpO1xuXG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGhlbWUoJ2FjZS90aGVtZS9tb25va2FpJyk7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcbiAgICAgICAgICAgIGVkaXRvci4kYmxvY2tTY3JvbGxpbmcgPSBJbmZpbml0eTtcblxuICAgICAgICAgICAgc2Vzc2lvbi5zZXRNb2RlKCdhY2UvbW9kZS9odG1sJyk7XG4gICAgICAgICAgICBzZXNzaW9uLnNldFVzZVdyYXBNb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBzZXNzaW9uLm9uKCdjaGFuZ2VBbm5vdGF0aW9uJywgZmlsdGVyQW5ub3RhdGlvbik7XG4gICAgICAgICAgICBzZXNzaW9uLm9uKCdjaGFuZ2UnLCB1cGRhdGUpO1xuXG4gICAgICAgICAgICAkaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlU2Vzc2lvbik7XG4gICAgICAgICAgICBpbnN0YW5jZS4kZWwuYWRkRXZlbnRMaXN0ZW5lcignZWRpdG9yOnZhbHVlVXBkYXRlJywgdXBkYXRlU2Vzc2lvbik7XG4gICAgICAgICAgICBpbnN0YW5jZS4kZWwuYWRkRXZlbnRMaXN0ZW5lcignZWRpdG9yOmFkZE1lZGlhJywgYWRkTWVkaWEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGh5cGVybGluayBmb3IgZG9jdW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaW5zZXJ0RG9jdW1lbnQgPSBmdW5jdGlvbihhc3NldCkge1xuICAgICAgICAgICAgdmFyIGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLnNlbGVjdGlvbi5nZXRSYW5nZSgpLnN0YXJ0LFxuICAgICAgICAgICAgICAgIGxpbmUgPSBlZGl0b3Iuc2Vzc2lvbi5nZXRMaW5lKGN1cnNvclBvc2l0aW9uLnJvdyk7XG5cbiAgICAgICAgICAgIC8vIGluc2VydGluZyBtZWRpYSBVUkwgYmV0d2VlbiB0d28gcXVvdGVzXG4gICAgICAgICAgICBpZiAobGluZS5zdWJzdHIoY3Vyc29yUG9zaXRpb24uY29sdW1uIC0gNSwgNSkudG9Mb3dlckNhc2UoKSA9PT0gJ2hyZWY9XCInKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydChhc3NldC5yZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnNlcnRpbmcgbWVkaWEgVVJMIHdpdGggcXVvdGVzXG4gICAgICAgICAgICBpZiAobGluZS5zdWJzdHIoY3Vyc29yUG9zaXRpb24uY29sdW1uIC0gNCwgNCkudG9Mb3dlckNhc2UoKSA9PT0gJ2hyZWY9Jykge1xuICAgICAgICAgICAgICAgIGVkaXRvci5pbnNlcnQoJ1wiJyArIGFzc2V0LnJlc291cmNlICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24gd2FycmFudHMgYSBjb21wbGV0ZSBhbmNob3IgSFRNTFxuICAgICAgICAgICAgLy8gdGFnIGluc3RlYWQgb2YgdGhlIFVSTC5cbiAgICAgICAgICAgIHZhciBjaGFyYWN0ZXIgPSBsaW5lLnN1YnN0cihjdXJzb3JQb3NpdGlvbi5jb2x1bW4gLSAxLCAxKS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICc+JyB8fCBjaGFyYWN0ZXIgPT09ICcnIHx8IGNoYXJhY3RlciA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydCgnPGEgaHJlZj1cIicgKyBhc3NldC5yZXNvdXJjZSArICdcIiB0aXRsZT1cIicgKyBhc3NldC5hbHRlcm5hdGVUZXh0ICsgJ1wiIGNsYXNzPVwiXCIgLz5cXG4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnQoYXNzZXQucmVzb3VyY2UpOyAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhbiBpbWFnZSBhdCB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaW5zZXJ0SW1hZ2UgPSBmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgICAgIHZhciBjdXJzb3JQb3NpdGlvbiA9IGVkaXRvci5zZWxlY3Rpb24uZ2V0UmFuZ2UoKS5zdGFydCxcbiAgICAgICAgICAgICAgICBsaW5lID0gZWRpdG9yLnNlc3Npb24uZ2V0TGluZShjdXJzb3JQb3NpdGlvbi5yb3cpO1xuXG4gICAgICAgICAgICAvLyBpbnNlcnRpbmcgbWVkaWEgVVJMIGJldHdlZW4gdHdvIHF1b3Rlc1xuICAgICAgICAgICAgaWYgKGxpbmUuc3Vic3RyKGN1cnNvclBvc2l0aW9uLmNvbHVtbiAtIDUsIDUpLnRvTG93ZXJDYXNlKCkgPT09ICdzcmM9XCInKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydChpbWFnZS5yZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnNlcnRpbmcgbWVkaWEgVVJMIHdpdGggcXVvdGVzXG4gICAgICAgICAgICBpZiAobGluZS5zdWJzdHIoY3Vyc29yUG9zaXRpb24uY29sdW1uIC0gNCwgNCkudG9Mb3dlckNhc2UoKSA9PT0gJ3NyYz0nKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydCgnXCInICsgaW1hZ2UucmVzb3VyY2UgKyAnXCInKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGluc2VydGluZyBtZWRpYSBhcyBhbiBpbmxpbmUgc3R5bGVcbiAgICAgICAgICAgIGlmIChsaW5lLnN1YnN0cihjdXJzb3JQb3NpdGlvbi5jb2x1bW4gLSA0LCA0KS50b0xvd2VyQ2FzZSgpID09PSAndXJsKCcpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0KGltYWdlLnJlc291cmNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiB3YXJyYW50cyBhIGNvbXBsZXRlIGltZyBIVE1MXG4gICAgICAgICAgICAvLyB0YWcgaW5zdGVhZCBvZiB0aGUgVVJMLlxuICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGxpbmUuc3Vic3RyKGN1cnNvclBvc2l0aW9uLmNvbHVtbiAtIDEsIDEpLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJz4nIHx8IGNoYXJhY3RlciA9PT0gJycgfHwgY2hhcmFjdGVyID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0KCc8aW1nIHNyYz1cIicgKyBpbWFnZS5yZXNvdXJjZSArICdcIiBhbHQ9XCInICsgaW1hZ2UuYWx0ZXJuYXRlVGV4dCArICdcIiBjbGFzcz1cIlwiIC8+XFxuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0KGltYWdlLnJlc291cmNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBoaWRkZW4gSFRNTCBpbnB1dCB3aXRoIGxhdGVzdCBjb250ZW50IGZyb20gQWNlIGVkaXRvci5cbiAgICAgICAgICovXG4gICAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkaW5wdXQudmFsdWUgPSBzZXNzaW9uLmdldFZhbHVlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHVwZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZXNzaW9uLnNldFZhbHVlKCRpbnB1dC52YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5pdCgpO1xuICAgIH1cbn0pOyIsIi8qKlxuICogRWRpdG9yIGNhbiBiZSB0b2dnbGVkIGJldHdlZW4gY29kZSAvIHZpc3VhbCBlZGl0b3IuXG4gKi9cblxud2luZG93LkVkaXRvci5wbHVnaW5zLnB1c2goe1xuICAgIGFjdGlvbjogJ2NvbnRleHQnLFxuICAgIGluaXQ6IHRydWUsXG4gICAgZXhlYzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBDU1NfQ09ERV9FRElUT1IgPSAnaXMtY29kZS1lZGl0b3InLFxuICAgICAgICAgICAgQ1NTX1ZJU1VBTF9FRElUT1IgPSAnaXMtdmlzdWFsLWVkaXRvcicsXG4gICAgICAgICAgICAkdmlzdWFsSUZyYW1lID0gaW5zdGFuY2UuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5qcy1lZGl0b3ItdmlzdWFsLWlmcmFtZScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIGNvbnRlbnRcbiAgICAgICAgICovXG4gICAgICAgIHZhciBnZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZWRpdG9yLWNvbnRlbnQtdHlwZScpLnZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZW5kTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICR2aXN1YWxJRnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShtc2cpLCAnKicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0b2dnbGVDb2RlRWRpdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5zdGFuY2UuJGVsLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX1ZJU1VBTF9FRElUT1IpO1xuICAgICAgICAgICAgaW5zdGFuY2UuJGVsLmNsYXNzTGlzdC5hZGQoQ1NTX0NPREVfRURJVE9SKTtcblxuICAgICAgICAgICAgaW5zdGFuY2UuJGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdlZGl0b3I6dmFsdWVVcGRhdGUnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXlzIHZpc3VhbCBlZGl0b3IuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgdG9nZ2xlVmlzdWFsRWRpdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gc2VuZCBpbmZvcm1hdGlvbiB0byBpZnJhbWUuXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICd1cGRhdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbnN0YW5jZS4kaW5wdXQudmFsdWUsXG4gICAgICAgICAgICAgICAgbWVkaWFQYXRoOiBnZXRDb250ZW50VHlwZSgpLFxuICAgICAgICAgICAgICAgIGlkOiBpbnN0YW5jZS5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHZpc3VhbElGcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLCAnKicpO1xuXG4gICAgICAgICAgICBpbnN0YW5jZS4kZWwuY2xhc3NMaXN0LnJlbW92ZShDU1NfQ09ERV9FRElUT1IpO1xuICAgICAgICAgICAgaW5zdGFuY2UuJGVsLmNsYXNzTGlzdC5hZGQoQ1NTX1ZJU1VBTF9FRElUT1IpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgaWYgKGluc3RhbmNlLiRlbC5jbGFzc0xpc3QuY29udGFpbnMoQ1NTX0NPREVfRURJVE9SKSkge1xuICAgICAgICAgICAgdG9nZ2xlVmlzdWFsRWRpdG9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDb2RlRWRpdG9yKCk7XG4gICAgfVxufSk7IiwiLyoqXG4gKiBTd2l0Y2hlcyBlZGl0b3IgYmV0d2VlbiBmdWxsc2NyZWVuIGFuZCBub3JtYWwuXG4gKi9cblxud2luZG93LkVkaXRvci5wbHVnaW5zLnB1c2goe1xuICAgIGFjdGlvbjogJ3RvZ2dsZS1mdWxsc2NyZWVuJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgICBleGVjOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIENTU19GVUxMU0NSRUVOID0gJ2lzLWZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgS0VZX0VTQyA9IDI3O1xuXG4gICAgICAgIHZhciB0b2dnbGVGdWxsc2NyZWVuID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlICYmIGUua2V5Q29kZSAhPT0gS0VZX0VTQykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS4kZWwuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19GVUxMU0NSRUVOKSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLiRlbC5jbGFzc0xpc3QucmVtb3ZlKENTU19GVUxMU0NSRUVOKTtcbiAgICBcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRvZ2dsZUZ1bGxzY3JlZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGluc3RhbmNlLiRlbC5jbGFzc0xpc3QuYWRkKENTU19GVUxMU0NSRUVOKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0b2dnbGVGdWxsc2NyZWVuKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0b2dnbGVGdWxsc2NyZWVuKCk7XG4gICAgfVxufSk7IiwiLyoqXG4gKiBJbnNlcnRzIG1lZGlhIGludG8gdGhlIGVkaXRvciBmcm9tIHRoZSBPcmNoYXJkIG1lZGlhIGxpYnJhcnkuXG4gKi9cblxud2luZG93LkVkaXRvci5wbHVnaW5zLnB1c2goe1xuICAgIGFjdGlvbjogJ2luc2VydC1tZWRpYScsXG4gICAgaW5pdDogZmFsc2UsXG4gICAgZXhlYzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBhZG1pbkluZGV4ID0gbG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCIvYWRtaW4vXCIpLFxuICAgICAgICAgICAgY2FjaGVkU2Nyb2xsUG9zaXRpb24gPSAwO1xuXG4gICAgICAgIGlmIChhZG1pbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5jb2xvcmJveCh7XG4gICAgICAgICAgICBocmVmOiBsb2NhdGlvbi5ocmVmLnN1YnN0cigwLCBhZG1pbkluZGV4KSArIFwiL0FkbWluL09yY2hhcmQuTWVkaWFMaWJyYXJ5P2RpYWxvZz10cnVlXCIsXG4gICAgICAgICAgICBpZnJhbWU6IHRydWUsXG4gICAgICAgICAgICByZXBvc2l0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6ICc5MCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnOTAlJyxcbiAgICAgICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhY2hlZFNjcm9sbFBvc2l0aW9uID0gJCgnaHRtbCcpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgIC8vIGhpZGUgdGhlIHNjcm9sbGJhcnMgZnJvbSB0aGUgbWFpbiB3aW5kb3dcbiAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkNsb3NlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZERhdGEgPSAkLmNvbG9yYm94LnNlbGVjdGVkRGF0YTtcblxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93JywgJycpO1xuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5zY3JvbGxUb3AoY2FjaGVkU2Nyb2xsUG9zaXRpb24pO1xuXG4gICAgICAgICAgICAgICAgaWYoIXNlbGVjdGVkRGF0YSB8fCBzZWxlY3RlZERhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuJGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdlZGl0b3I6YWRkTWVkaWEnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWFJdGVtczogc2VsZWN0ZWREYXRhXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyIsIi8qKlxuICogRWRpdG9yIGNhbiBiZSByZXNpemVkIHRvIGN1c3RvbSBoZWlnaHQuXG4gKi9cblxud2luZG93LkVkaXRvci5wbHVnaW5zLnB1c2goe1xuICAgIGFjdGlvbjogJ3Jlc2l6ZScsXG4gICAgaW5pdDogdHJ1ZSxcbiAgICBleGVjOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIGluaXRpYWxZLCBpbml0aWFsSGVpZ2h0LFxuICAgICAgICAgICAgJHJlc2l6ZXIgPSBpbnN0YW5jZS4kZWwucXVlcnlTZWxlY3RvcignLmpzLWVkaXRvci1yZXNpemVyJyksXG4gICAgICAgICAgICAkdmlzdWFsSUZyYW1lID0gaW5zdGFuY2UuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5qcy1lZGl0b3ItdmlzdWFsLWlmcmFtZScpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25EcmFnKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZGlzcG9zZSk7XG4gICAgICAgICAgICAkdmlzdWFsSUZyYW1lLmNvbnRlbnRXaW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25JRnJhbWVEcmFnKTtcbiAgICAgICAgICAgICR2aXN1YWxJRnJhbWUuY29udGVudFdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZGlzcG9zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uRHJhZyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS4kZWwuc3R5bGUuaGVpZ2h0ID0gKGluaXRpYWxIZWlnaHQgKyAoZS5jbGllbnRZIC0gaW5pdGlhbFkpKSArICdweCc7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uSUZyYW1lRHJhZyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgYm91bmRpbmdDbGllbnRSZWN0ID0gJHZpc3VhbElGcmFtZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlbW92ZScsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2UgfSk7XG5cbiAgICAgICAgICAgIGV2dC5jbGllbnRYID0gZS5jbGllbnRYICsgYm91bmRpbmdDbGllbnRSZWN0LmxlZnQ7XG4gICAgICAgICAgICBldnQuY2xpZW50WSA9IGUuY2xpZW50WSArIGJvdW5kaW5nQ2xpZW50UmVjdC50b3A7XG5cbiAgICAgICAgICAgICR2aXN1YWxJRnJhbWUuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRyZXNpemVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpbml0aWFsWSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIGluaXRpYWxIZWlnaHQgPSBpbnN0YW5jZS4kZWwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25EcmFnKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZGlzcG9zZSk7XG4gICAgICAgICAgICAkdmlzdWFsSUZyYW1lLmNvbnRlbnRXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25JRnJhbWVEcmFnKTtcbiAgICAgICAgICAgICR2aXN1YWxJRnJhbWUuY29udGVudFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZGlzcG9zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVkaXRvckluc3RhbmNlID0gZnVuY3Rpb24gKCRlbCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICAkZWw6ICRlbCxcbiAgICAgICAgICAgIGlkOiAkZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJylcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXNlciBoYXMgY2xpY2tlZCBhbiBhY3Rpb24gd2l0aGluIHRoZSB0b29sYmFyLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGhhbmRsZUFjdGlvbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1hY3Rpb24nKSxcbiAgICAgICAgICAgICAgICBwbHVnaW5zID0gd2luZG93LkVkaXRvci5wbHVnaW5zO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGx1Z2luc1tpXS5hY3Rpb24gPT09IGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zW2ldLmV4ZWMoc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpc2VzIE1lZGl1bSBlZGl0b3IuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YXRlLiRpbnB1dCA9ICRlbC5xdWVyeVNlbGVjdG9yKCcuZWRpdG9yLWlucHV0Jyk7XG5cbiAgICAgICAgICAgIHZhciAkYWN0aW9ucyA9ICRlbC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbGJhci1idG4nKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICRhY3Rpb25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQWN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAvLyBsb29wIG92ZXIgcGx1Z2lucyBhbmQgZXhlY3V0ZSBhbnkgdGhhdCBhcmUgZmxhZ2dlZCB0b1xuICAgICAgICAgICAgLy8gZXhlYyBvbiBpbml0aWFsaXNlLlxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aW5kb3cuRWRpdG9yLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LkVkaXRvci5wbHVnaW5zW2ldLmluaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkVkaXRvci5wbHVnaW5zW2ldLmV4ZWMoc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gdGhlIGlmcmFtZSBlZGl0b3IuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgb25NZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmRhdGEuaWQgIT09IHN0YXRlLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5kYXRhLmFjdGlvbiA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS4kaW5wdXQudmFsdWUgPSBodG1sX2JlYXV0aWZ5ID8gaHRtbF9iZWF1dGlmeShlLmRhdGEudmFsdWUsIHsgd3JhcF9saW5lX2xlbmd0aDogMCB9KSA6IGUuZGF0YS52YWx1ZTtcbiAgICAgICAgICAgICAgICAkZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2VkaXRvcjp2YWx1ZVVwZGF0ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpbml0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGlzZXMgaW5zdGFuY2VzIG9mIHRoZSBBY2UgZWRpdG9yLlxuICAgICAqL1xuICAgIHZhciBpbml0aWFsaXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGVkaXRvcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZWRpdG9yJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkZWRpdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZWRpdG9ySW5zdGFuY2UoJGVkaXRvcnNbaV0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXNlKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
