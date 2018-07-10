// 获取 canvas 元素，生成 canvas 上下文对象 ctx
var canvas = document.getElementById('scene');
var ctx = canvas.getContext('2d');

// 用来存放粒子对象的数组，每一个粒子都是包含粒子信息的对象
var particles = [];

// 创建图片实例，图片需要是透明背景的，png格式
var png = new Image();
png.src = './img/name1.png';
// png.crossOrigin = ''; 这里解决图片资源的跨域问题，利用 CORS
png.onload = drawScene; // 当图片装载完毕时，再执行 drawScene 函数

// 生成并渲染粒子的函数 drawScene
function drawScene() {
  // 画布一定要比图片的尺寸大，不然显示不完全
  canvas.width = png.width * 3;
  canvas.height = png.height * 3;
  ctx.drawImage(png, 0, 0); // 上屏
  var my_gradient = ctx.createLinearGradient(0, 200, 400, 0); // 创建一个渐变 (x0, y0, x1, y1)
  // 下面一系列是渐变的颜色断点
  my_gradient.addColorStop(0, 'red');
  my_gradient.addColorStop(0.3, 'orange');
  my_gradient.addColorStop(0.5, 'yellow');
  my_gradient.addColorStop(0.7, 'green');
  my_gradient.addColorStop(0.9, 'blue');
  my_gradient.addColorStop(1, 'purple');
  ctx.fillStyle = my_gradient; // 将上面的渐变色作为笔刷

  // 获取图片的元信息
  var data = ctx.getImageData(0, 0, png.width, png.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 先清屏一次
  for(var y=0, y2=data.height; y<y2; y++) {
    for(var x=0, x2=data.width; x<x2; x++) {
      var p = y * 4 * data.width + x * 4;
      if(data.data[p + 3] > 129) {
        // 遍历出的每一个像素点都是一个粒子对象
        var particle = {
          x0: x,
          y0: y,
          x1: png.width / 2,
          y1: png.height / 2,
          speed: Math.random() * 4 + 2,
          color: `rgb(${data.data[p]}, ${data.data[p+1]}, ${data.data[p+2]})`
        };
        // TweenMax 动画
        TweenMax.to(particle, particle.speed, {
          x1: particle.x0,
          y1: particle.y0,
          delay: y / 30,
          ease: Elastic.easeOut
        });
        // 将生成的每一个粒子对象，都存放在保存粒子的数组中去
        particles.push(particle);
      }
    }
  }
  // 每次绘制之前，先执行 render
  requestAnimationFrame(render);
}

// 清画布，粒子上屏
var render = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=0, j=particles.length; i<j; i++) {
    var particle = particles[i];
    // ctx.fillStyle = particle.color; // 如果想用图片原来的颜色
    ctx.fillRect(particle.x1 * 3, particle.y1 * 3, 2, 2);
  }
  requestAnimationFrame(render);
};

// 清空画布，重新执行绘制函数 drawScene
var clearFrame = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];
  drawScene();
}