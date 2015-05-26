//  ready function 等价于 $.ready()
(function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})(function(){
  // 获取旋转的圆盘
  var pan = document.getElementById("pan");
  var ball = document.getElementById("ball");
  var body = document.body;
  var level = 1;  // 关卡

  var balls ,     // 获取等待弹出的球
      ballIndex , // 获取等待弹出的球索引值
      angleArr;   // 定义旋转圆盘上球的角度值，可以用于判断最后插入的球是否有碰撞，初始时已存在四个球
    // 添加事件

  function init(level){
    // 布局
    pan.innerHTML = "<li></li><li></li><li></li><li></li>";
    //ball.innerHTML = "<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>";
    ball.innerHTML = "";
    for(var i =1; i < level + 6; i++){
      var li = document.createElement('li'); 
      li.textContent = i
      ball.appendChild(li);
    }
    balls = document.querySelectorAll('#ball li');
    ballIndex = 0;
    angleArr = [0, 90, 180, 270];   
    // 重新添加事件
    body.addEventListener('click', handler);
    body.classList.remove('fail');
    body.classList.remove('success');
    pan.classList.remove('stop');
    // 启动
  }
  // 获取元素的 transform 属性的 rotate 值
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
  
  // 判断插入的球是否和已存在的球有碰撞，这里采用如果角度少于10度就判定为发生了碰撞
  function judge(angle){
    var flag = false, i= 0, len = angleArr.length;
    for(; i < len; i++){
      // 如果角度差小于13度，则说明有碰撞
      console.log(Math.abs(angle - angleArr[i]));
      if(Math.abs(angle - angleArr[i]) < 13){
        flag = true;
        break;
      }
    }
    return flag;
  }
  
  // 转化任意角度到[0,360) 范围
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
    console.log("射入的角度" + fixedAngle);
    toInsertBall.style.webkitTransform = "rotate(" + fixedAngle + "deg)";
    pan.appendChild(toInsertBall);
    if(judge(fixedAngle)){
      gameOverHandle(false);
    }
    else{
      if(document.querySelectorAll('#ball li').length <= 0){
        gameOverHandle(true);
      } 
      else{
        angleArr.push(fixedAngle);
        ballIndex++;  
      }     
    }    
  }
  //游戏结束后的处理事件, 当flag为ture时,表示游戏成功; 否则失败
  function gameOverHandle(flag){
    pan.classList.add('stop');
    body.removeEventListener('click', handler , false);
    if (flag){
      document.body.classList.add('success');
      alert('恭喜你通过了第'+ level + "关");
      init(++level)
    }
    else{
      document.body.classList.add('fail');
      alert('很抱歉你失败了！');      
      init(level)
    }
  }
  //事件处理
  function handler(){
    action(balls[ballIndex]);  
  }
  //运行
  init(level);
})