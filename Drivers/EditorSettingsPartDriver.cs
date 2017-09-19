using Moov2.Orchard.Editor.Models;
using Orchard.Caching;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Orchard.ContentManagement.Handlers;
using Orchard.Localization;

namespace Moov2.Orchard.Editor.Drivers
{
    public class EditorSettingsPartDriver : ContentPartDriver<EditorSettingsPart>
    {
        private readonly ISignals _signals;
        private const string TemplateName = "Parts.EditorSettings";

        public EditorSettingsPartDriver(ISignals signals)
        {
            _signals = signals;
            T = NullLocalizer.Instance;
        }

        public Localizer T { get; set; }

        protected override string Prefix
        {
            get { return "EditorSettings"; }
        }

        protected override DriverResult Editor(EditorSettingsPart part, dynamic shapeHelper)
        {
            return ContentShape("Parts_EditorSettings_Edit",
                () => shapeHelper.EditorTemplate(TemplateName: TemplateName, Model: part, Prefix: Prefix))
                .OnGroup("Editor");
        }

        protected override DriverResult Editor(EditorSettingsPart part, IUpdateModel updater, dynamic shapeHelper)
        {
            if (updater.TryUpdateModel(part, Prefix, null, null))
                _signals.Trigger(EditorSettingsPart.CacheKey);

            return Editor(part, shapeHelper);
        }

        protected override void Importing(EditorSettingsPart part, ImportContentContext context)
        {
            _signals.Trigger(EditorSettingsPart.CacheKey);
        }
    }
}
