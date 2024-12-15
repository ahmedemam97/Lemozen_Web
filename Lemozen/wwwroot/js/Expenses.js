$(function(){

let tokenExist = window.getToken()
//if(tokenExist){
let Table = []
let AllData = []
$('#cancleBtn').hide()
$('#deleteBtn').hide()

window.getPageInfo('Expenses/GetAll',StartPage)


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
    model.Type = Number($('#Type').val())
    model.Amount = Number($('#Amount').val())
    model.Notes = $('#Notes').val()

    if(model.Name.trim() == ""){
        window.error('ادخل اسم المصروف')
        return
    }
    if(model.Type == 0){
        window.error('اختر نوع المصروف')
        return
    }

    if(model.Amount <= 0){
        window.error('ادخل قيمة المصروف')
        return
    }

    if(model.Id == 0){
        window.sendToserver('Expenses/Create',model,callBack)
    }else {
        window.sendToserver('Expenses/Update',model,callBack)
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
$('#Type').val(rowModel.Type).change()
$('#Amount').val(rowModel.Amount)
$('#Notes').val(rowModel.Notes)
})
/////////

// الغاء
$(document).on('click','#cancleBtn',function(){
    /*emptyPage()*/
    window.EmptyPage()
}) 
////////


// الحذف
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`Expenses/Delete?id=${id}`,DeleteCallBack)
    }
})
////////

//
function callBack(res){
    if(res.IsSuccess == true && res.Obj != null){
        /*  emptyPage()*/
        window.EmptyPage()

        let model = res.Obj
        let obj = AllData.find(e=>e.Id == model.Id)
        if(obj == undefined){
            AllData.push(res.Obj)
            FillTable(AllData)
        }else {
            obj.Name = model.Name
            obj.Amount = model.Amount
            obj.Type = model.Type
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
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){              
                let Index = ""
                if(Full.Type == 1){
                    Index = "يومي"
                }
                if(Full.Type == 2){
                    Index = "شهري"
                }
                if(Full.Type == 3){
                    Index = "شركة"
                }
                if(Full.Type == 4){
                    Index = "تطبيق"
                }
                return Index
        }},
        {'data':'Amount'},
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
        /*    emptyPage()*/
        window.EmptyPage()

        let ID = res.Obj
        AllData = AllData.filter(e=>e.Id != ID)
        FillTable(AllData)
}
}
//


//
//function emptyPage(){
//    $('#Id').val('0')
//    $('#cancleBtn').hide()
//    $('#deleteBtn').hide()
//    $('#saveBtn').removeClass("btn-success");
//    $('#saveBtn').addClass("btn-primary");
//    $('#saveBtn').text('حفظ')
//    $('#Name').val("")
//    $('#Type').val("0")
//    $('#Amount').val("")
//    $('#Notes').val("")
//}
//

//}else {
    //window.location.href = '\login'
    //return
//}
})