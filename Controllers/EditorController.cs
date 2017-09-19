using Moov2.Orchard.Editor.Models;
using Moov2.Orchard.Editor.ViewModels;
using Orchard;
using Orchard.ContentManagement;
using Orchard.MediaLibrary.Services;
using Orchard.Mvc.AntiForgery;
using System.Linq;
using System.Net;
using System.Web;
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
            return View(_orchardServices.WorkContext.CurrentSite.As<EditorSettingsPart>());
        }

        [HttpPost]
        [ValidateAntiForgeryTokenOrchard(false)]
        public ActionResult Media()
        {
            if (Request.Files.Count == 0)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var model = new MediaResultViewModel();

            foreach (string fileName in Request.Files)
            {
                HttpPostedFileBase file = Request.Files[fileName];
                var media = _mediaLibraryService.ImportMedia(file.InputStream, GetMediaPath(), file.FileName);
                _orchardServices.ContentManager.Create(media);

                model.files.Add(new {
                    url = _mediaLibraryService.GetMediaPublicUrl(media.FolderPath, media.FileName)
                });
            }

            return Json(model);
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