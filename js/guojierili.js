var myDate = new Date();
var year = myDate.getFullYear();   //获取完整的年份(4位,1970-????)
var month = myDate.getMonth() + 1;      //获取当前月份(0-11,0代表1月)
var day = myDate.getDate();       //获取当前日(1-31)
 
//自定义的时间计算
function daojishi() {
    var nl = GetLunarDay(year, month, day);
    nl = nl.substring(7, nl.length);//辛丑(牛)年 五月初四
    var jiaqi = getjiejiari(month, day);

   
    if(jiaqi.indexOf('端午')!=-1){
        document.body.style.background = "url(./bktu/duanwu.jpg)";
        document.body.style.color = "#007947";
    }
    if(jiaqi.indexOf('国庆')!=-1){
        document.body.style.background = "url(./bktu/guoqin.jpg)";  
        document.body.style.color = "white";
    }
    if(jiaqi.indexOf('中秋')!=-1){
        document.body.style.background = "url(./bktu/zhongqiu.jpg)";  
        document.body.style.color = "white";
    }
    setTimeout(() => {
        document.body.style.backgroundSize = "cover";
    }, 10);

    var tempstr = year + "年" + month + "月" + day + "日&nbsp;&nbsp;农历" + nl + "&nbsp;&nbsp;" + jiaqi;
    document.getElementById("jintian").innerHTML = tempstr;


    setInterval(function () { 
        let juli = dateDifference('2023-01-21 00:00:00');
        let aa = juli.substring(0, juli.indexOf('分') + 1);
        let bb = juli.substring(juli.indexOf('分') + 1, juli.indexOf('秒'));
        let tempmiao = "<span class='my-face'>" + bb + "</span>";
        document.getElementById("juli").innerHTML = aa + tempmiao + "秒";
    }, 1000 - 100)
}


daojishi();