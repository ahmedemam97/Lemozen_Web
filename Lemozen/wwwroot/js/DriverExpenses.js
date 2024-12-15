$(function(){

let tokenExist = window.getToken()
/*if(tokenExist){*/

let AllData = []
let DriverList = []
window.getPageInfo('DriverExpenses/GetPageInfo',StartPage)
$('#Date').val(new Date().toISOString().slice(0, 10))
$('#DriverAmountDate').val(new Date().toISOString().slice(0, 10))

function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
            console.log(res.Obj)
            AllData = res.Obj.DriverExpensesList
            DriverList = res.Obj.DriverList
            window.FillSelect(`#DriverId`,DriverList,"Id","Name")

            FillTable(AllData)
    }
    
    
}

$(document).on('click','#Send',function(){
let model = {}
model.Date = $('#Date').val()
window.sendToserver('DriverExpenses/DriverExpensesSearch',model,FillResponse)
})

$(document).on('click','#saveBtn',function(){
    let model = {}
    model.Id = Number($('#Id').val())
    model.DriverId = Number($('#DriverId').val())
    model.Amount = Number($('#Amount').val())
    model.Date = $('#DriverAmountDate').val()

    if(model.DriverId <= 0 ){
        window.error('اختر السائق')
        return
    }
    if(model.Amount <= 0 ){
        window.error('ادخل المبلغ')
        return
    }
    if(model.Id == 0){
        window.sendToserver('DriverExpenses/Create',model,callBack)

    }else {
        window.sendToserver('DriverExpenses/Update',model,callBack)

    }

})
// الغاء
$(document).on('click','#cancleBtn',function(){
    $('#Amount').val("")
    emptyPage()
}) 
////////

// الحذف
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`DriverExpenses/Delete?id=${id}`,DeleteCallBack)
    }
})
////////

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
    $('#DriverId').val(rowModel.DriverId)
    $('#Amount').val(rowModel.Amount)
    $('#Date').val(rowModel.Date.split('T')[0])
})
/////////
//
function emptyPage(){
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').text('دفع')
    $('#DriverId').val("0")
    $('#DriverAmountDate').val(new Date().toISOString().slice(0, 10))
    $('input[type="number"]').val("")
    console.log($('#Amount').val())
}
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
                obj.DriverId = model.DriverId
                obj.DriverName = model.DriverName
                obj.Amount = model.Amount
                obj.DailyExpensesId = model.DailyExpensesId
            }
            FillTable(AllData)
            $('#Amount').val("")
    }
    
}
function DeleteCallBack(res){
    if(res.IsSuccess == true && res.Obj != null){
        emptyPage()
        let ID = res.Obj
        AllData = AllData.filter(e=>e.Id != ID)
        FillTable(AllData)
}
}
function FillResponse(res){

let ResExpensesList = res.Obj.ExpensesList
let RevenueList = res.Obj.RevenueList

if(ResExpensesList.length > 0){
for (let i = 0; i < ResExpensesList.length; i++) {
    ResExpensesList[i].Date = ResExpensesList[i].Date.split('T')[0]     
}

let TotaExpenses = 0 
$('#TotaExpenses').val('')
for (let i = 0; i < ResExpensesList.length; i++) {
    TotaExpenses += ResExpensesList[i].Amount     
}
$('#TotaExpenses').val(TotaExpenses)


let col = [
    {'data':'Id'},
    {'data':'Date'},
    {'data':'Name'},
    {'data':'Amount'},
      ]

window.fillMainTable('#ExpensesTable',ResExpensesList,col)

}else {
    $('#ExpensesTable tbody').empty()
}
//


if(RevenueList.length > 0){
    for (let i = 0; i < RevenueList.length; i++) {
        RevenueList[i].Date = RevenueList[i].Date.split('T')[0]     
    }
    
   let  TotaRevenue = 0 
    $('#TotaRevenue').val('')
    for (let i = 0; i < RevenueList.length; i++) {
        TotaRevenue += RevenueList[i].Amount     
    }
    $('#TotaRevenue').val(TotaRevenue)

    let col = [
        {'data':'Id'},
        {'data':'Date'},
        {'data':'Name'},
        {'data':'Amount'},
          ]
    
    window.fillMainTable('#RevenueTable',RevenueList,col)
    
    }else {
        $('#RevenueTable tbody').empty()
    }
  
let TotaExpenses = $('#TotaExpenses').val()
let TotaRevenue = $('#TotaRevenue').val()
$('#Net').val( (TotaRevenue - TotaExpenses).toFixed(2) )


    
}
function FillTable(res){

    for (let i = 0; i < res.length; i++) {
        res[i].Date = res[i].Date.split('T')[0]     
    }

    let col = [
        {'data':'Id'},
        {'data':'DriverName'},
        {'data':'Amount'},
        {'data':'Date'},
        {'targets':-1,
            'render':function(){
                let html = `<a id="show" class="btn btn-primary text-white"> عرض  </a>`
                return html
            }}
          ]

Table = window.fillMainTable('#mainTable',res,col)

}
function emptyPage(){
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').removeClass("btn-success");
    $('#saveBtn').addClass("btn-primary");
    $('#saveBtn').text('حفظ')
    //
    $('#DriverId').val('0')
}
//}else {
//    //window.location.href = '\login'
//    //return
//}





})