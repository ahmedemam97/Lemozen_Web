$(function(){
let tokenExist = window.getToken()
/*if(tokenExist){*/
let AllCompany = []
let AllCompanyAPP = []
$('#FromDate').val(new Date().toISOString().slice(0, 10))
$('#ToDate').val(new Date().toISOString().slice(0, 10))


window.getPageInfo('DailyRevenue/RevenueSearchInfo',StartPage)

// فانكشن بداية الصفحة
function StartPage(res){
        if(res.IsSuccess == true && res.Obj != null){
                    console.log(res.Obj)
                    AllCompany = res.Obj.AllCompany
                    AllCompanyAPP = res.Obj.AllCompanyAPP
                    window.FillSelect(`#CompanyId`,AllCompany,"Id","Name")
                    window.FillSelect(`#AppId`,AllCompanyAPP,"Id","Name")
} 
}
//
$(document).on('click','#CompanyId',function(){
    $('#AppId').val('0')
})
$(document).on('click','#AppId',function(){
    $('#CompanyId').val('0')
})
$(document).on('click','#saveBtn',function(){

    let model = {}
    model.FromDate = $('#FromDate').val()
    model.ToDate = $('#ToDate').val()
    model.CompanyId =Number( $('#CompanyId').val())
    model.AppId = Number($('#AppId').val())
    console.log(model)
    window.sendToserver('DailyRevenue/RevenueSearch',model,FillTable)


})


function FillTable(res){

    let list = res.Obj
    
    if(list.length == 0){
        $('#mainTable tbody').empty()
        window.error('لا يوجد بيانات')
        return
    }
    let total = 0 
    $('#TotalSearch').text('')
    console.log(list)
    for (let i = 0; i < list.length; i++) {
       total += list[i].Amount
        
    }
    
    $('#TotalSearch').text( (total).toFixed(2) )
        let col = [
            {'data':'Id'},
            {'data':'Name'},
            {'data':'Amount'},
            {'targets':-1,
                'render':function(){
                    let html = `<a id="show" class="btn btn-primary text-white"> عرض  </a>`
                    return html
                }}
              ]
    
    Table = window.fillMainTable('#mainTable',list,col)
    
}

//}else {
//    //window.location.href = '\login'
//    //return
//}








})