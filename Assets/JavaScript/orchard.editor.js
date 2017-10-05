(function () {
    var CSS_CODE_EDITOR = 'is-code-editor',
        CSS_VISUAL_EDITOR = 'is-visual-editor',
        CSS_FULLSCREEN = 'is-fullscreen',
        KEY_ESC = 27;

    var editorInstance = function ($el) {
        var instanceId, $visualEditor, $visualEditorIFrame, $input, $resizer;

        /**
         * Generates unique ID for instance
         */
        var setId = function () {
            instanceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                 return v.toString(16);
            });
        };
        
        /**
         * Returns the type of content
         */
        var getContentType = function () {
            return document.querySelector('.js-editor-content-type').value;
        };

        /**
         * User has clicked an action within the toolbar.
         */
        var handleAction = function (e) {
            var action = e.currentTarget.getAttribute('data-action');

            switch (action) {
                case 'insert-media':
                    openMediaPicker();
                    break;
                case 'toggle-code-editor':
                    toggleCodeEditor();
                    break;
                case 'toggle-visual-editor':
                    toggleVisualEditor();
                    break;
                case 'toggle-fullscreen':
                    toggleFullscreen();
                    break;
            }
        }

        /**
         * Initialises Medium editor.
         */
        var init = function () {
            setId();

            $visualEditor = $el.querySelector('.js-editor-visual');
            $input = $el.querySelector('.editor-input');
            $visualEditorIFrame = $el.querySelector('.js-editor-visual-iframe');
            $resizer = $el.querySelector('.js-editor-resizer');

            var $actions = $el.querySelectorAll('.js-toolbar-btn');

            for (var i = 0; i < $actions.length; i++) {
                $actions[i].addEventListener('click', handleAction);
            }

            window.addEventListener('message', onMessage);

            toggleCodeEditor();
            setupResizer();
        };

        /**
         * Received a message from the iframe editor.
         */
        var onMessage = function (e) {
            if (e.data.id !== instanceId) {
                return;
            }
            
            if (e.data.action === 'update') {
                $input.value = html_beautify ? html_beautify(e.data.value, { wrap_line_length: 0 }) : e.data.value;
                $el.dispatchEvent(new Event('editor:valueUpdate'));
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

        var setupResizer = function () {
            var initialY, initialHeight;

            var dispose = function () {
                window.removeEventListener('mousemove', onDrag);
                window.removeEventListener('mouseup', dispose);
                $visualEditorIFrame.contentWindow.removeEventListener('mousemove', onIFrameDrag);
                $visualEditorIFrame.contentWindow.removeEventListener('mouseup', dispose);
            };

            var onDrag = function (e) {
                $el.style.height = (initialHeight + (e.clientY - initialY)) + 'px';
            };

            var onIFrameDrag = function (e) {
                var boundingClientRect = $visualEditorIFrame.getBoundingClientRect(),
                    evt = new CustomEvent('mousemove', { bubbles: true, cancelable: false });

                evt.clientX = e.clientX + boundingClientRect.left;
                evt.clientY = e.clientY + boundingClientRect.top;

                $visualEditorIFrame.dispatchEvent(evt);
            };

            $resizer.addEventListener('mousedown', function (e) {
                initialY = e.clientY;
                initialHeight = $el.offsetHeight;

                window.addEventListener('mousemove', onDrag);
                window.addEventListener('mouseup', dispose);
                $visualEditorIFrame.contentWindow.addEventListener('mousemove', onIFrameDrag);
                $visualEditorIFrame.contentWindow.addEventListener('mouseup', dispose);
            })
        };

        /**
         * Displays code editor.
         */
        var toggleCodeEditor = function () {
            $el.classList.remove(CSS_VISUAL_EDITOR);
            $el.classList.add(CSS_CODE_EDITOR);

            $el.dispatchEvent(new Event('editor:valueUpdate'));
        };

        /**
         * Toggles fullscreen state.
         */
        var toggleFullscreen = function (e) {
            if (e && e.keyCode !== KEY_ESC) {
                return;
            }

            if ($el.classList.contains(CSS_FULLSCREEN)) {
                $el.classList.remove(CSS_FULLSCREEN);

                document.querySelector('html').style.overflow = '';
                window.removeEventListener('keydown', toggleFullscreen);
                return;
            }

            $el.classList.add(CSS_FULLSCREEN);
            document.querySelector('html').style.overflow = 'hidden';

            window.addEventListener('keydown', toggleFullscreen);
        };

        /**
         * Displays visual editor.
         */
        var toggleVisualEditor = function () {
            // send information to iframe.
            sendMessage({
                action: 'update',
                value: $input.value,
                mediaPath: getContentType()
            });

            $el.classList.remove(CSS_CODE_EDITOR);
            $el.classList.add(CSS_VISUAL_EDITOR);
        };

        /**
         * Sends a message to the iframe.
         */
        var sendMessage = function (msg) {
            msg.instanceId = instanceId;
            $visualEditorIFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
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