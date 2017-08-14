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

            manifest.DefineScript("MediumVendorJs").SetUrl("medium/medium-editor.min.js", "medium/medium-editor.js");
            manifest.DefineStyle("MediumVendorCss").SetUrl("medium/medium-editor.min.css", "medium/medium-editor.css");
            manifest.DefineStyle("MediumVendorCssTheme").SetUrl("medium/themes/default.min.css", "medium/themes/default.css");

            manifest.DefineScript("EditorJs").SetUrl("orchard.editor.min.js", "orchard.editor.js").SetDependencies(new string[] { "AceVendorJs", "BeautifyVendorJs" });
            manifest.DefineScript("EditorEmbedJs").SetUrl("orchard.medium.embed.min.js", "orchard.medium.embed.js");
            manifest.DefineStyle("EditorStyles").SetUrl("Styles.css");
        }
    }
}