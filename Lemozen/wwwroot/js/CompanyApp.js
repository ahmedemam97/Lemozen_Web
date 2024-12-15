$(function(){
let tokenExist = window.getToken()
/*if(tokenExist){*/
let Table = []
let AllData = []
$('#cancleBtn').hide()
$('#deleteBtn').hide()


window.getPageInfo('CompanyApp/GetAll',StartPage)

// فانكشن بداية الصفحة
function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
        AllData = res.Obj
        FillTable(AllData)
}
}
//

// حفظ وارسال
$(document).on('click','#saveBtn',function(){
    let model = {}
    model.Id = Number($('#Id').val())
    model.Name = $('#Name').val()
    model.Commission = Number($('#Commission').val())
    model.Notes = $('#Notes').val()

    if(model.Name.trim() == ""){
        window.error('ادخل اسم شركة التطبيق')
        return
    }
    if(model.Commission <= 0){
        window.error('ادخل عمولة الشركة')
        return
    }

    if(model.Id == 0){
        window.sendToserver('CompanyApp/Create',model,callBack)
    }else {
        window.sendToserver('CompanyApp/Update',model,callBack)
    }
})
//

// العرض
$(document).on('click','#show',function(){
    let rowModel = Table.row($(this).parents('tr')).data()
    $('#cancleBtn').show()
    $('#deleteBtn').show()
    $('#saveBtn').removeClass("btn-primary");
    $('#saveBtn').addClass("btn-success");
    $('#saveBtn').text('تعديل')
    $('#Id').val(rowModel.Id)
    //
    $('#Name').val(rowModel.Name)
    $('#Commission').val(rowModel.Commission)
    $('#Notes').val(rowModel.Notes)
})
/////////

// الغاء
$(document).on('click','#cancleBtn',function(){
    emptyPage()
}) 
////////


// الحذف
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`CompanyApp/Delete?id=${id}`,DeleteCallBack)
    }
})
////////


//
function callBack(res){
    if(res.IsSuccess == true && res.Obj != null){
        emptyPage()
        let model = res.Obj
        let obj = AllData.find(e=>e.Id == model.Id)
        if(obj == undefined){
            AllData.push(res.Obj)
            FillTable(AllData)
        }else {
            obj.Name = model.Name
            obj.Commission = model.Commission
            obj.Notes = model.Notes
        }
        FillTable(AllData)
    } 
}
//

//
function FillTable(res){

    let col = [
        {'data':'Id'},
        {'data':'Name'},
        {'data':'Commission'},
        {'data':'Notes'},
        {'targets':-1,
            'render':function(){
                let html = `<a id="show" class="btn btn-primary text-white"> عرض  </a>`
                return html
            }}
          ]

Table = window.fillMainTable('#mainTable',res,col)

}
//


//
function DeleteCallBack(res){
    if(res.IsSuccess == true && res.Obj != null){
        emptyPage()
        let ID = res.Obj
        AllData = AllData.filter(e=>e.Id != ID)
        FillTable(AllData)
}
}
//


//
function emptyPage(){
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').removeClass("btn-success");
    $('#saveBtn').addClass("btn-primary");
    $('#saveBtn').text('حفظ')
    $('#Name').val("")
    $('#Commission').val("")
    $('#Notes').val("")
}
//

//}else {
//    //window.location.href = '\login'
//    //return
//}
        








})