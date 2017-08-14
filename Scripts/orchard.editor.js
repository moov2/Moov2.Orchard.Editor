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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yY2hhcmQuZWRpdG9yLmpzIiwib3JjaGFyZC5hY2UuanMiLCJvcmNoYXJkLm1lZGl1bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im9yY2hhcmQuZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIoZnVuY3Rpb24gKCkge1xuICAgIHZhciBlZGl0b3IsIHNlc3Npb24sICRpbnB1dDtcblxuICAgIC8qKlxuICAgICAqIEZpbHRlcnMgb3V0IHVud2FudGVkIGFubm90YXRpb25zIChlLmcuIHdhcm5pbmcgYWJvdXQgZG9jdHlwZSkgZHVlIHRvIGNvbW1vblxuICAgICAqIGNhc2UgaXMgdGhlIEhUTUwgYmVpbmcgZWRpdGVkIGlzIG5vdCBhIGZ1bGwgSFRNTCBkb2N1bWVudCBidXQgYSBwaWVjZSBvZiBIVE1MLlxuICAgICAqL1xuICAgIHZhciBmaWx0ZXJBbm5vdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBzZXNzaW9uLmdldEFubm90YXRpb25zKCkgfHwgW10sIGkgPSBsZW4gPSBhbm5vdGF0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKC9kb2N0eXBlIGZpcnN0XFwuIEV4cGVjdGVkLy50ZXN0KGFubm90YXRpb25zW2ldLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlbiA+IGFubm90YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgc2Vzc2lvbi5zZXRBbm5vdGF0aW9ucyhhbm5vdGF0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGlzZXMgQWNlIGVkaXRvci5cbiAgICAgKi9cbiAgICB2YXIgaW5pdGlhbGlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWRpdG9yID0gYWNlLmVkaXQoJ2VkaXRvcicpO1xuICAgICAgICBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKTtcbiAgICAgICAgJGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXRvci1pbnB1dCcpO1xuXG4gICAgICAgIGVkaXRvci5zZXRUaGVtZSgnYWNlL3RoZW1lL21vbm9rYWknKTtcbiAgICAgICAgZWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XG5cbiAgICAgICAgc2Vzc2lvbi5zZXRNb2RlKCdhY2UvbW9kZS9odG1sJyk7XG4gICAgICAgIHNlc3Npb24uc2V0VXNlV3JhcE1vZGUodHJ1ZSk7XG5cbiAgICAgICAgc2Vzc2lvbi5vbignY2hhbmdlQW5ub3RhdGlvbicsIGZpbHRlckFubm90YXRpb24pO1xuICAgICAgICBzZXNzaW9uLm9uKCdjaGFuZ2UnLCB1cGRhdGUpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlZGl0b3I6dmFsdWVVcGRhdGUnLCB1cGRhdGVTZXNzaW9uKTtcbiAgICB9O1xuICAgIFxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgaGlkZGVuIEhUTUwgaW5wdXQgd2l0aCBsYXRlc3QgY29udGVudCBmcm9tIEFjZSBlZGl0b3IuXG4gICAgICovXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlucHV0LnZhbHVlID0gc2Vzc2lvbi5nZXRWYWx1ZSgpO1xuICAgIH07XG5cbiAgICB2YXIgdXBkYXRlU2Vzc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2Vzc2lvbi5zZXRWYWx1ZSgkaW5wdXQudmFsdWUpO1xyXG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXNlKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBLRVlfRVNDID0gMjc7XHJcbiAgICB2YXIgJGVkaXRvciwgJGVkaXRvckVsZW1lbnQsIGVkaXRvckluc3RhbmNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHRoZSB1c2VyIGhhcyBrZXllZCBgRVNDYCB0byB0cmlnZ2VyIHRoZSBlZGl0b3IgY2xvc2luZy5cclxuICAgICAqL1xyXG4gICAgdmFyIGNoZWNrS2V5UHJlc3NGb3JIaWRlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLRVlfRVNDKSB7XHJcbiAgICAgICAgICAgIGhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGF1bmNoZXMgdGhlIG1lZGl1bSBlZGl0b3IuXHJcbiAgICAgKi9cclxuICAgIHZhciBoaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRpbnB1dC52YWx1ZSA9ICRlZGl0b3JFbGVtZW50LnZhbHVlXHJcblxyXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZWRpdG9yOnZhbHVlVXBkYXRlJykpO1xyXG5cclxuICAgICAgICAkZWRpdG9yLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gICAgICAgIGVkaXRvckluc3RhbmNlLmRlc3Ryb3koKTtcclxuICAgICAgICBlZGl0b3JJbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjaGVja0tleVByZXNzRm9ySGlkZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGlzZXMgTWVkaXVtIGVkaXRvci5cclxuICAgICAqL1xyXG4gICAgdmFyIGluaXRpYWxpc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJGVkaXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1lZGl0b3ItbWVkaXVtJyk7XHJcbiAgICAgICAgJGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXRvci1pbnB1dCcpO1xyXG4gICAgICAgICRlZGl0b3JFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWVkaXRvci1tZWRpdW0tZWxlbWVudCcpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbGF1bmNoLW1lZGl1bS1lZGl0b3InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3cpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIExhdW5jaGVzIHRoZSBtZWRpdW0gZWRpdG9yLlxyXG4gICAgICovXHJcbiAgICB2YXIgc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNoZWNrS2V5UHJlc3NGb3JIaWRlKTtcclxuXHJcbiAgICAgICAgJGVkaXRvckVsZW1lbnQudmFsdWUgPSAkaW5wdXQudmFsdWU7XHJcbiAgICAgICAgZWRpdG9ySW5zdGFuY2UgPSBuZXcgTWVkaXVtRWRpdG9yKCRlZGl0b3JFbGVtZW50KTtcclxuXHJcbiAgICAgICAgJGVkaXRvci5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXNlKTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
