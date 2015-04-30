(function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})(function(){

  // 初始时已存在四个球
  var angleArr = [0, 90, 180, 270];  

  // 获取元素的transform rotate 角度值
  function getRotationOf(el){
    var style = window.getComputedStyle(el);
    if(style){
      var prop = style.getPropertyValue("-webkit-transform") || style.getPropertyValue('transform');
      prop = /matrix\((.*)\)/g.exec(prop)[1].split(',');
      //prop = Math.round(Math.atan2(prop[1], prop[0]) * (180/Math.PI));
      prop = Math.atan2(prop[1], prop[0]) * (180/Math.PI);
      return prop;
    }
  }  
  // 判断插入的球是否和已存在的球有碰撞
  function judge(angle){
    var flag = false, i= 0, len = angleArr.length;
    for(; i < len; i++){
      // 如果角度差小于5度，则说明有碰撞
      console.log(Math.abs(angle - angleArr[i]));
      if(Math.abs(angle - angleArr[i]) < 10){
        flag = true;
        break;
      }
    }
    return flag;
  }
  //转化任意角度到[0,360)范围
  function changeAngle(angle){
    var tmp = angle % 360;
    if(tmp < 0){
      tmp += 360;
    } 
    return tmp;
  }
  // 
  function action(item){
    var toInsertBall = item.cloneNode(true);
    item.parentElement.removeChild(item);
    var fixedAngle = changeAngle(90 - getRotationOf(pan));
    toInsertBall.style.webkitTransform = "rotate(" + fixedAngle + "deg)";
    pan.appendChild(toInsertBall);
    if(judge(fixedAngle)){
      pan.classList.add('stop');
      document.body.classList.add('fail');
      alert('fail');
    }
    else{
      angleArr.push(fixedAngle);
    }    
  }
  var pan = document.getElementById("pan");
  var panCss = document.defaultView.getComputedStyle(pan, null);
  var balls = document.querySelectorAll('#ball li');
  var ballLength = balls.length;
  var ballIndex = 0;
  var body = document.body;
  body.addEventListener('click', function(){
   //debugger;
    if(ballLength >=0){
      console.log(balls);
      action(balls[ballIndex])
      ballLength--;
      ballIndex++;
    }
    else{
      alert("success");
    }
  }, false)
})