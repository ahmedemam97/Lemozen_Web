

window.Domain = 'https://localhost:7000'

//let Domain = ''
let token = JSON.parse(localStorage.getItem('Token'))
// console.log(token)
window.sendToserver = (url,model,callbackFun,async = false,selector=$("#saveBtn"))=>{

let loader = `
<div class="loader" id="loader-4">
<span></span>
<span></span>
<span></span>
</div>`

$('#htmlBody').append(loader)


  if(selector != null)
  $(selector).prop('disabled',true)


  if(token != null){
    $.ajax({
      type:'POST',
      url:`${Domain}/${url}`,
      data:JSON.stringify(model),
      dataTpe:'json',
      headers: {
        "Authorization": `Bearer ${token}` ,
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin":"*",
      },
      contentType: "application/json; charset=utf-8",
      async: async,
      cache: false,
      success:function(value){
       
         setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
       
        if(selector != null)
        $(selector).prop('disabled',false)
  
        if(value.IsSuccess == true){
          if(callbackFun != undefined && callbackFun != null){
            callbackFun(value)
          }
          if(value.Message != 'none'){
            window.success(value.Message)
          }
        }else {
          window.error(value.Message)
        }
      },error:function(err){
  
        setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
  
        console.log(err)
  
        if(err.responseJSON.Message != undefined){
          window.error(err.responseJSON.Message)
        }
        if(selector != null)
        $(selector).prop('disabled',false)
  
      }
    })
  }else {
    $.ajax({
      type:'POST',
      url:`${Domain}/${url}`,
      data:JSON.stringify(model),
      dataTpe:'json',
      contentType: "application/json; charset=utf-8",
      async: async,
      cache: false,
      success:function(value){
       
         setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
       
        if(selector != null)
        $(selector).prop('disabled',false)
  
        if(value.IsSuccess == true){
          if(callbackFun != undefined && callbackFun != null){
            callbackFun(value)
          }
          if(value.Message != 'none'){
            window.success(value.Message)
          }
        }else {
          window.error(value.Message)
        }
      },error:function(err){
  
        setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
  
        console.log(err)
  
        if(err.responseJSON.Message != undefined){
          window.error(err.responseJSON.Message)
        }
        if(selector != null)
        $(selector).prop('disabled',false)
  
      }
    })
  }

}

window.getPageInfo = (url,callbackFun,async = false)=>{
let loader = `
<div class="loader" id="loader-4">
<span></span>
<span></span>
<span></span>
</div>`

$('#htmlBody').append(loader)


$.ajax({
  type:'GET',
  url:`${Domain}/${url}`,
  //"Authorization": `Bearer ${token}` ,
  headers: {
    "Authorization": `Bearer ${token}` ,
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin":"*",
  },
  dataTpe:'json',
  contentType: "application/json; charset=utf-8",
  async: async,
  cache: false,
  success:function(value){
   
     setTimeout(()=>{
      $('#loader-4').remove()
     },1000)
   
    if(value.IsSuccess == true){
      if(callbackFun != undefined && callbackFun != null){
        callbackFun(value)
      }
      if(value.Message != 'none'){
        window.success(value.Message)
      }
    }else {
      window.error(value.Message)
    }
  },error:function(err){

    setTimeout(()=>{
      $('#loader-4').remove()
     },1000)

    console.log(err)

    if(err.responseJSON.Message != undefined){
      window.error(err.responseJSON.Message)
    }

  }
})



}

window.DeleteFromServer = (url,callbackFun,async = false,selector=$("#saveBtn"))=>{

  let loader = `
  <div class="loader" id="loader-4">
  <span></span>
  <span></span>
  <span></span>
  </div>`
  
  $('#htmlBody').append(loader)
  
  
    if(selector != null)
    $(selector).prop('disabled',true)
  
    $.ajax({
      type:'DELETE',
      url:`${Domain}/${url}`,
      dataTpe:'json',
      headers: {
        "Authorization": `Bearer ${token}` ,
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin":"*",
      },
      contentType: "application/json; charset=utf-8",
      async: async,
      cache: false,
      success:function(value){
       
         setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
       
        if(selector != null)
        $(selector).prop('disabled',false)
  
        if(value.IsSuccess == true){
          if(callbackFun != undefined && callbackFun != null){
            callbackFun(value)
          }
          if(value.Message != 'none'){
            window.success(value.Message)
          }
        }else {
          window.error(value.Message)
        }
      },error:function(err){
  
        setTimeout(()=>{
          $('#loader-4').remove()
         },1000)
  
        console.log(err)
  
        if(err.responseJSON.Message != undefined){
          window.error(err.responseJSON.Message)
        }
        if(selector != null)
        $(selector).prop('disabled',false)
  
      }
    })
  
}

window.fillMainTable = (tableSel,dataInfo,columns,hasHattons = true,hasSearch = true)=>{

  var buttons = (hasHattons) ? ['copy','excel','print'] : []
  
  var lang = (hasSearch) ? {
    "search":'بحث  ',
    "paginate":{
      'first':'الاول',
      'last':'الاخير',
      'next':'التالي',
      'previous':'السابق',
    },
    "emptyTable":'لا يوجد بيانات',
    "info":'  ',
    "infoEmpty":'لا يوجد بيانات',
    "lengthMenue":'لا يوجد بيانات',
    "bDestory":true
  }:{}
  
  var table = $(tableSel).DataTable({
  destroy:true,
  data:dataInfo,
  dom:'Bfrtip',
  buttons:buttons,
  columns:columns,
  "language":lang
  })
  
  return table
  
}

window.success = (message,autoClose='cancleAction|3000')=>{
  $.alert({
    title:'انتبه',
    content:`<p class="text-center text-success" > ${message} </p>`,
    type:'green',
    typeAnimated:true,
    rtl:true,
    autoClose:autoClose,
    closeIcon:true,
    buttons:{
      cancleAction:{
        text:'اغلاق',
        btnClass:'btn btn-success',
      }
    }
  })
}

window.error = (message,autoClose='cancleAction|3000')=>{
  $.alert({
    title:'انتبه',
    content:`<p class="text-center text-danger" > ${message} </p>`,
    type:'red',
    typeAnimated:true,
    rtl:true,
    autoClose:autoClose,
    closeIcon:true,
    buttons:{
      cancleAction:{
        text:'اغلاق',
        btnClass:'btn btn-red',
      }
    }
  })
}

window.getToken = ()=>{
 let token = localStorage.getItem('Token')
 if(token != null && token != undefined && token != ''){
  // let user = JSON.parse(token)
  return true
 }else {
  localStorage.removeItem('Token')
  return false
 }
}

window.confirm = (title='تاكيد',content='هل انت متاكد ؟',confirm=()=>{})=>{
$.confirm({
  title:title,
  content:content,
  buttons:{
    formsSubmit:{
      text:'تاكيد',
      btnClass:'btn-blue',
      action:confirm
    },
    cancle:{
      text:'الغاء',
      btnClass:'btn-red',
    }
  }
})
}

window.rowInc = []
window.newRowInc = (tableBody)=>{
  window.rowInc.push({rowCount:1,rowIncArr:[1],tableBody:tableBody})
}

window.FillSelect = (Selector,Data,Value,Name,RemoveOld = false)=>{

  if(RemoveOld){
    $(Selector).empty()
  }

  if(Array.isArray(Data) == false){
    window.error('مصفوفة فقط')
    return
  }

  if(Data != null){
    for (let i = 0; i < Data.length; i++) {
      $(Selector).append(`<option value="${Data[i][Value]}"> ${Data[i][Name]}</option>`)
    }
  }

}

$(document).on('keyup','input[type=number]',function(){
let val = `${$(this).val()}`.toLowerCase()
if(val.includes('e')){
  $(this).val('')
}
})




window.EmptyPage = () => {
    $('input').val('')
    $('select').val('0')
    $('select').change()

}


//$(document).on('click','#logout',function(){
//  localStorage.removeItem('Token')
//  window.location.href = '\login'
//})


