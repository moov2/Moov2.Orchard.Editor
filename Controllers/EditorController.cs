using Orchard;
using Orchard.ContentManagement;
using Orchard.MediaLibrary.Services;
using Orchard.Mvc.AntiForgery;
using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace Moov2.Orchard.Editor.Controllers
{
    [Authorize]
    public class EditorController : Controller
    {
        #region Constants

        private const string MediaPathKey = "MediaPath";
        private const string DefaultMediaPath = "Temp";

        #endregion

        #region Dependencies

        private readonly IMediaLibraryService _mediaLibraryService;
        private readonly IOrchardServices _orchardServices;
        private readonly IWorkContextAccessor _workContextAccessor;

        #endregion

        #region Constructor

        public EditorController(IMediaLibraryService mediaLibraryService, IOrchardServices orchardServices, IWorkContextAccessor workContextAccessor)
        {
            _mediaLibraryService = mediaLibraryService;
            _orchardServices = orchardServices;
            _workContextAccessor = workContextAccessor;
        }

        #endregion

        #region Actions

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryTokenOrchard(false)]
        public string Media()
        {
            if (Request.Files.Count != 1)
                throw (new Exception("Request must only contains a single file."));

            var media = _mediaLibraryService.ImportMedia(Request.Files[0].InputStream, GetMediaPath(), Request.Files[0].FileName);
            _orchardServices.ContentManager.Create(media);
            
            return _mediaLibraryService.GetMediaPublicUrl(media.FolderPath, media.FileName);
        }

        #endregion

        #region HelperMethods

        private string GetMediaPath()
        {
            return Request.Form.AllKeys.Any(x => x == MediaPathKey) ? Request.Form.Get(MediaPathKey) : DefaultMediaPath;
        }

        #endregion
    }
}