var domain = 'https://zqtrc.yun.pingan.com';

/*计算字体大小*/
function change(){
	document.documentElement.style.fontSize=20*document.documentElement.clientWidth/375+'px';
}
change();
window.addEventListener('resize',change,false);
/*if ('addEventListener' in document) {  
    document.addEventListener('DOMContentLoaded', function() {  
        FastClick.attach(document.body);  
    }, false);  
}*/
//错误提示框，一会儿就消失
function tiperror(msg){
    $('.tiperror').html(msg).show();
    setTimeout(function (){
        $('.tiperror').hide();
    }, 2000);
    return;
}
var convertToJsonObject = function(str){

    if(typeof str != 'object'){      
        return JSON.parse(str);    
    }else{
        return str;
    }
};
//错误提示框，一会儿就消失
function tiperror(msg){
    $('.tiperror').html(msg).show();
    setTimeout(function (){
        $('.tiperror').hide();
    }, 2000);
    return;
} 
function changnum(o){
    o.keyup(function(){
        if (/[^\d]/.test(o.val())) { 
          //替换非数字字符  
          var q = o.val().replace(/[^\d]/g, '');
            o.val(q);
        }
    });
};
function doublenum(num){
    var num=num+"";
    if(num.indexOf(".")!=-1){
        var len=num.substring(num.indexOf(".")+1).length;
        if(len==0){
            return num+"00"
        }else{
            if(len==1){
                return num+"0"
            }else{
                return parseFloat(num).toFixed(2)
            }
        }
    }else{
        if(num=="--"){
            return"--"
        }else{
            return num+".00"
        }
    }
};

