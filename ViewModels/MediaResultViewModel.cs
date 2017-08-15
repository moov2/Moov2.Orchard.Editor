using System.Collections.Generic;

namespace Moov2.Orchard.Editor.ViewModels
{
    public class MediaResultViewModel
    {
        public IList<object> files { get; set; }

        public MediaResultViewModel()
        {
            files = new List<object>();
        }
    }
}