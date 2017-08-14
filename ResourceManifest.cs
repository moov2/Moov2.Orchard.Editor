using Orchard.UI.Resources;

namespace Moov2.Orchard.Editor
{
    public class ResourceManifest : IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();
            manifest.DefineScript("AceVendorJs").SetUrl("ace/ace.js").SetCdn("//cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ace.js");

            manifest.DefineScript("MediumVendorJs").SetUrl("medium/medium-editor.min.js", "medium/medium-editor.js");
            manifest.DefineStyle("MediumVendorCss").SetUrl("medium/medium-editor.min.css", "medium/medium-editor.css");
            manifest.DefineStyle("MediumVendorCssTheme").SetUrl("medium/themes/default.min.css", "medium/themes/default.css");

            manifest.DefineScript("EditorJs").SetUrl("orchard.editor.min.js", "orchard.editor.js").SetDependencies(new string[] { "AceVendorJs", "MediumVendorJs" });
            manifest.DefineStyle("EditorStyles").SetUrl("Styles.css").SetDependencies(new string[] { "MediumVendorCss", "MediumVendorCssTheme" });
        }
    }
}