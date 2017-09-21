(function () {
    var editorInstance = function ($el) {
        var $editor, $html, $iframe, $input;

        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        /**
         * Gets the `state`, which is a text representation of what the
         * user is editing.
         */
        var getState = function () {
            var $title = document.querySelector('#Title_Title'),
                $url = document.querySelector('#AutoroutePart_CurrentUrl'),
                contentType = getContentType(),
                state = '';

            if ($title) {
                state += ($url && $url.value) ? '<a href="/' + $url.value + '" target="_blank" title="View current page">' + $title.value + '</a>' : $title.value;
            } else {
                return 'HTML Element within Layout'
            }

            if (contentType && contentType !== 'LayoutElement') {
                state += ' (' + contentType + ')';
            }

            return state || 'Unknown';
        }

        /**
         * User has clicked an action within the toolbar.
         */
        var handleAction = function (e) {
            var action = e.currentTarget.getAttribute('data-action');

            switch (action) {
                case 'open-visual-editor':
                    openVisualEditor();
                    break;
                case 'insert-media':
                    openMediaPicker();
                    break;
            }
        }

        /**
         * Launches the medium editor.
         */
        var hide = function () {
            sendMessage({ action: 'destroy' });

            window.removeEventListener('message', onMessage);

            $html.style.overflow = '';

            $editor.style.display = 'none';
        };

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            $editor = $el.querySelector('.js-editor-medium');
            $input = $el.querySelector('.editor-input');
            $iframe = $el.querySelector('.js-editor-medium-iframe');
            $html = document.querySelector('html');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.action === 'update') {
                $input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                $el.dispatchEvent(new Event('editor:valueUpdate'));
            }

            if (e.data.action === 'close') {
                hide();
            }
        };

        /**
         * Opens media library picker.
         */
        var openMediaPicker = function () {
            var adminIndex = location.href.toLowerCase().indexOf("/admin/"),
                _this = this,
                url;

            if (adminIndex === -1) {
                return;
            }

            url = location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true";

            $.colorbox({
                href: url,
                iframe: true,
                reposition: true,
                width: '90%',
                height: '90%',
                onLoad: function () {
                    // hide the scrollbars from the main window
                    $('html, body').css('overflow', 'hidden');
                },
                onClosed: function () {
                    var selectedData = $.colorbox.selectedData;

                    $('html, body').css('overflow', '');

                    if (selectedData.length === 0) {
                        return;
                    }
                    
                    $el.dispatchEvent(new CustomEvent('editor:addMedia', {
                        detail: {
                            mediaItems: selectedData
                        }
                    }));
                }
            });
        };

        /**
         * Launches the medium editor.
         */
        var openVisualEditor = function () {
            // send information to iframe.
            sendMessage({
                action: 'initialise',
                value: $input.value,
                mediaPath: getContentType(),
                state: getState()
            });

            window.addEventListener('message', onMessage);

            $html.style.overflow = 'hidden';
            $editor.style.display = '';
        };

        /**
         * Sends a message to the iframe.
         */
        var sendMessage = function (msg) {
            $iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
        };

        init()
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