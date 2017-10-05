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
     * Store DOM elements in variables.
     */
    var cacheDom = function () {
        $element = document.querySelector('.js-editor-medium-element');
        $contentCss = document.querySelector('.js-editor-custom-css');
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
        if (!hasInit) {
            initialise(data);
            return;
        }

        editorInstance.setContent(data.value);
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
    
    document.addEventListener('DOMContentLoaded', cacheDom);
    window.addEventListener('message', onMessage);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yY2hhcmQubWVkaXVtLmVtYmVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im9yY2hhcmQubWVkaXVtLmVtYmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBLRVlfRVNDID0gMjcsXHJcbiAgICAgICAgVVBMT0FEX01FRElBX1VSTCA9ICcvQWRtaW4vRWRpdG9yL01lZGlhJztcclxuXHJcbiAgICB2YXIgaGFzSW5pdCA9IGZhbHNlLFxyXG4gICAgICAgIGVkaXRvckluc3RhbmNlLCBpbnN0YW5jZUlkLFxyXG4gICAgICAgICRlbGVtZW50LCAkY29udGVudENzcztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlIERPTSBlbGVtZW50cyBpbiB2YXJpYWJsZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBjYWNoZURvbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1lZGl0b3ItbWVkaXVtLWVsZW1lbnQnKTtcclxuICAgICAgICAkY29udGVudENzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1lZGl0b3ItY3VzdG9tLWNzcycpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGVkaXRvckluc3RhbmNlLnNlcmlhbGl6ZSgpW2VkaXRvckluc3RhbmNlLmVsZW1lbnRzWzBdLmlkXS52YWx1ZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGlzZXMgTWVkaXVtIGVkaXRvci5cclxuICAgICAqL1xyXG4gICAgdmFyIGluaXRpYWxpc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICRlbGVtZW50LnZhbHVlID0gZGF0YS52YWx1ZTtcclxuICAgICAgICBlZGl0b3JJbnN0YW5jZSA9IG5ldyBNZWRpdW1FZGl0b3IoJGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlZGl0b3JJbnN0YW5jZS5zdWJzY3JpYmUoJ2VkaXRhYmxlSW5wdXQnLCBzZW5kVXBkYXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCRjb250ZW50Q3NzLnZhbHVlICE9PSAnJykge1xyXG4gICAgICAgICAgICBlZGl0b3JJbnN0YW5jZS5lbGVtZW50c1swXS5jbGFzc05hbWUgKz0gJyAnICsgJGNvbnRlbnRDc3MudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCRlbGVtZW50KS5tZWRpdW1JbnNlcnQoe1xyXG4gICAgICAgICAgICBlZGl0b3I6IGVkaXRvckluc3RhbmNlLFxyXG4gICAgICAgICAgICBhZGRvbnM6IHtcclxuICAgICAgICAgICAgICAgIGltYWdlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbWJlZHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgb3JjaGFyZE1lZGlhOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGFzSW5pdCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2VzcyBtZXNzYWdlIGZyb20gdGhlIHBhcmVudCB3aW5kb3cuXHJcbiAgICAgKi9cclxuICAgIHZhciBvbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShlLmRhdGEpO1xyXG5cclxuICAgICAgICBpbnN0YW5jZUlkID0gZGF0YS5pZDtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuYWN0aW9uID09PSAndXBkYXRlJykge1xyXG4gICAgICAgICAgICByZWNlaXZlZFVwZGF0ZShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjZWl2ZXMgYSBtZXNzYWdlIGZyb20gcGFyZW50IHdpbmRvdyB0byB1cGRhdGUgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHZhciByZWNlaXZlZFVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgaWYgKCFoYXNJbml0KSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxpc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVkaXRvckluc3RhbmNlLnNldENvbnRlbnQoZGF0YS52YWx1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VuZHMgbWVzc2FnZSB0byBwYXJlbnQgd2luZG93LlxyXG4gICAgICovXHJcbiAgICB2YXIgc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShtc2csICcqJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VuZHMgbWVzc2FnZSB0byBwYXJlbnQgd2luZG93IHRvIHVwZGF0ZSB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgdmFyIHNlbmRVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICBhY3Rpb246ICd1cGRhdGUnLFxyXG4gICAgICAgICAgICBpZDogaW5zdGFuY2VJZCxcclxuICAgICAgICAgICAgdmFsdWU6IGdldFZhbHVlKClcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWNoZURvbSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTWVzc2FnZSk7XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
