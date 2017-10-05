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