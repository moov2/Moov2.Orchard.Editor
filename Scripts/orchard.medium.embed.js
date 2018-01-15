/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yY2hhcmQubWVkaXVtLmVtYmVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoib3JjaGFyZC5tZWRpdW0uZW1iZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIEtFWV9FU0MgPSAyNyxcclxuICAgICAgICBVUExPQURfTUVESUFfVVJMID0gJy9BZG1pbi9FZGl0b3IvTWVkaWEnO1xyXG5cclxuICAgIHZhciBoYXNJbml0ID0gZmFsc2UsXHJcbiAgICAgICAgZWRpdG9ySW5zdGFuY2UsIGluc3RhbmNlSWQsXHJcbiAgICAgICAgJGVsZW1lbnQsICRjb250ZW50Q3NzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGV4dHJhIHBhcmFncmFwaCBpZiBuZWVkZWRcclxuICAgICAqL1xyXG4gICAgdmFyIGFkZEV4dHJhUGFyYWdyYXBoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYoIXZhbHVlIHx8ICF2YWx1ZS5lbmRzV2l0aCgnPC9wPicpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyAnPHA+PGJyIC8+PC9wPic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3RvcmUgRE9NIGVsZW1lbnRzIGluIHZhcmlhYmxlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIGNhY2hlRG9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWVkaXRvci1tZWRpdW0tZWxlbWVudCcpO1xyXG4gICAgICAgICRjb250ZW50Q3NzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWVkaXRvci1jdXN0b20tY3NzJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsb2FkZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2FjaGVEb20oKTtcclxuXHJcbiAgICAgICAgaWYgKCFoYXNJbml0KSB7XHJcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ2luaXQnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGluc3RhbmNlSWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGVkaXRvckluc3RhbmNlLnNlcmlhbGl6ZSgpW2VkaXRvckluc3RhbmNlLmVsZW1lbnRzWzBdLmlkXS52YWx1ZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGlzZXMgTWVkaXVtIGVkaXRvci5cclxuICAgICAqL1xyXG4gICAgdmFyIGluaXRpYWxpc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGRhdGEudmFsdWUgPSBhZGRFeHRyYVBhcmFncmFwaChkYXRhLnZhbHVlKTtcclxuICAgICAgICAkZWxlbWVudC52YWx1ZSA9IGRhdGEudmFsdWU7XHJcbiAgICAgICAgZWRpdG9ySW5zdGFuY2UgPSBuZXcgTWVkaXVtRWRpdG9yKCRlbGVtZW50KTtcclxuXHJcbiAgICAgICAgZWRpdG9ySW5zdGFuY2Uuc3Vic2NyaWJlKCdlZGl0YWJsZUlucHV0Jywgc2VuZFVwZGF0ZSk7XHJcblxyXG4gICAgICAgIGlmICgkY29udGVudENzcy52YWx1ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgZWRpdG9ySW5zdGFuY2UuZWxlbWVudHNbMF0uY2xhc3NOYW1lICs9ICcgJyArICRjb250ZW50Q3NzLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgkZWxlbWVudCkubWVkaXVtSW5zZXJ0KHtcclxuICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3JJbnN0YW5jZSxcclxuICAgICAgICAgICAgYWRkb25zOiB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZW1iZWRzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG9yY2hhcmRNZWRpYTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChlZGl0b3JJbnN0YW5jZS5lbGVtZW50cyAmJiBlZGl0b3JJbnN0YW5jZS5lbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGVkaXRvckluc3RhbmNlLmVsZW1lbnRzWzBdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGFzSW5pdCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2VzcyBtZXNzYWdlIGZyb20gdGhlIHBhcmVudCB3aW5kb3cuXHJcbiAgICAgKi9cclxuICAgIFxyXG4gICAgdmFyIG9uTWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcblxyXG4gICAgICAgIGluc3RhbmNlSWQgPSBkYXRhLmlkO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5hY3Rpb24gPT09ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgICAgIHJlY2VpdmVkVXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWNlaXZlcyBhIG1lc3NhZ2UgZnJvbSBwYXJlbnQgd2luZG93IHRvIHVwZGF0ZSB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgdmFyIHJlY2VpdmVkVXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgaXNFbXB0eSA9IGRhdGEudmFsdWUgPT09ICcnO1xyXG5cclxuICAgICAgICBpZiAoIWhhc0luaXQpIHtcclxuICAgICAgICAgICAgaW5pdGlhbGlzZShkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEudmFsdWUgPSBhZGRFeHRyYVBhcmFncmFwaChkYXRhLnZhbHVlKTtcclxuICAgICAgICBlZGl0b3JJbnN0YW5jZS5zZXRDb250ZW50KGRhdGEudmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoaXNFbXB0eSkge1xyXG4gICAgICAgICAgICBzZXRGb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBtZXNzYWdlIHRvIHBhcmVudCB3aW5kb3cuXHJcbiAgICAgKi9cclxuICAgIHZhciBzZW5kTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKG1zZywgJyonKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBtZXNzYWdlIHRvIHBhcmVudCB3aW5kb3cgdG8gdXBkYXRlIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICB2YXIgc2VuZFVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ3VwZGF0ZScsXHJcbiAgICAgICAgICAgIGlkOiBpbnN0YW5jZUlkLFxyXG4gICAgICAgICAgICB2YWx1ZTogZ2V0VmFsdWUoKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBmb2N1cyBvbiBtZWRpdW0gZWRpdG9yXHJcbiAgICAgKi9cclxuICAgIHZhciBzZXRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZighZWRpdG9ySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWRpdG9ySW5zdGFuY2Uuc2VsZWN0RWxlbWVudChlZGl0b3JJbnN0YW5jZS5lbGVtZW50c1swXSk7XHJcbiAgICAgICAgTWVkaXVtRWRpdG9yLnNlbGVjdGlvbi5tb3ZlQ3Vyc29yKGRvY3VtZW50LCBlZGl0b3JJbnN0YW5jZS5lbGVtZW50c1swXSwgMCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgbG9hZGVkKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25NZXNzYWdlKTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
