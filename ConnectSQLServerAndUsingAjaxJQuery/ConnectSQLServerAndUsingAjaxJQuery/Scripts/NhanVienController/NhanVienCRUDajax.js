function ConvertJsonDateString(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var year = dt.getFullYear();
        shortDate = monthString + '-' + dayString + '-' + year;
    }
    return shortDate;
};
//$(document).ready(function () {
//    $.ajax({
//        type: "get",
//        url: "/NhanVien/GetNhanVien",
//        dataType: "json",
//        success: function (data) {
//            var temp = data;
//            $.each(temp, function (i, v) {
//                var date = ConvertJsonDateString(v.BirthDate);
//                var tr = '<tr>'
//                tr += '<td>' + v.EmployeeID + '</td>'
//                tr += '<td>' + v.LastName + '</td>'
//                tr += '<td>' + v.FirstName + '</td>'
//                tr += '<td>' + v.Title + '</td>'
//                tr += '<td>' + date + '</td>'
//                tr += '<td>' + v.Address + '</td>'
//                tr += '<td>' + v.City + '</td>'
//                tr += '<td><a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="btn btn-success" data-toggle="tooltip" title="Edit">Edit</i></a><a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="btn btn-danger" data-toggle="tooltip" title="Delete">Delete</i></a><td>';
//                $("#Bang>tbody").append(tr);
//            });
//        },
//        error: function (error) {
//            alert("Thất bại");
//        }
//    });
//    $('#addEmployeeModal #add').on('click', function () {
//       //var data = $('#formDangKy').serialize();
//        var data= JSON.stringify({
//            LastName:$('#addEmployeeModal #LastName').val(),
//            FirstName:$('#addEmployeeModal #FirstName').val(),
//            Title:$('#addEmployeeModal #Title').val(),
//            BirthDate:$('#addEmployeeModal #BirthDate').val(),
//            Address:$('#addEmployeeModal #Address').val(),
//            City:$('#addEmployeeModal #City').val()
//        });
//        console.log(data);
//        $.ajax({
//            url: "NhanVien/ThemNhanVien",
//            data: data,
//            datatype: 'json',
//            type: 'post',
//            contentType: 'application/json',
//            success: function (data) {
//                alert("Thành công");
//                var tr = '<tr>'
//                tr += '<td>' + data.employeeid + '</td>'
//                tr += '<td>' + data.lastname + '</td>'
//                tr += '<td>' + data.firstname + '</td>'
//                tr += '<td>' + data.title + '</td>'
//                tr += '<td>' + data.birthdate + '</td>'
//                tr += '<td>' + data.address + '</td>'
//                tr += '<td>' + data.city + '</td>'
//                $("#Bang>tbody").append(tr);
//            },
//            error: function () {
//                alert("Thất bại");
//            }
//            });
//    });
//    $('#deleteEmployeeModal #delete').on('click', function (EmployeeID) {
//        //alert('Thanh cong');
//        var url = "NhanVien/XoaNhanVien" + EmployeeID;
//            $.ajax({
//                urll: url,
//                data: {
//                    EmployeeID: EmployeeID
//                },
//                type: 'delete',
//                contentType: 'application/json',
//                success: function (data) {
//                    alert("Xóa Thành công");
//                    $('#Bang #' + id).remove();
//                    $("#deleteEmployeeModal #cancel").click();
                    
//                },
//                error: function () {
//                    alert("Xóa thất bại");
//                }
//            });
//    });
//});

var NhanVienController = {
    init: function () {
        NhanVienController.loadData();
        NhanVienController.registerEvent();
    },
    registerEvent: function () {
        $('#btnTimKiem').off('click').on('click', function () {
            var name = $('#params').val();
            console.log(name);
            NhanVienController.searchEmployee(name);
        });
        $('#btnRefresh').off('click').on('click', function () {
            NhanVienController.loadData();
            $('#BangSearch').empty();
        });
        $('.btn-edit').off('click').on('click', function () {
            var id = $(this).data('id');
            console.log(id);
            $('#editEmployeeModal').modal('show');
            NhanVienController.loadDetailsEmp(id);
            $('#editEmployeeModal #editBtn').off('click').on('click', function () {
                var data = JSON.stringify({
                    LastName: $('#editEmployeeModal #LastNameB').val(),
                    FirstName: $('#editEmployeeModal #FirstNameB').val(),
                    Title: $('#editEmployeeModal #TitleB').val(),
                    BirthDate: $('#editEmployeeModal #BirthDateB').val(),
                    Address: $('#editEmployeeModal #AddressB').val(),
                    City: $('#editEmployeeModal #CityB').val()
                });
                NhanVienController.updateEmployee(id, data);
                $('#editEmployeeModal').modal('hide');
            });
        });      
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            $('#deleteEmployeeModal').modal('show');
            $('#deleteEmployeeModal #deleteBtn').on('click', function () {
                NhanVienController.deleteEmployee(id);
                $('#deleteEmployeeModal').modal('hide');
            });
        });
        $('#addEmployeeModal #add').off('click').on('click', function () {
            var data = JSON.stringify({
                LastName: $('#addEmployeeModal #LastNameA').val(),
                FirstName: $('#addEmployeeModal #FirstNameA').val(),
                Title: $('#addEmployeeModal #TitleA').val(),
                BirthDate: $('#addEmployeeModal #BirthDateA').val(),
                Address: $('#addEmployeeModal #AddressA').val(),
                City: $('#addEmployeeModal #CityA').val()
            });
            NhanVienController.AddEmployee(data);
        });

    },
    searchEmployee: function (name) {
        $.ajax({
            url: '/NhanVien/TimKiemNhanVien',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                name: name
            }),
            contentType: 'application/json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-templatesearch').html();
                    $.each(data, function (i, item) {
                        var date = ConvertJsonDateString(item.BirthDate);
                        html += Mustache.render(template, {
                            EmployeeID: item.EmployeeID,
                            LastName: item.LastName,
                            FirstName: item.FirstName,
                            BirthDate: date,
                            Title: item.Title,
                            Address: item.Address,
                            City: item.City
                        });
                    });
                    $('#Bang').empty();
                    $('#BangSearch').html(html);
                    NhanVienController.registerEvent();
                }
                

            },
            error: function () {
                alert("Tìm kiếm thất bại");
            }
        })
    },
    updateEmployee: function (id,value) {
        $.ajax({
            url: '/NhanVien/UpdateNhanVien/'+id,
            type: 'POST',
            dataType: 'json',
            data: value,
            contentType: 'application/json',
            success: function (data) {
                alert("Thành công");
                NhanVienController.loadData(true);
                $('#BangSearch').empty();
            },
            error: function () {
                alert("Thất bại");
            }
        })
    },
    loadDetailsEmp: function (id) {
        $.ajax({
            url: '/NhanVien/LoadDetailsNV/' + id,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                var data = response.data;
                var date = (data[0].BirthDate);
                    $('#editEmployeeModal #LastNameB').val(data[0].LastName);
                    $('#editEmployeeModal #FirstNameB').val(data[0].FirstName);
                $('#editEmployeeModal #TitleB').val(data[0].Title);
                $('#editEmployeeModal #BirthDateB').val(ConvertJsonDateString(date));
                    $('#editEmployeeModal #AddressB').val(data[0].Address);
                    $('#editEmployeeModal #CityB').val(data[0].City);
                   
            },
            error: function (error) {
                /* alert("Load chi tiết thất bại");*/
                console.log(error);
            }
        })
    },
    AddEmployee: function (data) {
        $.ajax({
            url: "NhanVien/ThemNhanVien",
            data: data,
            datatype: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                alert("Thành công");
                NhanVienController.loadData(true);
            },
            error: function () {
                alert("Thất bại");
            }
        });
    },
    loadData: function () {
        $.ajax({
            url: '/NhanVien/GetNhanVien',
            type: 'GET',
            dataType: 'json',
            success: function (response) {  
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        var date = ConvertJsonDateString(item.BirthDate);
                        html += Mustache.render(template, {
                            EmployeeID: item.EmployeeID,
                            LastName: item.LastName,
                            FirstName: item.FirstName,
                            BirthDate: date,
                            Title: item.Title,
                            Address: item.Address,
                            City: item.City
                        });
                    });
                    $('#Bang').html(html);
                    NhanVienController.registerEvent();
                     
                   
                } 
            }

        })
    },
    deleteEmployee: function (id) {
        $.ajax({
            url: '/NhanVien/DeleteEmployee/'+ id,          
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    alert("Xóa dữ liệu thành công");
                    NhanVienController.loadData(true);
                    $('#BangSearch').empty();
                }
                
            },
            
        });
    },
}
NhanVienController.init()