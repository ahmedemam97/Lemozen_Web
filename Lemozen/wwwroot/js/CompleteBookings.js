$(function(){
let tokenExist = window.getToken()
/*if(tokenExist){*/
let Table = []
let AllData = []
let CompanyList= []
window.getPageInfo('CompleteBooking/GetPageInfo',StartPage)

// فانكشن بداية الصفحة
function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
        AllData = res.Obj.BookingsList
        CompanyList = res.Obj.CompanyList
        window.FillSelect(`#OtherCompany`,CompanyList,"Id","Name")

        FillTable(AllData)
}
}
//

$(document).on('click','#saveBtn',function(){
    let model = {}
    model.BookingsId = $('#BookingsId').val()
    model.DoneById = $('#Select').val()
    model.Amount = Number($('#Amount').val())
    model.CompanyId = $('#OtherCompany').val()
    model.Reason = $('#Reason').val()

    if( model.DoneById == 1 && model.Amount <= 0){
        window.error(' ادخل المبلغ ')
        return
    }
    if( model.DoneById == 2 && model.CompanyId <=0 ){
        window.error(' اختر الشركة  ')
        return
    }
    if( model.DoneById == 2 && model.Amount <= 0 ){
        window.error(' ادخل المبلغ ')
        return
    }
    if( model.DoneById == 3 &&   model.Reason == ""){
        window.error(' ادخل السبب ')
        return
    }
    if( model.DoneById == 3 ){
        model.Amount = 0
    }
    window.sendToserver('CompleteBooking/Create',model,callBack)

console.log(model)

})


function callBack(res){
    $('#staticBackdrop').modal('hide');
    $('#BookingsId').val('0')
    $('#Select').val('1')
    $('#Amount').val('')
    $('#OtherCompany').val('')
    $('#Reason').val('')
    let model = res.Obj
    console.log(model)
    console.log(AllData)
    AllData = AllData.filter(e=>e.Id != model.BookingsId)
    FillTable(AllData)
}

$('#DoneTwo').empty()
$('#DoneThree').empty()

$(document).on('click','#show',function(){
    let rowModel = Table.row($(this).parents('tr')).data()
    // console.log(rowModel)
    $('#staticBackdrop').modal('show');
    $('#BookingsId').val(rowModel.Id)
})

$(document).on('change','#Select',function(){
let value = Number($(this).val())


$('#DoneOne').empty()
$('#DoneTwo').empty()
$('#DoneThree').empty()

if(value == 1){
let html = `
<label for="Amount" class="my-2"> المبلغ </label>
<input type="number" class="form-control text-center" name="Amount" id="Amount">`
$('#DoneOne').append(html)
}

if(value == 2){
    let html = `
    <label for="OtherCompany" class="my-2"> اسم الشركة </label>
    <select class="form-select text-center" name="OtherCompany" id="OtherCompany">
      <option selected value="0"> -- اختر الشركة -- </option>
    </select>
    <label for="Amount" class="my-2"> المبلغ </label>
    <input type="number" class="form-control text-center" name="Amount" id="Amount">`
    $('#DoneTwo').append(html)
    window.FillSelect(`#OtherCompany`,CompanyList,"Id","Name")

}
    
if(value == 3){
    let html = `
    <label for="Amount" class="my-2"> السبب </label>
    <input type="text" class="form-control text-center" name="Reason" id="Reason">`
    $('#DoneThree').append(html)
}
    
})


function FillTable(res){

    let col = [
        {'data':'Id'},
        {'data':'ClientName'},
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){   
                
                let Date =Full.Date.split('T')[1].slice(0,5) +"  "+'  '+ Full.Date.split('T')[0]

                return Date
        }},
        {'data':'AddressFrom'},
        {'data':'AddressTo'},
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){  
                let type = ""
                if(Full.TravelType == 1){
                    type = "ذهاب"
                }
                if(Full.TravelType == 2){
                    type = "ذهاب وعودة"
                }
                return type
        }},
        {'targets':-1,
            'render':function(){
                let html = `<a id="show" class="btn btn-primary text-white"> اعتماد  </a>`
                return html
            }}
          ]

Table = window.fillMainTable('#mainTable',res,col)

}









//}else {
//    //window.location.href = '\login'
//    //return
//}









})