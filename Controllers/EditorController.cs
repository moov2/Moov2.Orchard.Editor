using System.Web.Mvc;

namespace Moov2.Orchard.Editor.Controllers
{
    public class EditorController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}