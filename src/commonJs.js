export default{
    //存储 删除 cookie
    saveCookie(cookieName,cookieValue,cookieDates){
        let d = new Date();
        d.setDate(d.getDate()+cookieDates);
        document.cookie = cookieName+"="+cookieValue+";expires="+d.toGMTString()+";path=/;";
    },
    //获取cookie
    getCookie(cookieName){
        let cookieStr = unescape(document.cookie);
        let arr = cookieStr.split("; ");
        let cookieValue = "";
        for(let i=0;i<arr.length;i++){
            let temp = arr[i].split("=");
            if(temp[0]==cookieName){
                cookieValue = temp[1];
                break;
            }
        }
        return cookieValue;
    }
}