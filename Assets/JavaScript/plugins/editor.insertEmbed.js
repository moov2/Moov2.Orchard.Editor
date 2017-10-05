/**
 * Inserts embedded video (e.g. YouTube) into the editor.
 */

window.Editor.plugins.push({
    action: 'insert-embed',
    init: false,
    exec: function (instance) {
        var CSS_ACTIVE_DIALOG = 'has-active-dialog';

        var $toolbar = instance.$el.querySelector('.js-editor-toolbar'),
            $dialog = document.createElement('div'),
            $input, $example, $cancelBtn, $insertBtn;

        $dialog.classList.add('editor-dialog');
        $dialog.classList.add('js-editor-dialog');
        $dialog.innerHTML = '<div class="editor-dialog__content"><input type="text" placeholder="Enter URL to YouTube or Vimeo video" class="text large js-embed-url" /><div class="editor-dialog__example js-embed-example"></div><div class="editor-dialog__options"><button type="button" class="js-insert-btn" disabled>Insert</button><button type="button" class="editor-dialog__cancel-btn js-cancel-btn">Cancel</button></div></div>';

        $toolbar.appendChild($dialog);

        $example = $dialog.querySelector('.js-embed-example');
        $input = $dialog.querySelector('.js-embed-url');
        $cancelBtn = $dialog.querySelector('.js-cancel-btn');
        $insertBtn = $dialog.querySelector('.js-insert-btn');

        var buildVimeoHtml = function (url) {
            var videoId = url.substring(url.lastIndexOf('/') + 1);
            return '<div class="embed">\n\t<div class="embed__media">\n\t\t<iframe src="https://player.vimeo.com/video/' + videoId + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n\t</div>\n</div>\n\n';
        };

        var buildYoutubeHtml = function (url) {
            var videoId;

            if (url.indexOf('youtu.be/') >= 0 || url.indexOf('youtube.com/embed') >= 0) {
                videoId = url.substring(url.lastIndexOf('/') + 1);
            } else {
                videoId = url.substring(url.lastIndexOf('v=') + 2);
            }

            return '<div class="embed">\n\t<div class="embed__media">\n\t\t<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n\t</div>\n</div>\n\n';
        };

        /**
         * Removes dialog.
         */
        var cancel = function () {
            $dialog.remove();

            instance.$el.classList.remove(CSS_ACTIVE_DIALOG);
        };

        /**
         * Dispatches event to insert HTML into editor.
         */
        var insert = function () {
            instance.$el.dispatchEvent(new CustomEvent('editor:insertHtml', {
                detail: {
                    html: $example.innerHTML
                }
            }));

            cancel();
        };

        /**
         * Displays sample of embedded video with option to insert.
         */
        var setExample = function (e) {
            var value = e.currentTarget.value,
                exampleHtml = value ? '<p style="font-size: 0.85em;">Invalid URL (currently only supports Vimeo/YouTube URLs)</p>' : '';

            $insertBtn.disabled = true;

            if (value.indexOf('vimeo.com') >= 0) {
                exampleHtml = buildVimeoHtml(value);
                $insertBtn.disabled = false;
            } else if (value.indexOf('youtube.com') >= 0 || value.indexOf('youtu.be' >= 0)) {
                exampleHtml = buildYoutubeHtml(value);
                $insertBtn.disabled = false;
            }

            
            $example.innerHTML = exampleHtml;
        };

        $input.addEventListener('input', setExample);
        $cancelBtn.addEventListener('click', cancel);
        $insertBtn.addEventListener('click', insert);

        $input.focus();

        instance.$el.classList.add(CSS_ACTIVE_DIALOG);
    }
});