/**
 * Handles inserting media via the visual editor.
 */

window.Editor.plugins.push({
    action: 'visualInsertMedia',
    init: true,
    exec: function (instance) {
        var _this = this;
        
        window.addEventListener('message', function (e) {
            if (e.data.id !== instance.id) {
                return;
            }

            if (e.data.action === 'begin-insert-media') {
                _this.insertMedia(instance);
                return;
            }
        });
    },

    insertMedia: function (instance) {
        var adminIndex = location.href.toLowerCase().indexOf("/admin/"),
            cachedScrollPosition = 0,
            _this = this;

        if (adminIndex === -1) {
            return;
        }

        $.colorbox({
            href: location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true",
            iframe: true,
            reposition: true,
            width: '90%',
            height: '90%',
            onLoad: function () {
                cachedScrollPosition = $('html').scrollTop();

                // hide the scrollbars from the main window
                $('html, body').css('overflow', 'hidden');
            },
            onClosed: function () {
                var selectedData = $.colorbox.selectedData;

                $('html, body').css('overflow', '');
                $('html').scrollTop(cachedScrollPosition);

                if (!selectedData || selectedData.length === 0) {
                    return;
                }

                instance.sendMessage({
                    action: 'insert-media',
                    selectedMedia: selectedData,
                    id: instance.id
                });
            }
        });
    }
});