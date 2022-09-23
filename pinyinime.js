// Gecko = Netscape 7.x & Mozilla 1.4+

LastNo=0;
SPACECHAR=" "; // 空白字元。
CandChinesePart=new Array(); //侯选字，中文字部份
CandCompPart=new Array();    //侯选字, 后码部份，如“我o”里的o
AsciiStr="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"; //定义使用的编码。
AsciiStr=AsciiStr.split(',');
CodeList=CodeList.split(',');

CtrlDown=false;
CancelKey=false;
passNextKeyPress = true;
//==KeyCode 33..47
//Symbol1 = "！＂＃＄％＆＇（）＊＋，－。／";
//==KeyCode 58..64
//Symbol2 = "：；＜＝＞？＠";
//==KeyCode 91..96
//Symbol3 = "［、｝＾＿｀";
//==KeyCode 123..126
//Symbol4 = "｛｜］～";

Punct2 =  new Array('；','＝','，','－','。','／','｀');
Punct3 =  new Array('［','、','］','＇');

//==按Shift输出的符号
SPunct1 = new Array('）','！','＠','＃','＄','％','＾','＆','＊','（');
SPunct2 = new Array('：','＋','＜','＿','＞','？','～');
SPunct3 = new Array('｛','｜','｝','＂');

//==全形数字和字母
FullShape_No=new Array("０","１","２","３","４","５","６","７","８","９");
FullShape_BigAZ=new Array("Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ", "Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ");
FullShape_SmallAZ=new Array('ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ');

// 二分搜索法
function FindIn(s) {
var find=-1,low=0,mid=0,high=CodeList.length;
var sEng="";
  while(low<high){
    mid=(low+high)/2;
    mid=Math.floor(mid);
    sEng=CodeList[mid];
    if(sEng.indexOf(s,0)==0){find=mid;break;}
    sEng=CodeList[mid-1];
    if(sEng.indexOf(s,0)==0){find=mid;break;}
    if(sEng<s){low=mid+1;}else{high=mid-1;}
  }
  while(find>0){
    sEng=CodeList[find-1];
    if(sEng.indexOf(s,0)==0){find--;}else{break;}
  }
  return(find);
}

function GetStr(No, s){
  var sTmp="",sChi="";
  var i;
  for(i=0;i<=9;i++){
    if(No+i>CodeList.length-1){break;}
    sTmp=CodeList[No+i];
    if(sTmp.indexOf(s)==0){
      sChi=CodeList[No+i];
      CandCompPart[i]=sChi.substring(s.length,sChi.indexOf(SPACECHAR));
      CandChinesePart[i]=sChi.substr(sChi.lastIndexOf(SPACECHAR)+1);
      if(i<=8){IME.Cand.value+=(i+1)+"."+CandChinesePart[i]+CandCompPart[i]+'\n';}
      else{IME.Cand.value+=(0)+"."+CandChinesePart[i]+CandCompPart[i]+'\n';}
    }else{
      break;
    }
  }
  if(No>10 && CodeList[No-10].indexOf(s)==0) IME.Cand.value+='-.←\n';
  if(i==10 && No<=CodeList.length-11 && CodeList[No+i].indexOf(s)==0) IME.Cand.value+='+.→';
  LastNo=No;
}

function Grep(s){
  var No=-1;
  for(i=0;i<=9;i++){CandChinesePart[i]="";}
  if(s!=""){
    No=FindIn(s);
    if(No>=0){GetStr(No, s);}
  }

  //==自动上字
  if( IME.AutoUp.checked==true && CandChinesePart[0]!="" && CandChinesePart[1]=="" && CandCompPart[0]=="" ) {
    SendCand(0);
  }
}

// 送候选字到输入区
function SendCand(n){
  if ( n>=0 && n<=9 ) {
    SendStr(CandChinesePart[n]);
    IME.Comp.value="";
    IME.Cand.value="";
  }
}

// 设选区：暂时无用
function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}
// 设光标位置：暂时无用
function setCaretToEnd (input) {
  setSelectionRange(input, input.value.length, input.value.length);
}
function setCaretToBegin (input) {
  setSelectionRange(input, 0, 0);
}
function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}

// 送字串到输入区
function SendStr(s) {
  if (s=="") { return }

  switch (browser) {
  case 1: // IE
    var r=document.selection.createRange();
    r.text=s;
    r.select(); // 不知何故，此码可取消选区。
    break;
  case 2: // Gecko
    /*
       -simulate keypress
       *simulate scroll
       -change outputString
       -use createRange, setStart, setEnd
    */

    var obj = IME.InputArea;
    var selectionStart = obj.selectionStart;
    var selectionEnd = obj.selectionEnd;
    var oldScrollTop = obj.scrollTop;  //因Gecko不会滚到该滚的地方。
    var oldScrollHeight = obj.scrollHeight;
    var oldLen = obj.value.length;

    obj.value = obj.value.substring(0, selectionStart) + s + obj.value.substring(selectionEnd); // 这时Gecko会将scrollTop改成0
    obj.selectionStart = obj.selectionEnd = selectionStart + s.length;
    if (obj.value.length == oldLen) { // 如果用户在后面输入，就直接滚到后面。
      obj.scrollTop = obj.scrollHeight;
    } else if (obj.scrollHeight > oldScrollHeight) { // 如果TextArea增加了高度，就滚下一点点
      obj.scrollTop = oldScrollTop + obj.scrollHeight - oldScrollHeight;
    } else { // 其它情形就滚回之前的地方
      obj.scrollTop = oldScrollTop;
    }
    
    break;
  default: // 其它，就在后面加字算了
    IME.InputArea.value += s;
  }
}

// 将半形字母换成全形字母
function ToFullShapeLetter(aStr) {
  var s="";

  for (i=0;i<aStr.length;i++) {
    var c = aStr.charCodeAt(i);
    if (c>=65 && c<=90) {
      s += FullShape_BigAZ[c-65];
    } else if (c>=97 && c<=122) {
      s += FullShape_SmallAZ[c-97];
    } else {
      s += aStr.charAt(i);
    }
  }

  return s;
}

function ImeKeyDown(e) {
  var s="";
  if(!e) e=window.event;
  var key = e.which ? e.which : e.keyCode;
  CtrlDown=false;
  passNextKeyPress=false;
  
  switch (key) {
  //==Backspace
  case 8:
    if (IME.Comp.value!="") {
      s=IME.Comp.value;
      IME.Comp.value = s.substr(0, s.length-1);
      IME.Cand.value = "";
      Grep(IME.Comp.value);
      //TODO: how to cancel KeyDown in Opera 7.11? Hack it?
      CancelKey = true;
      return (false);
    }
    return (true);

  //==Tab
  case 9:
    SendStr('　');
    CancelKey = true;
    return (false); 

  //==Esc
  case 27:
    IME.Comp.value="";
    IME.Cand.value="";
    CancelKey = true;
    return (false); //Esc会把全部文字删除，故禁止 Esc键 起任何作用。

  //向前翻页
  case 109: //firfox keycode '-'
       if(browser != 2) break;
  case 189: //ie keycode '-'
       if(browser != 1 && key != 109) break;
  //==PageUp
  case 33:
  case 57383: // Opera 7.11
    s=IME.Comp.value;
    if (s!="") {
      if(LastNo>10 && CodeList[LastNo-10].indexOf(s)==0){
        IME.Cand.value="";
        GetStr(LastNo-10, s);
      }
      CancelKey = true;
      return(false);
    }
    break;
    //return(true);

  //向后翻页
  case 61: //firfox keycode '-'
       if(browser != 2) break;
  case 187: //ie keycode '-'
       if(browser != 1 && key != 61) break;
  //==PageDown
  case 34:
  case 57384: // Opera 7.11
    s=IME.Comp.value;
    if ( s!="" ){
      if(LastNo<=CodeList.length-11 && CodeList[LastNo+10].indexOf(s) == 0) {
        IME.Cand.value="";
        GetStr(LastNo+10, s);
      }
      CancelKey = true;
      return(false);
    }
    break;
    //return(true);

  //==Space
  case 32:
    if(IME.Comp.value!="") {
      //TODO: sound if nothing in Cand
      SendCand(0);
      CancelKey = true;
      return(false);
    }
    return(true);

  //==Enter
  case 13:
    if (IME.Comp.value!="") {
      SendStr( IME.FullShape.checked ? 
        ToFullShapeLetter(IME.Comp.value) : 
        IME.Comp.value);
      IME.Comp.value="";
      IME.Cand.value="";
      CancelKey = true;
      return(false);
    }
    return(true);

  //==F2
  case 113:
    IME.AutoUp.checked = !IME.AutoUp.checked;
    CancelKey = true;
    return (false);

  //==F12
  case 123:
  case 57356: // Opera 7.11
    IME.FullShape.checked = !IME.FullShape.checked;
    CancelKey = true;
    return (false);

  //==Ctrl
  case 17:
  case 57402: // Opera 7.11
    CtrlDown=true;
    break;
    
  		case 36: // home
		case 35: // end
		case 37: // left
		case 38: // up
		case 39: // right
		case 40: // down
		case 45: // insert
		case 46: // del
		case 91: // windows key
		case 112: // F1
//		case 113: // F2
		case 114: // F3
		case 115: // F4
		case 116: // F5
		case 117: // F6
		case 118: // F7
		case 119: // F8
		case 120: // F9
		case 121: // F10
		case 122: // F11
//		case 123: // F12
			// let these keys pass through unprocessed in the next keypress events
			passNextKeyPress = true;
			return (true);

  }

  if (e.ctrlKey) { return (true) };

  //==数字和符号
  if (key>=48 && key<=57) {
    if (e.shiftKey) { // 0-9????
      if (IME.FullShape.checked || !IME.EnglishMode.checked) {
        SendStr(SPunct1[key-48]);
        CancelKey = true;
        return (false);
      }
    } else { // ??
      if (IME.Comp.value=="") {
        if (IME.FullShape.checked || !IME.EnglishMode.checked) {
          SendStr(FullShape_No[key-48]);
          CancelKey = true;
          return (false);
        }
      } else {
        if (!IME.EnglishMode.checked) {
          SendCand( key==48 ? 9 : (key-49) );
          CancelKey = true;
          return (false);
        }
      }
    }
    return (true);
  }
  //==其它符号
  if (IME.FullShape.checked || !IME.EnglishMode.checked) {
    if (key>=186 && key<=192) {
      SendStr( e.shiftKey ? SPunct2[key-186] : Punct2[key-186] );
      CancelKey = true;
      return (false);
    }
    if (key>=219 && key<=222) {
      SendStr( e.shiftKey ? SPunct3[key-219] : Punct3[key-219] );
      CancelKey = true;
      return (false);
    }
  }    

  if (browser==2) {
    if (IME.FullShape.checked || !IME.EnglishMode.checked) {
      switch (key) {
      case 59: // "Gecko 之分号和冒号" 的 keyCode 是 59
        SendStr( e.shiftKey ? SPunct2[0] : Punct2[0] );
        CancelKey = true;
        return (false);
      case 61:
        SendStr( e.shiftKey ? SPunct2[1] : Punct2[1] );
        CancelKey = true;
        return (false);
      case 109:
        SendStr( e.shiftKey ? SPunct2[3] : Punct2[3] );
        CancelKey = true;
        return (false);
      }
    }
  }

  return(true);
}

function ImeKeyPress(e) {
  if(!e) e=window.event;
  var key = e.which ? e.which : e.keyCode;

	// pass keypress without processing it
	if(passNextKeyPress) {
		return (true);
	}

  // Gecko 虽不能于 OnKeyDown 取消键，但它却是在 OnKeyPress 之后才执行键的动作，故于 OnKeyPress 取消键亦无所谓。
  // 但 Opera 在 OnKeyPress 之前已执行键的动作，故仍未能取消 Backspace 等键。  
  // 为什么不连IE也在此取消多一次？即在OnKeyDown取消，在OnKeyPress再取消。因会出现一个问题：快速输入文字时，第一个字会被取消。原因未知。
  if (browser==2 || browser==3) {
    if (CancelKey) {
      CancelKey = false;
      return (false);
    }
  }

  if (e.ctrlKey) { return (true); }

  // 为何不将A-Z的处理放在OnKeyDown ? 因无从知道Caps Lock的状况。
  //==A-Z
  if ( key>=65 && key<=90 ) {
    if (IME.FullShape.checked) {
      SendStr(FullShape_BigAZ[key-65]);
      return (false);
    }
    return (true);
  }

  //==a-z
  if (key>=97 && key<=122) {
    if (IME.EnglishMode.checked) {
      if (IME.FullShape.checked) {
        SendStr( FullShape_SmallAZ[key-97] );
        return (false);
      }
      return (true);
    } else {
      s=IME.Comp.value;
      if (s.length<MAX) {
        IME.Comp.value+=AsciiStr[key-97];
        IME.Cand.value="";
        Grep(IME.Comp.value);
      }
      return (false);
    }
  }

  // Gecko 的某些键会产生两个KeyCode，如?和/，须取消其中一个，否则将一键两字
  if (browser==2) {
    switch (key) {
    case 47: case 63:
      if (!IME.EnglishMode.checked || IME.FullShape.checked) {
        return (false);
      }
      break;
    }
  }

  return (true);
}

function ImeKeyUp(e) {
  if(!e) e=window.event;
  var key = e.which ? e.which : e.keyCode;

  //==Ctrl
  if (key==17 || key==57402) {
    if (CtrlDown==true) {
      IME.EnglishMode.checked = !IME.EnglishMode.checked;
    }
  }

  return(true);
}

function BodyOnLoad() {
  browser = 
    (navigator.appName.indexOf('Microsoft') != -1) ? 1 :
    (navigator.appName.indexOf('Netscape')  != -1) ? 2 :
    (navigator.appName.indexOf('Opera')     != -1) ? 3 :
    4;
  if(browser == 2 && navigator.userAgent.indexOf('Safari') != -1) browser =
5;
  // Gecko 的JavaScript须以DOM方式表示物件，getElementById是“方便法”。IE亦通晓此法。Opera似乎亦晓得。
  IME = {
    InputArea: document.getElementById("InputArea"),
    Comp:      document.getElementById("Comp"),
    Cand:      document.getElementById("Cand"),

    EnglishMode: document.getElementById("EnglishMode"),
    FullShape:   document.getElementById("FullShape"),
    AutoUp:      document.getElementById("AutoUp")
  };
  IME.InputArea.focus();
  
}

//BETA
function LoadImeTable() {
  //CodeList.clear;
  //document.write("<SCRIPT LANGUAGE='JavaScript1.2' SRC='" + news.js + ' TYPE='text/javascript'><\/SCRIPT>");
}


