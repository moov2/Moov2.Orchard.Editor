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
            instance.$el.dispatchEvent(new CustomEvent('resize'));
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