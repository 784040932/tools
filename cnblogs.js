// JavaScript Document

//用于http://www.cnblogs.com/784040932/博客园调用

var pathname = window.location.pathname;










//Base64编码与解码





if (pathname==="/784040932/p/base64.html")
{
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var base64DecodeChars = new Array(
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
     52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
     -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
     15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
     -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
     41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
 
function base64encode(str) {
     var out, i, len;
     var c1, c2, c3;
 
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {
     c1 = str.charCodeAt(i++) & 0xff;
     if(i == len)
     {
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt((c1 & 0x3) << 4);
         out += "==";
         break;
     }
     c2 = str.charCodeAt(i++);
     if(i == len)
     {
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
         out += base64EncodeChars.charAt((c2 & 0xF) << 2);
         out += "=";
         break;
     }
     c3 = str.charCodeAt(i++);
     out += base64EncodeChars.charAt(c1 >> 2);
     out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
     out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
     out += base64EncodeChars.charAt(c3 & 0x3F);
     }
     return out;
}
 
function base64decode(str) {
     var c1, c2, c3, c4;
     var i, len, out;
 
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {
     /* c1 */
     do {
         c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
     } while(i < len && c1 == -1);
     if(c1 == -1)
         break;
 
     /* c2 */
     do {
         c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
     } while(i < len && c2 == -1);
     if(c2 == -1)
         break;
 
     out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
 
     /* c3 */
     do {
         c3 = str.charCodeAt(i++) & 0xff;
         if(c3 == 61)
         return out;
         c3 = base64DecodeChars[c3];
     } while(i < len && c3 == -1);
     if(c3 == -1)
         break;
 
     out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
 
     /* c4 */
     do {
         c4 = str.charCodeAt(i++) & 0xff;
         if(c4 == 61)
         return out;
         c4 = base64DecodeChars[c4];
     } while(i < len && c4 == -1);
     if(c4 == -1)
         break;
     out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
     }
     return out;
}
 
function utf16to8(str) {
     var out, i, len, c;
 
     out = "";
     len = str.length;
     for(i = 0; i < len; i++) {
     c = str.charCodeAt(i);
     if ((c >= 0x0001) && (c <= 0x007F)) {
         out += str.charAt(i);
     } else if (c > 0x07FF) {
         out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
         out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
         out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
     } else {
         out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
         out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
     }
     }
     return out;
}
 
function utf8to16(str) {
     var out, i, len, c;
     var char2, char3;
 
     out = "";
     len = str.length;
     i = 0;
     while(i < len) {
     c = str.charCodeAt(i++);
     switch(c >> 4)
     { 
       case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
         // 0xxxxxxx
         out += str.charAt(i-1);
         break;
       case 12: case 13:
         // 110x xxxx   10xx xxxx
         char2 = str.charCodeAt(i++);
         out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
         break;
       case 14:
         // 1110 xxxx  10xx xxxx  10xx xxxx
         char2 = str.charCodeAt(i++);
         char3 = str.charCodeAt(i++);
         out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
         break;
     }
     }
 
     return out;
}
 
function CharToHex(str) {
     var out, i, len, c, h;
 
     out = "";
     len = str.length;
     i = 0;
     while(i < len) 
     {
         c = str.charCodeAt(i++);
         h = c.toString(16);
         if(h.length < 2)
             h = "0" + h;
         
         out += "\\x" + h + " ";
         if(i > 0 && i % 8 == 0)
             out += "\r\n";
     }
 
     return out;
}
 
function doEncode() {
     var src = document.getElementById('src').value;
     document.getElementById('dest').value = base64encode(utf16to8(src));
}
 
function doDecode() {
     var src = document.getElementById('src').value;
     var opts = document.getElementById('opt');
 
     if(opts.checked)
     {
         document.getElementById('dest').value = CharToHex(base64decode(src));
     }
     else
     {
         document.getElementById('dest').value = utf8to16(base64decode(src));
     }
}

}










//查看当前浏览器User-Agent值





else if (pathname==="/784040932/p/ua.html")
{
	document.getElementById('userAgent').innerHTML = navigator.userAgent;
}










//URI加密/解密工具





else if (pathname==="/784040932/p/get-uri.html")
{
    function doDecode() {
	    var src = document.getElementById('src').value;
    	document.getElementById('dest').value = decodeURIComponent(src.slice(src.indexOf("=http")+1));
    }

    function doEncode() {
    	var src = document.getElementById('src').value;
    	document.getElementById('dest').value = encodeURIComponent(src);
    }
}










//字节单位换算





else if (pathname==="/784040932/p/byte2byte.html")
{
    function doCalc(flagA)
{
   Rels = new Array(1,8,8192,8388608,8589934592,8796093022208);
   for (i=0;i<Rels.length;i++)
   {
        if (i==flagA)
        {
            givenValue=document.getElementById(flagA).value.replace(",",".");
            newVal=eval(givenValue*Rels[i])
            document.getElementById("0").value=newVal;
        }
   }
   for (i=1;i<Rels.length;i++)
   {
        newVal=eval(document.getElementById("0").value/Rels[i]);
        neg=0;
        if (newVal < 0)
        {
            newVal*=-1;
            neg=1;
        }
        j=0;
        while (newVal<1 && newVal>0)
        {
               j++;
               newVal*=10;
        }
        newVal*=100000;
        newVal=Math.round(newVal);
        newVal/=100000;
        newVal/=Math.pow(10,j);
        newVal="a"+newVal;
        cache=0;
        if (newVal.indexOf("e") != -1)
        {
            cache=newVal.substr(newVal.indexOf("e"),5);
            newVal=newVal.substring(0,newVal.indexOf("e"));
        }
        dig=new Array;
        for (j=1;j<5;j++)
            dig[j]=newVal.substr(newVal.length-j-1,1);
        if (dig[1] == 9 && dig[2] == 9 && dig[3] == 9 && dig[4] == 9)
           {
                rest=newVal.substring(newVal.indexOf("."),100).length-1;
                newVal=newVal.substring(1,newVal.length-1);
                newVal="a"+eval(eval(newVal)+Math.pow(10,-rest+2));
            }
       for (j=1;j<5;j++)
             dig[j]=newVal.substr(newVal.length-j-1,1);
       if (dig[1] == 0 && dig[2] == 0 && dig[3] == 0 && dig[4] == 0)
             {
                 check=0;
                 for (j=0;j<newVal.length-5;j++)
                 {
                      if (newVal.substr(j,1)!=0)
                          check++;
                 }
                 if (check>2)
                     newVal=newVal.substring(0,newVal.length-1);
             }
        if (cache)
            newVal=newVal+cache;
        newVal=newVal.substring(1,newVal.length);
        if (neg)
            newVal*=-1;
        document.getElementById(i).value=eval(newVal);
   }
}
// end Conversion: bits and bytes
}










//RGB与16进制色互转





else if (pathname==="/784040932/p/rgba.html")
{
    var __sid = 10;
$(function(){
	var $input = $('#rgba-container input'),
		$r  = $input.eq(0),
		$g  = $input.eq(1),
		$b  = $input.eq(2),
		$a  = $input.eq(3),
		$16 = $input.eq(4),
		$v  = $('#rgba-preview-box'),
		
		pad = function(char){
			if( char.length == 1 ){
				return '0' + char;	
			}
			return char;
		};
		
		$input.on('keyup change', function(){
			if( this == $16.get(0)){
				return;
			}
			this.value = this.value.replace(/\D/g, '').substr(0, 3);
			if(this.value.length > 1){
				this.value = this.value.replace(/^0+/g, '');	
			}
			if(this.value > 255){
				this.value = this.value.substr(0, 2);
			}
			
			if(this.value !== ''){
				var arr = [];
				arr.push( pad(parseInt($r.val(), 10).toString(16) ));
				arr.push( pad(parseInt($g.val(), 10).toString(16) ));
				arr.push( pad(parseInt($b.val(), 10).toString(16) ));
				if($a.val() !== ''){
					arr.push( pad(parseInt($a.val(), 10).toString(16) ));	
				}
				$16.val('#' + arr.join('').toUpperCase());
				$v.css("background-color", $16.val().substr(0, 7));
				if( $a.val() !== ''){
					$v.css("opacity", $a.val() * 100/255/100);	
				}
			}else{
				$v.css("background-color", "transparent");
			}
			
		});
		
		$16.on('keyup change', function(){
			if(this.value == '' || this.value.charAt(0) != '#'){
				this.value = '#' + this.value;	
			}
			this.value = this.value.replace(/[^0-9a-fA-F#]/g, '').substring(0, 9);
			var val = this.value.replace(/^#/, ''), len = val.length;
			if(len == 3){
				val = val.split('');
				$r.val(parseInt(val[0], 16));
				$g.val(parseInt(val[1], 16));
				$b.val(parseInt(val[2], 16));
				$a.val('');
				$v.css("background-color", $16.val().substr(0, 7));
				if( $a.val() !== ''){
					$v.css("opacity", $a.val() * 100/255/100);	
				}
			}else if( len == 6 || len == 8 ){
				val = val.split('');
				$r.val(parseInt(val[0], 16) * 16 + parseInt(val[1], 16));
				$g.val(parseInt(val[2], 16) * 16 + parseInt(val[3], 16));
				$b.val(parseInt(val[4], 16) * 16 + parseInt(val[5], 16));	
				if( len == 8 ){
					$a.val(parseInt(val[6], 16) * 16 + parseInt(val[7], 16));	
				}else{
					$a.val('');		
				}
				$v.css("background-color", $16.val().substr(0, 7));
				if( $a.val() !== ''){
					$v.css("opacity", $a.val() * 100/255/100);	
				}
			}else{
				$a.val('');
				$v.css("background-color", "transparent");	
			}
		});
		

});
}










//厘米转像素





else if (pathname==="/784040932/p/cm2px.html")
{
    function convert(){
        var dpi = document.getElementById("DPI");
        var cm = document.getElementById("txtCM");
        var px = (parseFloat(dpi.value)/2.54)*parseFloat(cm.value);
        px = px.toFixed(3);
        document.getElementById("txtPX").value=px;
    }
}
