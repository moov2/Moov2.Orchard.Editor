/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

(function () {
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
     * Initialises Ace editor.
     */
    var initialise = function () {
        editor = ace.edit('editor');
        session = editor.getSession();

        //var beautify = ace.require('ace/ext/beautify');
        //beautify.beautify(session);

        $input = document.querySelector('.editor-input');

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

    document.addEventListener('DOMContentLoaded', initialise);
})();
(function () {
    var $editor, $iframe;

    /**
     * Returns path for storing media.
     */
    var getMediaPath = function () {
        return document.querySelector('#Body_MediaPath').value;
    };

    /**
     * Launches the medium editor.
     */
    var hide = function () {
        sendMessage({ action: 'destroy' });

        $editor.style.display = 'none';
    };

    /**
     * Initialises Medium editor.
     */
    var initialise = function () {
        $editor = document.querySelector('.js-editor-medium');
        $input = document.querySelector('.editor-input');
        $iframe = document.querySelector('.js-editor-medium-iframe');

        document.querySelector('.js-launch-medium-editor').addEventListener('click', show);
    };

    /**
     * Received a message from the iframe editor.
     */
    var onMessage = function (e) {
        if (e.data.action === 'close') {
            $input.value = html_beautify ? html_beautify(e.data.value) : e.data.value;
            window.dispatchEvent(new Event('editor:valueUpdate'));

            hide();
        }
    };

    /**
     * Sends a message to the iframe.
     */
    var sendMessage = function (msg) {
        $iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
    };

    /**
     * Launches the medium editor.
     */
    var show = function () {
        // send information to iframe.
        sendMessage({
            action: 'initialise',
            value: $input.value,
            mediaPath: getMediaPath()
        });

        $editor.style.display = '';
    };

    document.addEventListener('DOMContentLoaded', initialise);
    window.addEventListener('message', onMessage);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yY2hhcmQuZWRpdG9yLmpzIiwib3JjaGFyZC5hY2UuanMiLCJvcmNoYXJkLm1lZGl1bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoib3JjaGFyZC5lZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIihmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZWRpdG9yLCBzZXNzaW9uLCAkaW5wdXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIG91dCB1bndhbnRlZCBhbm5vdGF0aW9ucyAoZS5nLiB3YXJuaW5nIGFib3V0IGRvY3R5cGUpIGR1ZSB0byBjb21tb25cclxuICAgICAqIGNhc2UgaXMgdGhlIEhUTUwgYmVpbmcgZWRpdGVkIGlzIG5vdCBhIGZ1bGwgSFRNTCBkb2N1bWVudCBidXQgYSBwaWVjZSBvZiBIVE1MLlxyXG4gICAgICovXHJcbiAgICB2YXIgZmlsdGVyQW5ub3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBzZXNzaW9uLmdldEFubm90YXRpb25zKCkgfHwgW10sIGkgPSBsZW4gPSBhbm5vdGF0aW9ucy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgaWYgKC9kb2N0eXBlIGZpcnN0XFwuIEV4cGVjdGVkLy50ZXN0KGFubm90YXRpb25zW2ldLnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsZW4gPiBhbm5vdGF0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2Vzc2lvbi5zZXRBbm5vdGF0aW9ucyhhbm5vdGF0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpc2VzIEFjZSBlZGl0b3IuXHJcbiAgICAgKi9cclxuICAgIHZhciBpbml0aWFsaXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGVkaXRvciA9IGFjZS5lZGl0KCdlZGl0b3InKTtcclxuICAgICAgICBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKTtcclxuXHJcbiAgICAgICAgLy92YXIgYmVhdXRpZnkgPSBhY2UucmVxdWlyZSgnYWNlL2V4dC9iZWF1dGlmeScpO1xyXG4gICAgICAgIC8vYmVhdXRpZnkuYmVhdXRpZnkoc2Vzc2lvbik7XHJcblxyXG4gICAgICAgICRpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3ItaW5wdXQnKTtcclxuXHJcbiAgICAgICAgZWRpdG9yLnNldFRoZW1lKCdhY2UvdGhlbWUvbW9ub2thaScpO1xyXG4gICAgICAgIGVkaXRvci5zZXRTaG93UHJpbnRNYXJnaW4oZmFsc2UpO1xyXG5cclxuICAgICAgICBzZXNzaW9uLnNldE1vZGUoJ2FjZS9tb2RlL2h0bWwnKTtcclxuICAgICAgICBzZXNzaW9uLnNldFVzZVdyYXBNb2RlKHRydWUpO1xyXG5cclxuICAgICAgICBzZXNzaW9uLm9uKCdjaGFuZ2VBbm5vdGF0aW9uJywgZmlsdGVyQW5ub3RhdGlvbik7XHJcbiAgICAgICAgc2Vzc2lvbi5vbignY2hhbmdlJywgdXBkYXRlKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2VkaXRvcjp2YWx1ZVVwZGF0ZScsIHVwZGF0ZVNlc3Npb24pO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIGhpZGRlbiBIVE1MIGlucHV0IHdpdGggbGF0ZXN0IGNvbnRlbnQgZnJvbSBBY2UgZWRpdG9yLlxyXG4gICAgICovXHJcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRpbnB1dC52YWx1ZSA9IHNlc3Npb24uZ2V0VmFsdWUoKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2Vzc2lvbi5zZXRWYWx1ZSgkaW5wdXQudmFsdWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdGlhbGlzZSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkZWRpdG9yLCAkaWZyYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBwYXRoIGZvciBzdG9yaW5nIG1lZGlhLlxyXG4gICAgICovXHJcbiAgICB2YXIgZ2V0TWVkaWFQYXRoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjQm9keV9NZWRpYVBhdGgnKS52YWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXVuY2hlcyB0aGUgbWVkaXVtIGVkaXRvci5cclxuICAgICAqL1xyXG4gICAgdmFyIGhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VuZE1lc3NhZ2UoeyBhY3Rpb246ICdkZXN0cm95JyB9KTtcclxuXHJcbiAgICAgICAgJGVkaXRvci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpc2VzIE1lZGl1bSBlZGl0b3IuXHJcbiAgICAgKi9cclxuICAgIHZhciBpbml0aWFsaXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRlZGl0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZWRpdG9yLW1lZGl1bScpO1xyXG4gICAgICAgICRpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3ItaW5wdXQnKTtcclxuICAgICAgICAkaWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWVkaXRvci1tZWRpdW0taWZyYW1lJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1sYXVuY2gtbWVkaXVtLWVkaXRvcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvdyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gdGhlIGlmcmFtZSBlZGl0b3IuXHJcbiAgICAgKi9cclxuICAgIHZhciBvbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLmRhdGEuYWN0aW9uID09PSAnY2xvc2UnKSB7XHJcbiAgICAgICAgICAgICRpbnB1dC52YWx1ZSA9IGh0bWxfYmVhdXRpZnkgPyBodG1sX2JlYXV0aWZ5KGUuZGF0YS52YWx1ZSkgOiBlLmRhdGEudmFsdWU7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZWRpdG9yOnZhbHVlVXBkYXRlJykpO1xyXG5cclxuICAgICAgICAgICAgaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGlmcmFtZS5cclxuICAgICAqL1xyXG4gICAgdmFyIHNlbmRNZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShtc2cpLCAnKicpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaGVzIHRoZSBtZWRpdW0gZWRpdG9yLlxyXG4gICAgICovXHJcbiAgICB2YXIgc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBzZW5kIGluZm9ybWF0aW9uIHRvIGlmcmFtZS5cclxuICAgICAgICBzZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2luaXRpYWxpc2UnLFxyXG4gICAgICAgICAgICB2YWx1ZTogJGlucHV0LnZhbHVlLFxyXG4gICAgICAgICAgICBtZWRpYVBhdGg6IGdldE1lZGlhUGF0aCgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRlZGl0b3Iuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdGlhbGlzZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTWVzc2FnZSk7XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
