using ConnectSQLServerAndUsingAjaxJQuery.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using PagedList.Mvc;
using PagedList;
namespace ConnectSQLServerAndUsingAjaxJQuery.Controllers
{
    public class NhanVienController : Controller
    {
        private NorthwindEntities2 db = new NorthwindEntities2();
        // GET: NhanVien
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetNhanVien()
        {
            var listNhanVien = from entity in db.Employees
                               select new
                               {
                                   EmployeeID = entity.EmployeeID,
                                   LastName = entity.LastName,
                                   FirstName = entity.FirstName,
                                   Title = entity.Title,
                                   BirthDate = entity.BirthDate,
                                   Address = entity.Address,
                                   City = entity.City
                               };
            return Json(new {data=listNhanVien,
                status=true 
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ThemNhanVien(Employee model)
        {
            //JavaScriptSerializer se = new JavaScriptSerializer();
            Employee employee = new Employee
            {
                LastName = model.LastName,
                FirstName = model.FirstName,
                Title = model.Title,
                BirthDate = model.BirthDate,
                Address = model.Address,
                City = model.City
            };

            db.Employees.Add(employee);
            db.SaveChanges();
        
            return Json(employee,JsonRequestBehavior.AllowGet);
        }
        //[HttpPost]
        //public JsonResult SuaNhanVien(int id)
        //{
        //    var emp=Employee.



        //    return Json(employee, JsonRequestBehavior.AllowGet);
        //}
        [HttpPost]
        public JsonResult UpdateNhanVien(Employee employee,int id)
        {
            //JavaScriptSerializer serializer = new JavaScriptSerializer();
            //Employee employee = serializer.Deserialize<Employee>(model);
            var entity = db.Employees.Find(id);
            entity.LastName = employee.LastName;
            entity.FirstName = employee.FirstName;
            entity.Title = employee.Title;
            entity.BirthDate = employee.BirthDate;
            entity.Address = employee.Address;
            entity.City = employee.City;
            db.SaveChanges();
            return Json(new { status = true });
        }
        [HttpGet]
        public JsonResult LoadDetailsNV(int id)
        {
            var model = from entity in db.Employees where entity.EmployeeID == id
                       select new
                       {
                           EmployeeID = entity.EmployeeID,
                           LastName = entity.LastName,
                           FirstName = entity.FirstName,
                           Title = entity.Title,
                           BirthDate = entity.BirthDate,
                           Address = entity.Address,
                           City = entity.City
                       };
            return Json(new {
                data = model,
                status = true },JsonRequestBehavior.AllowGet) ;
        }
        [HttpPost]
        public JsonResult DeleteEmployee(int id)
        {
            //var emp = from entity in db.Employees
            //            where entity.EmployeeID == id
            //            select new
            //            {
            //                EmployeeID = entity.EmployeeID,
            //                LastName = entity.LastName,
            //                FirstName = entity.FirstName,
            //                Title = entity.Title,
            //                BirthDate = entity.BirthDate,
            //                Address = entity.Address,
            //                City = entity.City
            //            };
            db.Employees.Remove(db.Employees.Find(id));
            try
            {
                db.SaveChanges();
                return Json(new
                {
                    status = true
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }


    }
}