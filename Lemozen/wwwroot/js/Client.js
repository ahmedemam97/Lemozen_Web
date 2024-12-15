$(function(){

let tokenExist = window.getToken()
  
//if(tokenExist){

let Table = []
let AllData = []
$('#cancleBtn').hide()
$('#deleteBtn').hide()

window.getPageInfo('Clients/GetAll',StartPage)

function StartPage(res){
if(res.IsSuccess == true && res.Obj != null){
        AllData = res.Obj
        FillTable(AllData)
}


}
////////////////////////////////////////////////////
$(document).on('click','#saveBtn',function(){
    let model = {}
    model.Id = Number($('#Id').val())
    model.Name = $('#Name').val()
    model.PhoneNumber = $('#PhoneNumber').val()
    model.Address = $('#Address').val()
    model.Notes = $('#Notes').val()

    if(model.Name.trim() == ""){
        window.error('ادخل اسم العميل')
        return
    }
    if(model.PhoneNumber.trim() == ""){
        window.error('ادخل رقم الهاتف ')
        return
    }   
    if(model.Id == 0){
        window.sendToserver('Clients/Create',model,callBack)
    }else {
        window.sendToserver('Clients/Update',model,callBack)
    }
})
$(document).on('click','#cancleBtn',function(){
    emptyPage()
}) 
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`Clients/Delete?id=${id}`,DeleteCallBack)
    }
})
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
$('#PhoneNumber').val(rowModel.PhoneNumber)
$('#Address').val(rowModel.Address)
$('#Notes').val(rowModel.Notes)
})
////////////////////////////////////////////////////
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
            obj.PhoneNumber = model.PhoneNumber
            obj.Address = model.Address
            obj.Notes = model.Notes
        }
        FillTable(AllData)
}

}
function FillTable(res){

    let col = [
        {'data':'Id'},
        {'data':'Name'},
        {'data':'PhoneNumber'},
        {'data':'Address'},
        {'data':'Notes'},
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
function emptyPage(){
    $('#Id').val('0')
    $('#cancleBtn').hide()
    $('#deleteBtn').hide()
    $('#saveBtn').removeClass("btn-success");
    $('#saveBtn').addClass("btn-primary");
    $('#saveBtn').text('حفظ')
    //
    $('#Name').val('')
    $('#PhoneNumber').val('')
    $('#Address').val('')
    $('#Notes').val('')
}
/////////////////////////////////////////////////////




//const connection = new signalR.HubConnectionBuilder()
//.withUrl(`${window.Domain}/Clients`,{
//      skipNegotiation:true,
//      transport:signalR.HttpTransportType.WebSockets,
//}).build();

//async function start() {
//  try {
//   await connection.start();
//   ServerListener()
//    console.log("SignalR Connected.");
//  } catch (err) {
//     console.log(err);
//  }
//};

//start();

//function ServerListener(){
//  connection?.on(`AddClient`,(m)=>{
//        console.log(m)
//  })
//}

//}else {
//    //window.location.href = '\login'
//    //return
//}

})