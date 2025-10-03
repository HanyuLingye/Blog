// 点击动画插件逻辑（所有页面共用）
document.addEventListener('DOMContentLoaded', function() {
  let phrases = []; // 存储词条数组

  // 核心修复：根据当前页面路径，动态调整phrases.txt的读取路径
  const currentPagePath = window.location.pathname;
  let phrasesTxtPath = '';

  // 判断当前页面位置，设置正确路径
  if (currentPagePath.includes('/pages/blog/')) {
    // 博客页（pages/blog/blog.html）：上两级到根目录
    phrasesTxtPath = '../../phrases.txt';
  } else if (currentPagePath.includes('/pages/')) {
    // 主页/关于我页（pages/index.html、pages/about.html）：上一级到根目录
    phrasesTxtPath = '../phrases.txt';
  } else {
    // 根目录页面（如根目录index.html）：直接读取
    phrasesTxtPath = 'phrases.txt';
  }

  // 用修正后的路径读取词条文件
  fetch(phrasesTxtPath) 
    .then(response => {
      if (!response.ok) {
        // 明确提示错误原因（方便排查）
        throw new Error(`找不到phrases.txt！当前页面路径：${currentPagePath}，尝试的读取路径：${phrasesTxtPath}`);
      }
      return response.text();
    })
    .then(text => {
      // 分割词条并过滤空行
      phrases = text.split('\n').filter(line => line.trim() !== '');
      console.log('动画词条加载成功！共', phrases.length, '个词条'); // 加载成功提示
    })
    .catch(error => {
      // 打印错误信息（F12控制台能看到，方便定位问题）
      console.error('点击动画加载失败：', error.message);
    });

  // 监听页面点击事件
  document.body.addEventListener('click', function(event) {
    if (phrases.length === 0) {
      console.log('暂无词条，无法触发动画（可能是phrases.txt没加载成功）');
      return;
    }

    // 随机选择一个词条
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // 创建动画元素
    const textElement = document.createElement('div');
    textElement.className = 'rise-fade'; // 应用CSS样式
    textElement.textContent = randomPhrase;
    document.body.appendChild(textElement);

    // 定位到点击位置（水平居中，垂直在点击点上方）
    textElement.style.left = (event.pageX - textElement.offsetWidth / 2) + 'px';
    textElement.style.top = (event.pageY - textElement.offsetHeight) + 'px';

    // 动画结束后移除元素（比动画时长多100ms，确保动画完成）
    setTimeout(() => {
      textElement.remove();
    }, 1100);
  });
});