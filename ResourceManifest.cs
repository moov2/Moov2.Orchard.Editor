using Orchard.UI.Resources;

namespace Moov2.Orchard.Editor
{
    public class ResourceManifest : IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();
            manifest.DefineScript("AceVendorJs").SetUrl("ace/ace.js").SetCdn("//cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ace.js");

            manifest.DefineScript("BeautifyVendorJs").SetUrl("beautify/beautify-html.min.js", "beautify/beautify-html.js").SetCdn("//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.14/beautify-html.min.js");

            // medium insert plugin dependencies.
            manifest.DefineScript("Handlebars").SetUrl("handlebars/handlebars.runtime.min.js", "handlebars/handlebars.runtime.js");
            manifest.DefineScript("jQuerySortable").SetUrl("jquery-sortable/jquery-sortable.min.js", "jquery-sortable/jquery-sortable.js");
            manifest.DefineScript("jQueryWidget").SetUrl("blueimp/jquery.ui.widget.js");
            manifest.DefineScript("jQueryIFrameTransport").SetUrl("blueimp/jquery.iframe-transport.js");
            manifest.DefineScript("jQueryFileUpload").SetUrl("blueimp/jquery.fileupload.js");
            manifest.DefineStyle("FontAwesome").SetUrl("font-awesome/font-awesome.css").SetCdn("//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css");

            manifest.DefineScript("MediumInsertMediaPluginJs").SetUrl("medium/plugins/medium-editor-insert-media-plugin.min.js", "medium/plugins/medium-editor-insert-media-plugin.js");
            manifest.DefineScript("MediumInsertPluginJs").SetUrl("medium/plugins/medium-editor-insert-plugin.min.js", "medium/plugins/medium-editor-insert-plugin.js").SetDependencies("jQuery", "Handlebars", "jQuerySortable", "jQueryWidget", "jQueryIFrameTransport", "jQueryFileUpload", "MediumInsertMediaPluginJs");
            manifest.DefineStyle("MediumInsertPluginCss").SetUrl("medium/plugins/medium-editor-insert-plugin.min.css", "medium/plugins/medium-editor-insert-plugin.css").SetDependencies("FontAwesome");

            manifest.DefineScript("MediumVendorJs").SetUrl("medium/medium-editor.min.js", "medium/medium-editor.js");
            manifest.DefineStyle("MediumVendorCss").SetUrl("medium/medium-editor.min.css", "medium/medium-editor.css");
            manifest.DefineStyle("MediumVendorCssTheme").SetUrl("medium/themes/default.min.css", "medium/themes/default.css");

            manifest.DefineScript("EditorJs").SetUrl("orchard.editor.min.js", "orchard.editor.js").SetDependencies(new string[] { "AceVendorJs", "BeautifyVendorJs" });
            manifest.DefineScript("EditorEmbedJs").SetUrl("orchard.medium.embed.min.js", "orchard.medium.embed.js");
            manifest.DefineStyle("EditorStyles").SetUrl("Styles.css");
        }
    }
}