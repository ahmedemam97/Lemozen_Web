$(function(){

let tokenExist = window.getToken()
/*if(tokenExist){*/
let Table = []
let AllData = []
let ExpensesDaylist = []
let ExpensesMonthlist = []
let ExpensesCompanylist = []
let ExpensesApplist = []
$('#cancleBtn').hide()
$('#deleteBtn').hide()
$('#Date').val(new Date().toISOString().slice(0, 10))





//Table
window.newRowInc('#ExpensesDayTable')
window.newRowInc('#ExpensesMonthTable')
window.newRowInc('#ExpensesCompanyTable')
window.newRowInc('#ExpensesAppTable')
//

//
window.getPageInfo('DailyExpenses/GetPageInfo',StartPage)
//

// فانكشن بداية الصفحة
function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
        ExpensesDaylist =  res.Obj.Expenseslist.filter(e=>e.Type == 1)
        ExpensesMonthlist =  res.Obj.Expenseslist.filter(e=>e.Type == 2)
        ExpensesCompanylist = res.Obj.Companylist
        ExpensesApplist = res.Obj.CompanyAPPlist
        AllData = res.Obj.DailyExpenseslist
        FillTable(AllData)
        window.FillSelect(`#ExpensesDay1`,ExpensesDaylist,"Id","Name")
        window.FillSelect(`#ExpensesMonth1`,ExpensesMonthlist,"Id","Name")
        window.FillSelect(`#ExpensesCompany1`,ExpensesCompanylist,"Id","Name")
        window.FillSelect(`#ExpensesApp1`,ExpensesApplist,"Id","Name")
}
}
//

// حفظ وارسال
$(document).on('click','#saveBtn',function(){
    let model = {}
    model.Id = Number($('#Id').val())
    model.Date = $('#Date').val()
    
 
    model.ExpensesDay = ExpensesDay()

    if(model.ExpensesDay == undefined){
        return
    }

    model.ExpensesMonth = ExpensesMonth()
    if( model.ExpensesMonth == undefined){
        return
    }
 
    model.ExpensesCompany = ExpensesCompany()
    if( model.ExpensesCompany == undefined){
        return
    }
    
    model.ExpensesApp = ExpensesApp()
    if( model.ExpensesApp == undefined){
        return
    }
    let TotalExpenses = Total()

    if(TotalExpenses == 0){
        window.error('ادخل مصروف واحد علي الاقل')
        return 
    }

 console.log(model)

    if(model.Id == 0){
        window.sendToserver('DailyExpenses/Create',model,callBack)
    }else {
        window.sendToserver('DailyExpenses/Update',model,callBack)
    }

})
//

// حذف
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`DailyExpenses/Delete?id=${id}`,DeleteCallBack)
    }
})
//

// الغاء الامر
$(document).on('click','#cancleBtn',function(){
    emptyPage()
})  
//

// العرض للتعديل او الحذف
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
console.log(rowModel)

 var DayDetails = rowModel.ExpensesDetails.filter(e=>e.Flag == 1)
 var MonthDetails = rowModel.ExpensesDetails.filter(e=>e.Flag == 2)
 var CompanyDetails = rowModel.ExpensesDetails.filter(e=>e.Flag == 3)
 var AppDetails = rowModel.ExpensesDetails.filter(e=>e.Flag == 4)
 //
if(DayDetails.length > 0){
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesDayTable")
    TableInfo.rowIncArr = []
    TableInfo.rowCount = 0
    $('#ExpensesDayTable').empty()
    TotalExpensesDay()
    Total()
    for (let i = 0; i < DayDetails.length; i++) {
        AddRowDayTable()
        $(`#ExpensesDay${TableInfo.rowIncArr[i]}`).val(DayDetails[i].ExpensesId)
        $(`#AmountDay${TableInfo.rowIncArr[i]}`).val(DayDetails[i].Amount) 
    }
    TotalExpensesDay()
    Total()
}
//
if(MonthDetails.length > 0){
    let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#ExpensesMonthTable")
    TableInfo2.rowCount = 0  
    TableInfo2.rowIncArr = []
    $('#ExpensesMonthTable').empty()
    TotalExpensesMonth()
    Total()
    for (let i = 0; i < MonthDetails.length; i++) {
        AddRowMonthTable()
        $(`#ExpensesMonth${TableInfo2.rowIncArr[i]}`).val(MonthDetails[i].ExpensesId)
        $(`#AmountMonth${TableInfo2.rowIncArr[i]}`).val(MonthDetails[i].Amount) 
    } 
    TotalExpensesMonth()   
    Total()
}
//
if(CompanyDetails.length > 0){
    let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#ExpensesCompanyTable")
    TableInfo2.rowCount = 0  
    TableInfo2.rowIncArr = []
    $('#ExpensesCompanyTable').empty()
    TotalExpensesMonth()
    Total()
    for (let i = 0; i < CompanyDetails.length; i++) {
        AddRowCompanyTable()
        $(`#ExpensesCompany${TableInfo2.rowIncArr[i]}`).val(CompanyDetails[i].CompanyId)
        $(`#AmountCompany${TableInfo2.rowIncArr[i]}`).val(CompanyDetails[i].Amount) 
    } 
    TotalExpensesCompany()   
    Total()
}
//
if(AppDetails.length > 0){
    let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#ExpensesAppTable")
    TableInfo2.rowCount = 0  
    TableInfo2.rowIncArr = []
    $('#ExpensesAppTable').empty()
    TotalExpensesMonth()
    Total()
    for (let i = 0; i < AppDetails.length; i++) {
        AddRowAppTable()
        $(`#ExpensesApp${TableInfo2.rowIncArr[i]}`).val(AppDetails[i].AppId)
        $(`#AmountApp${TableInfo2.rowIncArr[i]}`).val(AppDetails[i].Amount) 
    } 
    TotalExpensesApp()   
    Total()
}
//

})
//

// اضافة سطر مصاريف يومية
$(document).on('click','.AddRowDay',function(){
    AddRowDayTable()
})
//////////////////////////////////

// حذف سطر مصاريف يومية
$(document).on('click','.RemoveRowDay',function(){
   let ThisIndex  = Number($(this).attr('rowIndex'))
   let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesDayTable")
    if(TableInfo.rowCount == 1 || ThisIndex == 1){
        window.error('لايمكن حذف اول سطر')
        return
    }
    $(`[rowIndex="${ThisIndex}"]`).remove()
    TableInfo.rowCount--
    TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
    TotalExpensesDay()
    Total()
})
/////////////////////////////////////

// مبلغ مصاريف يومية
$(document).on('keyup','.AmountDay',function(){
    TotalExpensesDay()
    Total()
})
//////////////////////////////////////

// اختيار مصاريف يومية
$(document).on('change','.ExpensesDaySelect',function(){
        let index = Number($(this).attr('rowIndex'))
        let value = Number($(this).val())
        let Obj = ExpensesDaylist.find(e=>e.Id == value)
        if(Obj == undefined){
            window.error('خطا في التعرف علي المصروف')
            return
        }
        $(`#AmountDay${index}`).val(  (Obj.Amount/30).toFixed(2)  )
        TotalExpensesDay()
        Total()
})
////////////////////////////////////////////////////////////////////////////////////////////

// اختيار مصاريف شهري
$(document).on('change','.ExpensesMonthSelect',function(){
    let index = Number($(this).attr('rowMonthIndex'))
    let value = Number($(this).val())
    let Obj = ExpensesMonthlist.find(e=>e.Id == value)
    if(Obj == undefined){
        window.error('خطا في التعرف علي المصروف')
        return
    }
    $(`#AmountMonth${index}`).val(  (Obj.Amount/30).toFixed(2)  )
    TotalExpensesMonth()
    Total()
})
/////////////////////////////////////////////////////////////

// مبلغ مصاريف شهري
$(document).on('keyup','.AmountMonth',function(){
    TotalExpensesMonth()
    Total()
})
//////////////////////////////////////

// مبلغ مصاريف شهري
$(document).on('keyup','.AmountCompany',function(){
    TotalExpensesCompany()
    Total()
})
//////////////////////////////////////

// مبلغ مصاريف تطبيق
$(document).on('keyup','.AmountApp',function(){
    TotalExpensesApp()
    Total()
})
//////////////////////////////////////

// حذف سطر مصاريف شهري
$(document).on('click','.RemoveRowMonth',function(){
    let ThisIndex  = Number($(this).attr('rowMonthIndex'))
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesMonthTable")
     if(TableInfo.rowCount == 1 || ThisIndex == 1){
         window.error('لايمكن حذف اول سطر')
         return
     }
     $(`[rowMonthIndex="${ThisIndex}"]`).remove()
     TableInfo.rowCount--
     TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
     TotalExpensesDay()
     Total()
 })
 /////////////////////////////////////

// اضافة سطر مصاريف شهرية
$(document).on('click','.AddRowMonth',function(){
    AddRowMonthTable()
})
//////////////////////////////////

// اضافة سطر مصاريف شركة
$(document).on('click','.AddRowCompany',function(){
    AddRowCompanyTable()
})
//////////////////////////////////
// حذف سطر مصاريف شركة
$(document).on('click','.RemoveRowCompany',function(){
    let ThisIndex  = Number($(this).attr('rowCompanyIndex'))
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesCompanyTable")
     if(TableInfo.rowCount == 1 || ThisIndex == 1){
         window.error('لايمكن حذف اول سطر')
         return
     }
     $(`[rowCompanyIndex="${ThisIndex}"]`).remove()
     TableInfo.rowCount--
     TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
     TotalExpensesDay()
     Total()
 })
 /////////////////////////////////////
// اختيار مصاريف شركة
$(document).on('change','.ExpensesCompanySelect',function(){
    let index = Number($(this).attr('rowCompanyIndex'))
    let value = Number($(this).val())
    let Obj = ExpensesCompanylist.find(e=>e.Id == value)
    if(Obj == undefined){
        window.error('خطا في التعرف علي المصروف')
        return
    }
    $(`#AmountCompany${index}`).val(  (Obj.Amount/30).toFixed(2)  )
    TotalExpensesCompany()
    Total()
})
/////////////////////////////////////////////////////////////

// اضافة سطر مصاريف تطبيق
$(document).on('click','.AddRowApp',function(){
    AddRowAppTable()
})
//////////////////////////////////
// حذف سطر مصاريف تطبيق
$(document).on('click','.RemoveRowApp',function(){
    let ThisIndex  = Number($(this).attr('rowAppIndex'))
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesAppTable")
     if(TableInfo.rowCount == 1 || ThisIndex == 1){
         window.error('لايمكن حذف اول سطر')
         return
     }
     $(`[rowAppIndex="${ThisIndex}"]`).remove()
     TableInfo.rowCount--
     TableInfo.rowIncArr = TableInfo.rowIncArr.filter(e=>e != ThisIndex)
     TotalExpensesDay()
     Total()
 })
 /////////////////////////////////////
// اختيار مصاريف شركة
$(document).on('change','.ExpensesAppSelect',function(){
    let index = Number($(this).attr('rowAppIndex'))
    let value = Number($(this).val())
    let Obj = ExpensesApplist.find(e=>e.Id == value)
    if(Obj == undefined){
        window.error('خطا في التعرف علي المصروف')
        return
    }
    $(`#AmountApp${index}`).val(  (Obj.Amount/30).toFixed(2)  )
    TotalExpensesApp()
    Total()
})
/////////////////////////////////////////////////////////////

// اضافة سطر مصاريف شركة
function AddRowCompanyTable(){

    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesCompanyTable")

    TableInfo.rowCount++
    
    let  Counter = TableInfo.rowCount
    
    let Index = TableInfo.rowIncArr.find(e=> e == Counter)
    
    if(Index != undefined){
        Counter =  Math.floor(Math.random() * (10000 - 1000 + 10) + 1000)
    }
    
    let rowHtml = `
    <tr rowCompanyIndex="${Counter}">
          <td>
            <div>
              <button id="AddRowCompany${Counter}" rowCompanyIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowCompany">+</button>
              <button id="RemoveRowCompany${Counter}" rowCompanyIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowCompany">-</button>
            </div>
          </td>
          <td>
            <select name="ExpensesCompany${Counter}" rowCompanyIndex="${Counter}" id="ExpensesCompany${Counter}" class="form-select ExpensesCompanySelect text-center">
              <option value="0"> --  اختر المصروف --</option>
            </select>
          </td>
          <td>
            <input rowCompanyIndex="${Counter}" id="AmountCompany${Counter}" type="number" class="form-control text-center AmountCompany">
          </td>
        </tr>
    `
    TableInfo.rowIncArr.push(Counter)
    $("#ExpensesCompanyTable").append(rowHtml)
    window.FillSelect(`#ExpensesCompany${Counter}`,ExpensesCompanylist,"Id","Name")
}
///////////////////////////////////////////////////////////

// اضافة سطر مصاريف تطبيق
function AddRowAppTable(){

    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesAppTable")

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
              <button id="AddRowApp${Counter}" rowAppIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowApp">+</button>
              <button id="RemoveRowApp${Counter}" rowAppIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowApp">-</button>
            </div>
          </td>
          <td>
            <select name="ExpensesApp${Counter}" rowAppIndex="${Counter}" id="ExpensesApp${Counter}" class="form-select ExpensesAppSelect text-center">
              <option value="0"> --  اختر المصروف --</option>
            </select>
          </td>
          <td>
            <input rowAppIndex="${Counter}" id="AmountApp${Counter}" type="number" class="form-control text-center AmountApp">
          </td>
        </tr>
    `
    TableInfo.rowIncArr.push(Counter)
    $("#ExpensesAppTable").append(rowHtml)
    window.FillSelect(`#ExpensesApp${Counter}`,ExpensesApplist,"Id","Name")
}
///////////////////////////////////////////////////////////

// اضافة سطر مصاريف يومية
function AddRowDayTable(){

let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesDayTable")

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
          <button id="AddRowDay${Counter}" rowIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowDay">+</button>
          <button id="RemoveRowDay${Counter}" rowIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowDay">-</button>
        </div>
      </td>
      <td>
        <select name="ExpensesDay${Counter}" rowIndex="${Counter}" id="ExpensesDay${Counter}" class="form-select ExpensesDaySelect text-center">
          <option value="0"> --  اختر المصروف --</option>
        </select>
      </td>
      <td>
        <input rowIndex="${Counter}" id="AmountDay${Counter}" type="number" class="form-control text-center AmountDay">
      </td>
    </tr>
`
TableInfo.rowIncArr.push(Counter)
$("#ExpensesDayTable").append(rowHtml)
window.FillSelect(`#ExpensesDay${Counter}`,ExpensesDaylist,"Id","Name")
}
///////////////////////////////////////////////////////////

// اضافة سطر مصاريف شهرية
function AddRowMonthTable(){

    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesMonthTable")
    
    TableInfo.rowCount++
    
    let  Counter = TableInfo.rowCount
    
    let Index = TableInfo.rowIncArr.find(e=> e == Counter)
    
    if(Index != undefined){
        Counter =  Math.floor(Math.random() * (10000 - 1000 + 10) + 1000)
    }
    
    let rowHtml = `
    <tr rowMonthIndex="${Counter}">
          <td>
            <div>
              <button id="AddRowMonth${Counter}" rowMonthIndex="${Counter}" class="btn btn-success fs-5 py-1 px-3 mx-2 AddRowMonth">+</button>
              <button id="RemoveRowMonth${Counter}" rowMonthIndex="${Counter}" class="btn btn-danger fs-5 py-1 px-3 mx-2 RemoveRowMonth">-</button>
            </div>
          </td>
          <td>
            <select name="ExpensesMonth${Counter}" rowMonthIndex="${Counter}" id="ExpensesMonth${Counter}" class="form-select ExpensesMonthSelect text-center">
              <option value="0"> --  اختر المصروف --</option>
            </select>
          </td>
          <td>
            <input rowMonthIndex="${Counter}" id="AmountMonth${Counter}" type="number" class="form-control text-center AmountMonth">
          </td>
        </tr>
    `
    TableInfo.rowIncArr.push(Counter)
    $("#ExpensesMonthTable").append(rowHtml)
    window.FillSelect(`#ExpensesMonth${Counter}`,ExpensesMonthlist,"Id","Name")
}
///////////////////////////////////////////////////////////

//  اضافة او تعديل بعد الاكشن
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
            obj.ExpensesDetails = model.ExpensesDetails
        }
        FillTable(AllData)
    } 
}
////////////////////////////////////////////////

// عرض الداتا في جدول
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
/////////////////////////////////////

// الحذف
function DeleteCallBack(res){
    if(res.IsSuccess == true && res.Obj != null){
        emptyPage()
        let ID = res.Obj
        AllData = AllData.filter(e=>e.Id != ID)
        FillTable(AllData)
}
}
//////////////////////////////////////

// داتا وتفاصيل جدول المصاريف اليومية
function ExpensesDay(){
let Arr = []

let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesDayTable")

for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
    var obj = {}
    obj.ExpensesId = Number($(`#ExpensesDay${TableInfo.rowIncArr[i]}`).val())
    obj.Amount = Number($(`#AmountDay${TableInfo.rowIncArr[i]}`).val())
    // if(obj.ExpensesId <= 0 || obj.ExpensesId== undefined || isNaN(obj.ExpensesId)){
    //     window.error('اختر المصروف اليومي')
    //     return
    // }
    if(obj.Amount < 0 || obj.Amount== undefined || isNaN(obj.Amount)){
        window.error('ادخل مبلغ صحيح')
        return 
    }
    if(obj.Amount > 0 && obj.ExpensesId <= 0){
        window.error('اختر المصروف للمبلغ الذي ادخلته')
        return
    }
    Arr.push(obj)
}
return Arr  
}
////////////////////////////////////////

//داتا وتفاصيل جدول المصاريف الشهرية 
function ExpensesMonth(){
    let Arr = []
    
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesMonthTable")
    
    for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
        var obj = {}
        obj.ExpensesId = Number($(`#ExpensesMonth${TableInfo.rowIncArr[i]}`).val())
        obj.Amount = Number($(`#AmountMonth${TableInfo.rowIncArr[i]}`).val())
        // if(obj.ExpensesId <= 0 || obj.ExpensesId== undefined || isNaN(obj.ExpensesId)){
        //     window.error('اختر المصروف الشهري')
        //     return
        // }
        if(obj.Amount < 0 || obj.Amount == undefined || isNaN(obj.Amount)){
            window.error('ادخل مبلغ صحيح')
            return 
        }
        if(obj.Amount > 0 && obj.ExpensesId <= 0){
            window.error('اختر المصروف للمبلغ الذي ادخلته')
            return
        }
        Arr.push(obj)
    }
    return Arr  
}
///////////////////////////////////////////

//داتا وتفاصيل جدول المصاريف الشركة 
function ExpensesCompany(){
    let Arr = []
    
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesCompanyTable")
    
    for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
        var obj = {}
        obj.ExpensesId = Number($(`#ExpensesCompany${TableInfo.rowIncArr[i]}`).val())
        obj.Amount = Number($(`#AmountCompany${TableInfo.rowIncArr[i]}`).val())
        // if(obj.ExpensesId <= 0 || obj.ExpensesId== undefined || isNaN(obj.ExpensesId)){
        //     window.error('اختر المصروف الشهري')
        //     return
        // }
        if(obj.Amount < 0 || obj.Amount == undefined || isNaN(obj.Amount)){
            window.error('ادخل مبلغ صحيح')
            return 
        }
        if(obj.Amount > 0 && obj.ExpensesId <= 0){
            window.error('اختر المصروف للمبلغ الذي ادخلته')
            return
        }
        Arr.push(obj)
    }
    return Arr  
}
///////////////////////////////////////////

//داتا وتفاصيل جدول المصاريف التطبيق 
function ExpensesApp(){
    let Arr = []
    
    let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesAppTable")
    
    for (let i = 0; i < TableInfo.rowIncArr.length; i++) {
        var obj = {}
        obj.ExpensesId = Number($(`#ExpensesApp${TableInfo.rowIncArr[i]}`).val())
        obj.Amount = Number($(`#AmountApp${TableInfo.rowIncArr[i]}`).val())
        // if(obj.ExpensesId <= 0 || obj.ExpensesId== undefined || isNaN(obj.ExpensesId)){
        //     window.error('اختر المصروف الشهري')
        //     return
        // }
        if(obj.Amount < 0 || obj.Amount == undefined || isNaN(obj.Amount)){
            window.error('ادخل مبلغ صحيح')
            return 
        }
        if(obj.Amount > 0 && obj.ExpensesId <= 0){
            window.error('اختر المصروف للمبلغ الذي ادخلته')
            return
        }
        Arr.push(obj)
    }
    return Arr  
}
///////////////////////////////////////////


// اجمالي مصاريف اليومية
function TotalExpensesDay(){
    let total = 0
    $(".AmountDay").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalExpensesDay').val((total).toFixed(2))
      Total()
}
//////////////////////////////////////////

// اجمالي المصاريف الشهرية
function TotalExpensesMonth(){
    let total = 0
    $(".AmountMonth").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalExpensesMonth').val((total).toFixed(2))
      Total()
}
///////////////////////////////////////////////

// اجمالي المصاريف الشركة
function TotalExpensesCompany(){
    let total = 0
    $(".AmountCompany").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalExpensesCompany').val((total).toFixed(2))
      Total()
}
///////////////////////////////////////////////

// اجمالي المصاريف التطبيق
function TotalExpensesApp(){
    let total = 0
    $(".AmountApp").each(function( index ) {
        if(Number($(this).val()) >= 0){
          total += Number($(this).val())
        }else {
          $(this).val('')
        }
      });
      $('#TotalExpensesApp').val((total).toFixed(2))
      Total()
}
///////////////////////////////////////////////

// تفريغ الشاشة
function emptyPage(){
    $('#Date').val(new Date().toISOString().slice(0, 10))
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').removeClass("btn-success");
    $('#saveBtn').addClass("btn-primary");
    $('#saveBtn').text('حفظ')
    //
    $('#ExpensesDayTable').empty()
    $('#ExpensesMonthTable').empty()
    $('#ExpensesCompanyTable').empty()
    $('#ExpensesAppTable').empty()
     let TableInfo = window.rowInc.find(e=>e.tableBody == "#ExpensesDayTable")
     TableInfo.rowCount = 0
     TableInfo.rowIncArr = []
     let TableInfo2 = window.rowInc.find(e=>e.tableBody == "#ExpensesMonthTable")
     TableInfo2.rowCount = 0
     TableInfo2.rowIncArr = []
     let TableInfo3 = window.rowInc.find(e=>e.tableBody == "#ExpensesCompanyTable")
     TableInfo3.rowCount = 0
     TableInfo3.rowIncArr = []
     let TableInfo4 = window.rowInc.find(e=>e.tableBody == "#ExpensesAppTable")
     TableInfo4.rowCount = 0
     TableInfo4.rowIncArr = []
     AddRowDayTable()
     AddRowMonthTable()
     AddRowCompanyTable()
     AddRowAppTable()
    //
    TotalExpensesMonth()
    TotalExpensesDay()
    TotalExpensesCompany()
    TotalExpensesApp()
    Total()
    //
}
///////////////////////////////////////////////////


function Total(){
    let Total = 0
    let TotalExpensesDay = Number($('#TotalExpensesDay').val())
    let TotalExpensesMonth = Number($('#TotalExpensesMonth').val())
    let TotalExpensesCompany = Number($('#TotalExpensesCompany').val())
    let TotalExpensesApp = Number($('#TotalExpensesApp').val())
   
    Total = TotalExpensesDay + TotalExpensesMonth + TotalExpensesCompany + TotalExpensesApp
    $('#Total').val( (Total).toFixed(2) )
    return (Total).toFixed(2)
}




//}else {
////window.location.href = '\login'
////return
//}

})