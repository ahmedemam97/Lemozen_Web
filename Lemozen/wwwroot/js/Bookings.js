$(function(){
let tokenExist = window.getToken()
/*if(tokenExist){*/
let Table = []
let AllData = []
let ClientList = []
let CityList = []
let CompanyList = []

$('#cancleBtn').hide()
$('#deleteBtn').hide()
$('#GoogleParentFrom').hide()
$('#GoogleParentTo').hide()


window.getPageInfo('Bookings/GetPageInfo',StartPage)


// فانكشن بداية الصفحة
function StartPage(res){
    if(res.IsSuccess == true && res.Obj != null){
        AllData = res.Obj.BookingsList
        ClientList = res.Obj.ClientList
        CityList = res.Obj.CityList
        CompanyList = res.Obj.CompanyList
        FillTable(AllData)
        window.FillSelect(`#ClientId`,ClientList,"Id","Name")
        window.FillSelect(`#CityFromId`,CityList,"Id","Name")
        window.FillSelect(`#CityToId`,CityList,"Id","Name")
        window.FillSelect(`#CompanyId`,CompanyList,"Id","Name")
}
}
//



$(document).on('click','#saveBtn',function(){
    let model = {}
    model.Id = Number($('#Id').val())
    model.ClientId = Number($('#ClientId').val())
    model.ClientPhone = $('#ClientPhone').val()
    model.Date= $('#Date').val()
    model.AddressFrom= $('#AddressFrom').val()
    model.AddressTo= $('#AddressTo').val()
    model.CityFromId= Number($('#CityFromId').val())
    model.CityToId  = Number($('#CityToId').val())
    model.TravelType = Number($('#TravelType').val())
    model.CompanyId = Number($('#CompanyId').val())
    model.GoogleFrom = $('#GoogleFrom').val()
    model.GoogleTo= $('#GoogleTo').val()


    if(model.ClientId <= 0 ){
        window.error('اختر العميل')
        return
    }
    if(model.ClientPhone.trim() == "" ){
        window.error('ادخل رقم الهاتف')
        return
    }
    if(model.Date == "" ){
        window.error('ادخل  التاريخ')
        return
    }
    if(model.AddressFrom.trim() == "" ){
        window.error('ادخل العنوان من')
        return
    }
    if(model.AddressTo.trim() == "" ){
        window.error('ادخل العنوان الي')
        return
    }
    if(model.CityFromId <= 0 ){
        window.error('ادخل المحافظة  من')
        return
    }
    if(model.CityToId <= 0 ){
        window.error('ادخل المحافظة  الي')
        return
    }
    if(model.TravelType <= 0 ){
        window.error('ادخل   نوع الرحلة')
        return
    }
    if(model.Id == 0){
        window.sendToserver('Bookings/Create',model,callBack)
    }else {
        window.sendToserver('Bookings/Update',model,callBack)
    }
})
$(document).on('click','#cancleBtn',function(){
    emptyPage()
}) 
$(document).on('click','#deleteBtn',function(){
    let id = Number($('#Id').val())
    window.confirm(title='حذف',content=' هل انت متاكد ؟  ',confirm)
    function confirm(){
    window.DeleteFromServer(`Bookings/Delete?id=${id}`,DeleteCallBack)
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
    $('#ClientId').val(rowModel.ClientId)
    $('#ClientPhone').val(rowModel.ClientPhone)
    $('#Date').val(rowModel.Date)
    $('#AddressFrom').val(rowModel.AddressFrom)
    $('#AddressTo').val(rowModel.AddressTo)
    $('#CityFromId').val(rowModel.CityFromId)
    $('#CityToId').val(rowModel.CityToId)
    $('#TravelType').val(rowModel.TravelType)
    $('#CompanyId').val(rowModel.CompanyId)
    $('#GoogleFrom').val(rowModel.GoogleFrom)
    $('#GoogleTo').val(rowModel.GoogleTo)
})
$(document).on('click','#CancleGoogleTo',function(){
    $('#GoogleTo').show()
    $('#GoogleTo').val('')
    $('#GoogleParentTo').hide()
    $('#GoogleToHref').attr('href','')
    $('#GoogleToHref').text('')
})
$(document).on('click','#CancleGoogleFrom',function(){
    $('#GoogleFrom').show()
    $('#GoogleFrom').val('')
    $('#GoogleParentFrom').hide()
    $('#GoogleFromHref').attr('href','')
    $('#GoogleFromHref').text('')
})
$(document).on('change','#GoogleFrom',function(){
    

let Value = `${$(this).val()}`
let FirstUrl = Value.slice(0,20)
console.log(Value)
console.log(FirstUrl)
if( FirstUrl != "https://goo.gl/maps/"){
    window.error(' ليس موقع خرائط جوجل')
    return
}
$('#GoogleParentFrom').show()
$(this).hide();

$('#GoogleFromHref').attr('href',Value)
$('#GoogleFromHref').text('لرؤية الموقع اضغط هنا')
console.log(Value)
console.log(FirstUrl)
})
$(document).on('change','#GoogleTo',function(){
    

    let Value = `${$(this).val()}`
    let FirstUrl = Value.slice(0,20)
    console.log(Value)
    console.log(FirstUrl)
    if( FirstUrl != "https://goo.gl/maps/"){
        window.error(' ليس موقع خرائط جوجل')
        return
    }
    $('#GoogleParentTo').show()
    $(this).hide();
    
    $('#GoogleToHref').attr('href',Value)
    $('#GoogleToHref').text('لرؤية الموقع اضغط هنا')
    console.log(Value)
    console.log(FirstUrl) 
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
                obj.ClientId = model.ClientId
                obj.ClientName = model.ClientName
                obj.ClientPhone = model.ClientPhone
                obj.Date = model.Date
                obj.AddressFrom = model.AddressFrom
                obj.AddressTo = model.AddressTo
                obj.CityFromId = model.CityFromId
                obj.CityFromName = model.CityFromName
                obj.CityToId = model.CityToId
                obj.CityToName = model.CityToName
                obj.TravelType = model.TravelType
                obj.CompanyId = model.CompanyId
                obj.CompanyName = model.CompanyName
                obj.GoogleFrom = model.GoogleFrom
                obj.GoogleTo = model.GoogleTo
            }
            FillTable(AllData)
    }
    
}
function FillTable(res){

    let col = [
        {'data':'Id'},
        {'data':'ClientName'},
        {'data':'ClientPhone'},
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){   
                
                let Date =Full.Date.split('T')[1].slice(0,5) +"  "+'  '+ Full.Date.split('T')[0]

                return Date
        }},
        {'data':'AddressFrom'},
        {'data':'AddressTo'},
        {'data':'CityFromName'},
        {'data':'CityToName'},
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
        {'data':'CompanyName'},
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){              
                let Index = ` <a target="_blank" href="${Full.GoogleFrom}" id="GoogleToHref">  جوجل من  </a>`
               
                return Index
        }},
        {'targets':-1,
            'render':function(Data,Type,Full,Meta){              
                let Index = ` <a target="_blank" href="${Full.GoogleTo}" id="GoogleToHref">  جوجل الي  </a>`
               
                return Index
        }},
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
    $('#ClientId').val('0')
    $('#ClientPhone').val('')
    $('#Date').val('')
    $('#AddressFrom').val('')
    $('#AddressTo').val('')
    $('#CityFromId').val('0')
    $('#CityToId').val('0')
    $('#TravelType').val('0')
    $('#CompanyId').val('0')
    $('#GoogleFrom').val('')
    $('#GoogleTo').val('')
    $('#GoogleParentTo').hide()
    $('#GoogleParentFrom').hide()
    $('#GoogleToHref').attr('href','')
    $('#GoogleToHref').text('')
    $('#GoogleFromHref').attr('href','')
    $('#GoogleFromHref').text('')
    $('#GoogleTo').show()
    $('#GoogleFrom').show()
}



//}else {
//    //window.location.href = '\login'
//    //return
//}














})