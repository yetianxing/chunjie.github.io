 

function ChineseCalendar(dateObj){
    this.dateObj = (dateObj != undefined) ? dateObj : new Date();
    this.SY = this.dateObj.getFullYear();
    this.SM = this.dateObj.getMonth();
    this.SD = this.dateObj.getDate();
        this.lunarInfo = [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
            0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
            0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
            0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
            0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
            0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
            0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
            0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
            0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
            0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
            0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
            0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
            0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
            0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
            0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
            0x14b63];

    //传回农历 y年闰哪个月 1-12 , 没闰传回 0
    this.leapMonth = function(y){
        return this.lunarInfo[y - 1900] & 0xf;
    };
    //传回农历 y年m月的总天数
    this.monthDays = function(y, m){
        return (this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
    };
    //传回农历 y年闰月的天数
    this.leapDays = function(y){
        if (this.leapMonth(y)) {
            return (this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
        }
        else {
            return 0;
        }
    };
    //传回农历 y年的总天数
    this.lYearDays = function(y){
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
        }
        return sum + this.leapDays(y);
    };
    //算出农历, 传入日期对象, 传回农历日期对象
    //该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
    this.Lunar = function(dateObj){
        var i, leap = 0, temp = 0, lunarObj = {};
        var baseDate = new Date(1900, 0, 31);
        var offset = (dateObj - baseDate) / 86400000;
        lunarObj.dayCyl = offset + 40;
        lunarObj.monCyl = 14;
        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = this.lYearDays(i);
            offset -= temp;
            lunarObj.monCyl += 12;
        }
        if (offset < 0) {
            offset += temp;
            i--;
            lunarObj.monCyl -= 12;
        }
       
        lunarObj.year = i;
        lunarObj.yearCyl = i - 1864;
        leap = this.leapMonth(i);
        lunarObj.isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i == (leap + 1) && lunarObj.isLeap == false) {
                --i;
                lunarObj.isLeap = true;
                temp = this.leapDays(lunarObj.year);
            }
            else {
                temp = this.monthDays(lunarObj.year, i)
            }
            if (lunarObj.isLeap == true && i == (leap + 1)) {
                lunarObj.isLeap = false;
            }
            offset -= temp;
            if (lunarObj.isLeap == false) {
                lunarObj.monCyl++;
            }
        }
       
        if (offset == 0 && leap > 0 && i == leap + 1) {
            if (lunarObj.isLeap) {
                lunarObj.isLeap = false;
            }
            else {
                lunarObj.isLeap = true;
                --i;
                --lunarObj.monCyl;
            }
        }
       
        if (offset < 0) {
            offset += temp;
            --i;
            --lunarObj.monCyl
        }
        lunarObj.month = i;
        lunarObj.day = offset + 1;
        return lunarObj;
    };
    //中文日期
    this.cDay = function(m, d){
        var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        var nStr2 = ['初', '十', '廿', '卅', '　'];
        var s;
        if (m > 10) {
            s = '十' + nStr1[m - 10];
        }
        else {
            s = nStr1[m];
        }
        s += '月';
        switch (d) {
            case 10:
                s += '初十';
                break;
            case 20:
                s += '二十';
                break;
            case 30:
                s += '三十';
                break;
            default:
                s += nStr2[Math.floor(d / 10)];
                s += nStr1[d % 10];
        }
        return s;
    };
    this.solarDay2 = function(){ 
        var sDObj = new Date(this.SY, this.SM, this.SD);
        var lDObj = this.Lunar(sDObj);
        var tt = '农历' + this.cDay(lDObj.month, lDObj.day);
        lDObj = null;
        return tt;
    };
    this.weekday = function(){
        var day = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return day[this.dateObj.getDay()];
    };
    this.YYMMDD = function(){
        var dateArr = [this.SY, '年', this.SM + 1, '月', this.SD, '日'];
        return dateArr.join('');
    }
} 

function GetcDateString(year,month,day) {
	var CalendarData = new Array(100);
	var madd = new Array(12);
	var tgString = "甲乙丙丁戊己庚辛壬癸";
	var dzString = "子丑寅卯辰巳午未申酉戌亥";
	var numString = "一二三四五六七八九十";
	var monString = "正二三四五六七八九十冬腊";
	var weekString = "日一二三四五六";
	var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
		
    var tmp = "";
    tmp += tgString.charAt((year - 4) % 10);
    tmp += dzString.charAt((year - 4) % 12);
    tmp += "(";
    tmp += sx.charAt((year - 4) % 12);
    tmp += ")年 ";
    if (month < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-month - 1);
    } else {
        tmp += monString.charAt(month - 1);
    }
    tmp += "月";
    tmp += (day < 11) ? "初" : ((day < 20) ? "十" : ((day < 30) ? "廿" : "三十"));
    if (day % 10 != 0 || day == 10) {
        tmp += numString.charAt((day - 1) % 10);
    }
    return tmp;
}

function GetLunarDay() {
     var date = new ChineseCalendar();
	   var lDObj = date.Lunar(new Date());
	 return GetcDateString(lDObj.year,lDObj.month, lDObj.day)+" "+date.weekday();
}


//所有节假日
function getjiejiari(mm,ri) {
    // let mm = 6;
    // let ri = 12;
    if(mm<10){
        mm="0"+mm;
    }
    if(ri<10){
        ri="0"+ri;
    }
    let mr=mm+"-"+ri;

    let mp = {
        "01-01": { "holiday": true, "name": "元旦", "wage": 3, "date": "2021-01-01" },
        "01-02": { "holiday": true, "name": "元旦", "wage": 2, "date": "2021-01-02" },
        "01-03": { "holiday": true, "name": "元旦", "wage": 2, "date": "2021-01-03" },
        "02-07": {
            "holiday": false, "name": "春节前调休",
            "after": false, "wage": 1, "target": "春节", "date": "2021-02-07"
        },
        "02-11": { "holiday": true, "name": "除夕", "wage": 2, "date": "2021-02-11" },
        "02-12": { "holiday": true, "name": "初一", "wage": 3, "date": "2021-02-12" },
        "02-13": { "holiday": true, "name": "初二", "wage": 3, "date": "2021-02-13" },
        "02-14": { "holiday": true, "name": "初三", "wage": 3, "date": "2021-02-14" },
        "02-15": { "holiday": true, "name": "初四", "wage": 2, "date": "2021-02-15" },
        "02-16": { "holiday": true, "name": "初五", "wage": 2, "date": "2021-02-16" },
        "02-17": { "holiday": true, "name": "初六", "wage": 2, "date": "2021-02-17" },
        "02-20": {
            "holiday": false, "name": "春节后调休", "after": true,
            "wage": 1, "target": "春节", "date": "2021-02-20"
        },
        "04-03": { "holiday": true, "name": "清明节", "wage": 2, "date": "2021-04-03" },
        "04-04": { "holiday": true, "name": "清明节", "wage": 3, "date": "2021-04-04" },
        "04-05": { "holiday": true, "name": "清明节", "wage": 2, "date": "2021-04-05" },
        "04-25": {
            "holiday": false, "name": "劳动节前调休", "after": false, "wage": 1,
            "target": "劳动节", "date": "2021-04-25"
        },
        "05-01": {
            "holiday": true, "name": "劳动节",
            "wage": 3, "date": "2021-05-01"
        },
        "05-02": { "holiday": true, "name": "劳动节", "wage": 2, "date": "2021-05-02" },
        "05-03": { "holiday": true, "name": "劳动节", "wage": 2, "date": "2021-05-03" },
        "05-04": { "holiday": true, "name": "劳动节", "wage": 2, "date": "2021-05-04" },
        "05-05": { "holiday": true, "name": "劳动节", "wage": 2, "date": "2021-05-05" },
        "05-08": {
            "holiday": false, "name": "劳动节后调休", "after": true, "wage": 1,
            "target": "劳动节", "date": "2021-05-08"
        },
        "06-12": {
            "holiday": true, "name": "端午节", "wage": 2, "date": "2021-06-12",
            "rest": 1
        },
        "06-13": { "holiday": true, "name": "端午节", "wage": 2, "date": "2021-06-13", "rest": 1 },
        "06-14": { "holiday": true, "name": "端午节", "wage": 3, "date": "2021-06-14", "rest": 1 },
        "09-18": {
            "holiday": false, "after": false, "name": "中秋节前调休", "wage": 1, "target":
                "中秋节", "date": "2021-09-18"
        },
        "09-19": { "holiday": true, "name": "中秋节", "wage": 2, "date": "2021-09-19" },
        "09-20": { "holiday": true, "name": "中秋节", "wage": 2, "date": "2021-09-20" },
        "09-21": { "holiday": true, "name": "中秋节", "wage": 3, "date": "2021-09-21" },
        "09-26": {
            "holiday": false, "after": false, "name": "国庆节前调休", "wage": 1,
            "target": "国庆节", "date": "2021-09-26"
        },
        "10-01": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2021-10-01" },
        "10-02": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2021-10-02" },
        "10-03": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2021-10-03" },
        "10-04": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2021-10-04" },
        "10-05": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2021-10-05" },
        "10-06": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2021-10-06" },
        "10-07": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2021-10-07" },
        "10-09": {
            "holiday": false, "name": "国庆节后调休", "after": true, "wage": 1,
            "target": "国庆节", "date": "2021-10-09"
        }
    };

    for (var item in mp) { 
        if(item==mr){
           let str= mp[item];
           console.log(str);
           return str['name']
        }
    }
    return '';

}

//end 是除夕 2023-01-21 00:00:00
function dateDifference( end) { 
    // //比较2个日期 
    // console.log(start + ",," + end);
    // var stime = new Date(start).getTime();
    var stime = new Date().getTime();
    console.log(end.replace(/-/g, "/"));
    var etime = new Date(end.replace(/-/g, "/")).getTime();
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
  
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    var miao= (Math.abs(etime - stime)/1000)%60;//秒
    miao=Math.ceil(miao);
 

    if (days == 0 && hours == 0) {
      return minutes + "分"+miao+'秒';
    }
    if (days == 0) {
      return hours + "时" + minutes + "分"+miao+'秒';
    }
    var time = days + "天" + hours + "时" + minutes + "分"+miao+'&nbsp;秒';
    // var time = days;
    return time;
  }

  console.log(dateDifference('2023-01-21 00:00:00'));
