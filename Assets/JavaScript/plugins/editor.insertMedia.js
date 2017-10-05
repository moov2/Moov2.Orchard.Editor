/**
 * Inserts media into the editor from the Orchard media library.
 */

window.Editor.plugins.push({
    action: 'insert-media',
    init: false,
    exec: function (instance) {
        var adminIndex = location.href.toLowerCase().indexOf("/admin/"),
            cachedScrollPosition = 0;

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

                if (selectedData.length === 0) {
                    return;
                }
                
                instance.$el.dispatchEvent(new CustomEvent('editor:addMedia', {
                    detail: {
                        mediaItems: selectedData
                    }
                }));
            }
        });
    }
});