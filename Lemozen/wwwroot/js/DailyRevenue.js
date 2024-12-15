$(function(){

let tokenExist = window.getToken()
  
/*if(tokenExist){*/
        
let Table = []
let AllData = []
let AllCompany = []
let AllCompanyAPP = []

$('#cancleBtn').hide()
$('#deleteBtn').hide()
$('#Date').val(new Date().toISOString().slice(0, 10))

//Table
window.newRowInc('#RevenueTable')
window.newRowInc('#RevenueAppTable')
//

// فانكشن بداية الصفحة
window.getPageInfo('DailyRevenue/GetPageInfo',StartPage)
//
// فانكشن بداية الصفحة
function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
        console.log(res.Obj)
        AllData = res.Obj.DailyRevenuelist
        FillTable(AllData)
        AllCompany = res.Obj.AllCompany
        AllCompanyAPP = res.Obj.AllCompanyAPP
        window.FillSelect(`#Revenue1`,AllCompany,"Id","Name")
        window.FillSelect(`#RevenueApp1`,AllCompanyAPP,"Id","Name")
}
}
//
// حفظ وارسال
$(document).on('click','#saveBtn',function(){
        let model = {}
        model.Id = Number($('#Id').val())
        model.Date = $('#Date').val()

        if(model.Date == ''){
            window.error('ادخل التاريخ')
            return
        }
        
        model.RevenueCompany = RevenueDetails()

        if(model.RevenueCompany == undefined){
            return
        }

        model.RevenueApp = RevenueAppDetails()

        if(model.RevenueApp == undefined){
            return
        }
    let TotalRevenue = Total()

    if(TotalRevenue == 0){
        window.error('ادخل ايراد واحد علي الاقل')
        return 
    }
    console.log(model)

        if(model.Id == 0){
            window.sendToserver('DailyRevenue/Create',model,callBack)
        }else {
            window.sendToserver('DailyRevenue/Update',model,callBack)
        }
       
})
//

// الغاء الامر
$(document).on('click','#cancleBtn',function(){
    emptyPage()
})
//

$(document).on('click','#show',function(){
let rowModel = Table.row($(this).parents('tr')).data()
$('#cancleBtn').show()
$('#deleteBtn').show()
$('#saveBtn').removeClass("btn-primary");
$('#saveBtn').addClass("btn-success");
$('#saveBtn').text('تعديل')
//
$('#Id').val(rowModel.Id)
$('#Date').val(rowModel.Date.split('T')[0])
//

    console.log(rowModel.RevenueDetails)


var RevenueDetails = rowModel.RevenueDetails.filter(e=>e.Flag == 1)
var RevenueAppDetails = rowModel.RevenueDetails.filter(e=>e.Flag == 2)

    if (RevenueDetails.length > 0) {
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueTable")
    TableInfo.rowIncArr = []
    TableInfo.rowCount = 0
    $('#RevenueTable').empty()
    TotalRevenue()
    Total()
    for (let i = 0; i < RevenueDetails.length; i++) {
        AddRowRevenueTable()
        $(`#Revenue${TableInfo.rowIncArr[i]}`).val(RevenueDetails[i].CompanyId)
        $(`#AmountRevenue${TableInfo.rowIncArr[i]}`).val(RevenueDetails[i].Amount)
    }
    TotalRevenue()
    Total()
}

if(RevenueAppDetails.length > 0){
    let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#RevenueAppTable")
    TableInfo2.rowCount = 0  
    TableInfo2.rowIncArr = []
    $('#RevenueAppTable').empty()
    TotalRevenueApp()
    Total()
    for (let i = 0; i < RevenueAppDetails.length; i++) {
        AddRowRevenueAppTable()
        $(`#RevenueApp${TableInfo2.rowIncArr[i]}`).val(RevenueAppDetails[i].AppId)
        $(`#AmountRevenueApp${TableInfo2.rowIncArr[i]}`).val(RevenueAppDetails[i].Amount) 
    } 
    TotalRevenueApp()   
    Total()
}

})
//////////////////////////////////////////////////

$(document).on('click','#deleteBtn',function(){
let id = Number($('#Id').val())
window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
function confirm(){
window.DeleteFromServer(`DailyRevenue/Delete?id=${id}`,DeleteCallBack)
}
})
/////////////////////////////////////////////////////

// مبلغ  تطبيق
$(document).on('keyup','.AmountRevenueApp',function(){
    TotalRevenueApp()
    Total()
})
//

// مبلغ شركة
$(document).on('keyup','.AmountRevenue',function(){
    TotalRevenue()
    Total()
})
//

// اضافة سطر شركات 
$(document).on('click','.AddRowRevenue',function(){
    AddRowRevenueTable()
})
//

// اضافة سطر تطبيث 
$(document).on('click','.AddRowRevenueApp',function(){
    AddRowRevenueAppTable()
})
//

// حذف سطر ايرادات شركة
$(document).on('click','.RemoveRowRevenue',function(){
    let ThisIndex  = Number($(this).attr('rowIndex'))
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueTable")
     if(TableInfo.rowCount == 1 || ThisIndex == 1){
         window.error('لايمكن حذف اول سطر')
         return
     }
     $(`[rowIndex="${ThisIndex}"]`).remove()
     TableInfo.rowCount--
     TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
     TotalRevenue()
     Total()
})
//

// حذف سطر ايرادات تطبيق
$(document).on('click','.RemoveRowRevenueApp',function(){
    let ThisIndex  = Number($(this).attr('rowAppIndex'))
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueAppTable")
     if(TableInfo.rowCount == 1 || ThisIndex == 1){
         window.error('لايمكن حذف اول سطر')
         return
     }
     $(`[rowAppIndex="${ThisIndex}"]`).remove()
     TableInfo.rowCount--
     TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
     TotalRevenueApp()
     Total()
})
//

//////////////////////////////////////////////////////////


// اضافة سطر  ايراات الشركة
function AddRowRevenueTable(){
let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueTable")
TableInfo.rowCount++
let  Counter = TableInfo.rowCount
let Index = TableInfo.rowIncArr.find(e=> e == Counter)
if(Index != undefined){
    Counter =  Math.floor(Math.random() * (10000 - 1000 + 10) + 1000)
}
let rowHtml = `
<tr rowIndex="${Counter}">
<td>
  <div>
    <button id="AddRowRevenue${Counter}" rowIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowRevenue">+</button>
    <button id="RemoveRowRevenue${Counter}" rowIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowRevenue">-</button>
  </div>
</td>
<td>
  <select name="Revenue${Counter}" rowIndex="${Counter}" id="Revenue${Counter}" class="form-select RevenueSelect text-center">
    <option value="0"> --  اختر الشركة --</option>
  </select>
</td>
<td>
  <input rowIndex="${Counter}" id="AmountRevenue${Counter}" type="number" class="form-control text-center AmountRevenue">
</td>
</tr>
`
TableInfo.rowIncArr.push(Counter)
$("#RevenueTable").append(rowHtml)
window.FillSelect(`#Revenue${Counter}`,AllCompany,"Id","Name")
}
///////////////////////////////////////////////////////

// اضافة سطر  ايراات تطبيق
function AddRowRevenueAppTable(){
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueAppTable")
    TableInfo.rowCount++
    let  Counter = TableInfo.rowCount
    let Index = TableInfo.rowIncArr.find(e=> e == Counter)
    if(Index != undefined){
        Counter =  Math.floor(Math.random() * (10000 - 1000 + 10) + 1000)
    }
    let rowHtml = `
    <tr rowAppIndex="${Counter}">
    <td>
      <div>
        <button id="AddRowRevenueApp${Counter}" rowAppIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowRevenueApp">+</button>
        <button id="RemoveRowRevenueApp${Counter}" rowAppIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowRevenueApp">-</button>
      </div>
    </td>
    <td>
      <select name="RevenueApp" rowAppIndex="${Counter}" id="RevenueApp${Counter}" class="form-select RevenueAppSelect text-center">
        <option value="0"> --  اختر التطبيق --</option>
      </select>
    </td>
    <td>
      <input rowAppIndex="${Counter}" id="AmountRevenueApp${Counter}" type="number" class="form-control text-center AmountRevenueApp">
    </td>
  </tr>
    `
    TableInfo.rowIncArr.push(Counter)
    $("#RevenueAppTable").append(rowHtml)
    window.FillSelect(`#RevenueApp${Counter}`,AllCompanyAPP,"Id","Name")
}
///////////////////////////////////////////////////////

///
function TotalRevenue(){
    let total = 0
    $(".AmountRevenue").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalRevenue').val((total).toFixed(2))
      Total()
}
function TotalRevenueApp(){
    let total = 0
    $(".AmountRevenueApp").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalRevenueApp').val((total).toFixed(2))
      Total()
}
function Total(){
    let Total = 0
    let TotalRevenue = Number($('#TotalRevenue').val())
    let TotalRevenueApp = Number($('#TotalRevenueApp').val())
    Total = TotalRevenue + TotalRevenueApp
    $('#Total').val(Total)
    return Total
}
//
//داتا وتفاصيل جدول  الشركات 
function RevenueDetails(){
    let Arr = []
    
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueTable")
    for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
        var obj = {}
        obj.RevenueId = Number($(`#Revenue${TableInfo.rowIncArr[i]}`).val())
        obj.Amount = Number($(`#AmountRevenue${TableInfo.rowIncArr[i]}`).val())
        obj.Flag = 1
        // if(obj.RevenueId <= 0|| obj.RevenueId== undefined || isNaN(obj.RevenueId)){
        //     window.error('اختر الشركة')
        //     return
        // }
        if(obj.Amount < 0 || obj.Amount== undefined || isNaN(obj.Amount)){
            window.error('ادخل مبلغ صحيح')
            return 
        }
        if(obj.Amount > 0 && obj.RevenueId <= 0){
            window.error('اختر الايراد للمبلغ الذي ادخلته')
            return
        }
        Arr.push(obj)
    }
    return Arr  
}
///////////////////////////////////////////
//داتا وتفاصيل جدول  التطبيق 
function RevenueAppDetails(){
    let Arr = []
    
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueAppTable")
    
    for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
        var obj = {}
        obj.RevenueId = Number($(`#RevenueApp${TableInfo.rowIncArr[i]}`).val())
        obj.Amount = Number($(`#AmountRevenueApp${TableInfo.rowIncArr[i]}`).val())
        obj.Flag = 2
        // if(obj.RevenueId <= 0|| obj.RevenueId== undefined || isNaN(obj.RevenueId)){
        //     window.error('اختر التطبيق')
        //     return
        // }
        if(obj.Amount < 0 || obj.Amount== undefined || isNaN(obj.Amount)){
            window.error('ادخل مبلغ صحيح')
            return 
        }
        if(obj.Amount > 0 && obj.RevenueId <= 0){
            window.error('اختر الايراد للمبلغ الذي ادخلته')
            return
        }
        Arr.push(obj)
    }
    return Arr  
}
///////////////////////////////////////////
function emptyPage(){
    $('#Date').val(new Date().toISOString().slice(0, 10))
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').removeClass("btn-success");
    $('#saveBtn').addClass("btn-primary");
    $('#saveBtn').text('حفظ')
    //
    $('#RevenueTable').empty()
    $('#RevenueAppTable').empty()
    //
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#RevenueTable")
    TableInfo.rowIncArr = []
    TableInfo.rowCount = 0
    let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#RevenueAppTable")
    TableInfo2.rowCount = 0
    TableInfo2.rowIncArr = []
     AddRowRevenueTable()
     AddRowRevenueAppTable()
     //
     TotalRevenue()
     TotalRevenueApp()
     Total()
     //
}
//////
function callBack(res){
if(res.IsSuccess == true && res.Obj != null){
    emptyPage()
    let model = res.Obj
    let obj = AllData.find(e=>e.Id == model.Id)
    
    if(obj == undefined){
        AllData.push(res.Obj)
        FillTable(AllData)
    }else {
        obj.Date = model.Date
        obj.NetTotal = model.NetTotal
        obj.RevenueDetails = model.RevenueDetails
    }
    FillTable(AllData)
}


}

function FillTable(res){

    for (let i = 0; i < res.length; i++) {
        res[i].Date = res[i].Date.split('T')[0]     
    }
    
        let col = [
            {'data':'Id'},
            {'data':'Date'},
            {'data':'NetTotal'},
            {'targets':-1,
                'render':function(){
                    let html = `<a id="show" class="btn btn-primary text-white"> عرض  </a>`
                    return html
                }}
              ]
    
    Table = window.fillMainTable('#mainTable',res,col)
}

function DeleteCallBack(res){
if(res.IsSuccess == true && res.Obj != null){
    emptyPage()
    let ID = res.Obj
    AllData = AllData.filter(e=>e.Id != ID)
    FillTable(AllData)
}
}

//}else {
//    //window.location.href = '\login'
//    //return
//}
  
})