using Orchard.ContentManagement;
using Orchard.ContentManagement.FieldStorage.InfosetStorage;

namespace Moov2.Orchard.Editor.Models
{
    public class EditorSettingsPart : ContentPart
    {
        public const string CacheKey = "EditorSettingsPart";

        public string ContainerCss
        {
            get { return this.As<InfosetPart>().Get<EditorSettingsPart>("ContainerCss"); }
            set { this.As<InfosetPart>().Set<EditorSettingsPart>("ContainerCss", value.ToString()); }
        }
    }
}