/**
 * Editor can be resized to custom height.
 */

window.Editor.plugins.push({
    action: 'resize',
    init: true,
    exec: function (instance) {
        var initialY, initialHeight,
            $resizer = instance.$el.querySelector('.js-editor-resizer');
        
        var dispose = function () {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', dispose);
            instance.$visualIFrame.contentWindow.removeEventListener('mousemove', onIFrameDrag);
            instance.$visualIFrame.contentWindow.removeEventListener('mouseup', dispose);
        };

        var onDrag = function (e) {
            instance.$el.style.height = (initialHeight + (e.clientY - initialY)) + 'px';
        };

        var onIFrameDrag = function (e) {
            var boundingClientRect = instance.$visualIFrame.getBoundingClientRect(),
                evt = new CustomEvent('mousemove', { bubbles: true, cancelable: false });

            evt.clientX = e.clientX + boundingClientRect.left;
            evt.clientY = e.clientY + boundingClientRect.top;

            instance.$visualIFrame.dispatchEvent(evt);
        };

        $resizer.addEventListener('mousedown', function (e) {
            initialY = e.clientY;
            initialHeight = instance.$el.offsetHeight;

            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', dispose);
            instance.$visualIFrame.contentWindow.addEventListener('mousemove', onIFrameDrag);
            instance.$visualIFrame.contentWindow.addEventListener('mouseup', dispose);
        });
    }
});