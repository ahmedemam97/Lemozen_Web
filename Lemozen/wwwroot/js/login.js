$(function(){

let tokenExist = window.getToken()
if(tokenExist){
    window.location.href = '\DailyExpenses'
    return
}

$(document).on('click','#saveBtn',function(){

    let UserName = $('#UserName').val()
    let Password = $('#Password').val()


    if(UserName == ''){
        window.error('ادخل اليوزر')
        return
    }
    if(Password == ''){
        window.error('ادخل الباسورد')
        return
    }

    let model = {
        Email:`${UserName}`,
        Password:`${Password}`,
        RememberMe:true
    }

    window.sendToserver('User/Login',model,callBack)

    function callBack(res){
        if(res.IsSuccess == true && res.Obj != null){
            console.log(res.Obj)
            localStorage.setItem('Token',JSON.stringify(res.Obj.AccesToken))
            window.location.href = '\DailyExpenses'
        }
    }


})




})