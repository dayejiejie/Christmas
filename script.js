// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 雪花效果
function createSnow() {
    const snow = document.querySelector('.snow');
    const snowflakes = Array(50).fill().map((_, index) => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            filter: blur(1px);
            animation: snowfall ${Math.random() * 3 + 2}s linear infinite;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            transform: scale(${Math.random()});
        `;
        return snowflake;
    });

    snowflakes.forEach(snowflake => snow.appendChild(snowflake));
}

// 添加雪花动画
const style = document.createElement('style');
style.textContent = `
    @keyframes snowfall {
        0% {
            transform: translateY(-10vh) translateX(0);
        }
        100% {
            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(style);

// 创建对话气泡
function createDialogBubbles() {
    const leftBubble = document.createElement('div');
    leftBubble.className = 'speech-bubble left';
    document.body.appendChild(leftBubble);

    const rightBubble = document.createElement('div');
    rightBubble.className = 'speech-bubble right';
    document.body.appendChild(rightBubble);

    return { leftBubble, rightBubble };
}

// 显示对话气泡
function showBubble(bubble, text, position, index) {
    const avatar = document.querySelector(position === 'left' ? '.avatar-left' : '.avatar-right');
    const rect = avatar.getBoundingClientRect();
    
    bubble.textContent = text;
    if (position === 'left') {
        bubble.style.left = `${rect.left}px`;
    } else {
        // 右侧气泡位置调整，根据对话序号调整位置
        if (index === 1) { // 第二次对话
            bubble.style.left = `${rect.right - 10}px`; // 往左移动一点
        } else if (index === 3) { // 第四次对话
            bubble.style.left = `${rect.right - 10}px`; // 往左移动更多
        }
    }
    bubble.style.top = `${rect.top}px`;
    bubble.classList.add('show');

    return new Promise(resolve => {
        setTimeout(() => {
            bubble.classList.remove('show');
            setTimeout(resolve, 300); // 等待淡出动画完成
        }, 4000);
    });
}

// 播放对话序列
async function playDialogSequence(leftBubble, rightBubble) {
    const dialogs = [
        { bubble: leftBubble, text: 'lcc，我的圣诞礼物呢？', position: 'left', index: 0 },
        { bubble: rightBubble, text: '我....我...那你给我准备了吗？', position: 'right', index: 1 },
        { bubble: leftBubble, text: '我......哎呀.......', position: 'left', index: 2 },
        { bubble: rightBubble, text: '.......', position: 'right', index: 3 }
    ];

    for (const dialog of dialogs) {
        await showBubble(dialog.bubble, dialog.text, dialog.position, dialog.index);
    }

    // 对话结束后，等待1秒再滚动
    setTimeout(() => {
        document.querySelector('#story').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 1000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    createSnow();
    createStaticChristmasTree();
    
    const { leftBubble, rightBubble } = createDialogBubbles();
    
    // 添加信封点击事件
    const openButton = document.querySelector('.open-button');
    const envelope = document.querySelector('.envelope');
    
    openButton.addEventListener('click', function(e) {
        e.stopPropagation();
        envelope.classList.toggle('open');
        
        if (envelope.classList.contains('open')) {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3');
            audio.volume = 0.5;
            audio.play();
            
            // 等待信封打开动画完成后开始对话
            setTimeout(() => {
                playDialogSequence(leftBubble, rightBubble);
            }, 1000);
        }
    });

    // 礼物准备和消息提交的逻辑
    const prepareGiftBtn = document.querySelector('.prepare-gift-btn');
    const messageContainer = document.querySelector('.message-input-container');
    const submitMessageBtn = document.querySelector('.submit-message-btn');
    const messageInput = document.querySelector('.message-input');

    // 点击准备礼物按钮
    prepareGiftBtn.addEventListener('click', function() {
        messageContainer.style.display = 'flex';
        messageContainer.classList.add('show');
        messageInput.focus();
    });

    // 提交消息
    submitMessageBtn.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            // 构建mailto链接
            const subject = encodeURIComponent('来自圣诞节网站的消息');
            const body = encodeURIComponent(message);
            const mailtoLink = `mailto:2465335064@qq.com?subject=${subject}&body=${body}`;
            
            // 打开默认邮件客户端
            window.location.href = mailtoLink;
            
            // 清理输入框并隐藏
            messageInput.value = '';
            messageContainer.classList.remove('show');
            
            // 显示成功提示
            alert('邮件客户端已打开，请确认发送！');
            
            // 等待提示框关闭后
            setTimeout(() => {
                // 隐藏消息输入框
                messageContainer.style.display = 'none';
                
                // 平滑滚动到"其实我很爱你"部分
                document.querySelector('#gallery').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        } else {
            alert('请输入想说的话');
        }
    });

    // 监听回车键提交
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessageBtn.click();
        }
    });
});

// 创建静态圣诞树
function createStaticChristmasTree() {
    const treeContainer = document.querySelector('.static-christmas-tree');
    
    // 创建树干
    const trunk = document.createElement('div');
    trunk.className = 'tree-trunk';
    trunk.innerHTML = '<div class="tree-trunk-texture"></div>';
    treeContainer.appendChild(trunk);
    
    // 创建5层树冠
    for (let i = 0; i < 5; i++) {
        const layer = document.createElement('div');
        layer.className = `tree-layer layer-${i + 1}`;
        layer.style.animation = `treeLayerAppear 0.5s ease forwards ${i * 0.2}s`;
        
        // 为每层添加雪花装饰
        for (let j = 0; j < 5; j++) {
            const snow = document.createElement('div');
            snow.className = 'tree-snow';
            snow.style.left = `${j * 25}%`;
            snow.style.animationDelay = `${j * 0.2}s`;
            layer.appendChild(snow);
        }
        
        treeContainer.appendChild(layer);
    }
    
    // 创建星星
    const star = document.createElement('div');
    star.className = 'tree-star';
    star.innerHTML = `
        <div class="star-center"></div>
        ${Array(5).fill().map((_, i) => `
            <div class="star-point" style="transform: rotate(${i * 72}deg)"></div>
        `).join('')}
    `;
    treeContainer.appendChild(star);
    
    // 添加装饰球
    const decorationColors = ['#ff0000', '#ffd700', '#ff69b4', '#4169e1', '#32cd32'];
    const decorationPositions = [
        // 第一层
        {top: '10%', left: '45%', size: '15px', delay: '0.2s'},
        {top: '20%', left: '35%', size: '12px', delay: '0.3s'},
        {top: '20%', left: '55%', size: '12px', delay: '0.4s'},
        // 第二层
        {top: '35%', left: '30%', size: '14px', delay: '0.5s'},
        {top: '35%', left: '50%', size: '16px', delay: '0.6s'},
        {top: '35%', left: '70%', size: '14px', delay: '0.7s'},
        // 第三层
        {top: '50%', left: '25%', size: '13px', delay: '0.8s'},
        {top: '50%', left: '45%', size: '15px', delay: '0.9s'},
        {top: '50%', left: '65%', size: '13px', delay: '1.0s'},
        // 第四层
        {top: '65%', left: '20%', size: '14px', delay: '1.1s'},
        {top: '65%', left: '40%', size: '16px', delay: '1.2s'},
        {top: '65%', left: '60%', size: '14px', delay: '1.3s'},
        {top: '65%', left: '80%', size: '12px', delay: '1.4s'},
        // 第五层
        {top: '80%', left: '15%', size: '15px', delay: '1.5s'},
        {top: '80%', left: '35%', size: '13px', delay: '1.6s'},
        {top: '80%', left: '55%', size: '15px', delay: '1.7s'},
        {top: '80%', left: '75%', size: '13px', delay: '1.8s'},
    ];
    
    decorationPositions.forEach((pos, index) => {
        const decoration = document.createElement('div');
        decoration.className = 'tree-decoration';
        decoration.style.cssText = `
            top: ${pos.top};
            left: ${pos.left};
            width: ${pos.size};
            height: ${pos.size};
            background: ${decorationColors[index % decorationColors.length]};
            animation: decorationAppear 0.5s ease forwards ${pos.delay};
        `;
        
        // 添加装饰球的光泽效果
        const shine = document.createElement('div');
        shine.className = 'decoration-shine';
        decoration.appendChild(shine);
        
        treeContainer.appendChild(decoration);
    });
    
    // 添加彩灯
    for (let i = 0; i < 30; i++) {
        const light = document.createElement('div');
        light.className = 'tree-light';
        light.style.cssText = `
            top: ${Math.random() * 90}%;
            left: ${Math.random() * 90}%;
            animation: lightTwinkle 1s ease-in-out infinite ${Math.random()}s;
        `;
        treeContainer.appendChild(light);
    }
    
    // 触发动画
    requestAnimationFrame(() => {
        treeContainer.classList.add('active');
    });
}

// 表单提交处理
document.querySelector('.rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 这里可以添加表单提交的逻辑
    alert('感谢您的回复！我们期待与您相见。');
    this.reset();
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    navbar.style.background = 'transparent';
});

// 图片加载动画
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});

// 爱心轨迹动画
function calculateHeartPosition(progress, side) {
    // 爱心曲线在progress为0.8时完成
    if (progress <= 0.8) {
        // 将0-0.8的进度映射到0-1
        const heartProgress = progress / 0.8;
        const t = heartProgress * Math.PI;
        let x, y;
        
        if (side === 'left') {
            // 左半边爱心
            x = 16 * Math.pow(Math.sin(t), 3);
            y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            x = x * -1; // 左边需要镜像
        } else {
            // 右半边爱心
            x = 16 * Math.pow(Math.sin(t), 3);
            y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        }
        
        const scale = 3;
        return {
            x: x * scale,
            y: y * scale
        };
    } else {
        // 爱心完成后的延续运动
        const extraProgress = (progress - 0.8) / 0.2; // 0.8-1.0映射到0-1
        const lastHeartPos = calculateHeartPosition(0.8, side);
        
        if (side === 'left') {
            // 左边头像向右下运动
            return {
                x: lastHeartPos.x + (extraProgress * 150), // 改为150px
                y: lastHeartPos.y + (extraProgress * 80)  // 保持垂直距离不变
            };
        } else {
            // 右边头像向左下运动
            return {
                x: lastHeartPos.x - (extraProgress * 150), // 改为150px
                y: lastHeartPos.y + (extraProgress * 80)  // 保持垂直距离不变
            };
        }
    }
}

// 创建轨迹效果
function createTrail(x, y, side, dx, dy) {
    // 创建爱心轨迹
    const heart = document.createElement('div');
    heart.className = 'collision-heart';
    heart.style.left = `${x - 10}px`;  // 调整位置使爱心跟随轨迹
    heart.style.top = `${y - 10}px`;
    heart.style.width = '20px';  // 轨迹上的爱心要小一些
    heart.style.height = '20px';
    heart.style.opacity = '0.6';
    document.body.appendChild(heart);
    
    // 立即显示爱心
    requestAnimationFrame(() => {
        heart.classList.add('active');
    });
    
    // 短暂显示后移除
    setTimeout(() => {
        heart.remove();
    }, 500);
}

// 创建碰撞特效
function createCollisionEffects(x, y) {
    // 创建大爱心
    const heart = document.createElement('div');
    heart.className = 'collision-heart final';
    heart.style.left = `${x - 50}px`;
    heart.style.top = `${y - 50}px`;
    document.body.appendChild(heart);
    
    // 创建圣诞树容器
    const treeContainer = document.createElement('div');
    treeContainer.className = 'christmas-tree';
    treeContainer.style.left = `${x - 150}px`;
    treeContainer.style.top = `${y - 300}px`;
    
    // 创建树干
    const trunk = document.createElement('div');
    trunk.className = 'tree-trunk';
    trunk.innerHTML = '<div class="tree-trunk-texture"></div>';
    treeContainer.appendChild(trunk);
    
    // 创建5层树冠，每层都有不同的大小和装饰
    for (let i = 0; i < 5; i++) {
        const layer = document.createElement('div');
        layer.className = `tree-layer layer-${i + 1}`;
        layer.style.animation = `treeLayerAppear 0.5s ease forwards ${i * 0.2}s`;
        
        // 为每层添加雪花装饰
        for (let j = 0; j < 5; j++) {
            const snow = document.createElement('div');
            snow.className = 'tree-snow';
            snow.style.left = `${j * 25}%`;
            snow.style.animationDelay = `${j * 0.2}s`;
            layer.appendChild(snow);
        }
        
        treeContainer.appendChild(layer);
    }
    
    // 创建星星
    const star = document.createElement('div');
    star.className = 'tree-star';
    star.innerHTML = `
        <div class="star-center"></div>
        ${Array(5).fill().map((_, i) => `
            <div class="star-point" style="transform: rotate(${i * 72}deg)"></div>
        `).join('')}
    `;
    treeContainer.appendChild(star);
    
    // 添加装饰球
    const decorationColors = ['#ff0000', '#ffd700', '#ff69b4', '#4169e1', '#32cd32'];
    const decorationPositions = [
        // 第一层
        {top: '10%', left: '45%', size: '15px', delay: '0.2s'},
        {top: '20%', left: '35%', size: '12px', delay: '0.3s'},
        {top: '20%', left: '55%', size: '12px', delay: '0.4s'},
        // 第二层
        {top: '35%', left: '30%', size: '14px', delay: '0.5s'},
        {top: '35%', left: '50%', size: '16px', delay: '0.6s'},
        {top: '35%', left: '70%', size: '14px', delay: '0.7s'},
        // 第三层
        {top: '50%', left: '25%', size: '13px', delay: '0.8s'},
        {top: '50%', left: '45%', size: '15px', delay: '0.9s'},
        {top: '50%', left: '65%', size: '13px', delay: '1.0s'},
        // 第四层
        {top: '65%', left: '20%', size: '14px', delay: '1.1s'},
        {top: '65%', left: '40%', size: '16px', delay: '1.2s'},
        {top: '65%', left: '60%', size: '14px', delay: '1.3s'},
        {top: '65%', left: '80%', size: '12px', delay: '1.4s'},
        // 第五层
        {top: '80%', left: '15%', size: '15px', delay: '1.5s'},
        {top: '80%', left: '35%', size: '13px', delay: '1.6s'},
        {top: '80%', left: '55%', size: '15px', delay: '1.7s'},
        {top: '80%', left: '75%', size: '13px', delay: '1.8s'},
    ];
    
    decorationPositions.forEach((pos, index) => {
        const decoration = document.createElement('div');
        decoration.className = 'tree-decoration';
        decoration.style.cssText = `
            top: ${pos.top};
            left: ${pos.left};
            width: ${pos.size};
            height: ${pos.size};
            background: ${decorationColors[index % decorationColors.length]};
            animation: decorationAppear 0.5s ease forwards ${pos.delay};
        `;
        
        // 添加装饰球的光泽效果
        const shine = document.createElement('div');
        shine.className = 'decoration-shine';
        decoration.appendChild(shine);
        
        treeContainer.appendChild(decoration);
    });
    
    // 添加彩灯
    for (let i = 0; i < 30; i++) {
        const light = document.createElement('div');
        light.className = 'tree-light';
        light.style.cssText = `
            top: ${Math.random() * 90}%;
            left: ${Math.random() * 90}%;
            animation: lightTwinkle 1s ease-in-out infinite ${Math.random()}s;
        `;
        treeContainer.appendChild(light);
    }
    
    document.body.appendChild(treeContainer);
    
    // 触发动画
    requestAnimationFrame(() => {
        heart.classList.add('active');
        treeContainer.classList.add('active');
    });
}

// 添加一个标志来追踪动画是否已经触发
let animationTriggered = false;

// 监听滚动事件
window.addEventListener('scroll', function() {
    const storySection = document.querySelector('.story-section');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection.offsetHeight;
    const scrollProgress = window.scrollY / heroHeight;
    const progress = Math.min(Math.max(scrollProgress * 2.4, 0), 1);
    
    // 检查是否滚动到了故事部分
    const storySectionRect = storySection.getBoundingClientRect();
    const isStoryVisible = storySectionRect.top <= window.innerHeight / 2;
    
    // 如果滚动到了故事部分且动画还未触发
    if (isStoryVisible && !animationTriggered) {
        animationTriggered = true;
        activateGrayEffects();
    }
    
    const leftAvatar = document.querySelector('.avatar-left');
    const rightAvatar = document.querySelector('.avatar-right');
    
    // 爱心轨迹动画从一开始就执行，不需要等到故事部分可见
    if (progress > 0) {
        const leftPos = calculateHeartPosition(progress, 'left');
        const rightPos = calculateHeartPosition(progress, 'right');
        
        // 计算移动位置
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // 保存上一帧的位置
        const lastLeftPos = leftAvatar._lastPos || leftPos;
        const lastRightPos = rightAvatar._lastPos || rightPos;
        
        // 计算移动方向
        const leftDx = leftPos.x - lastLeftPos.x;
        const leftDy = leftPos.y - lastLeftPos.y;
        const rightDx = rightPos.x - lastRightPos.x;
        const rightDy = rightPos.y - lastRightPos.y;
        
        // 只有在开始滚动后才移动位置
        if (progress > 0.1) {
            leftAvatar.style.transform = `translate(${leftPos.x}px, ${leftPos.y}px)`;
            rightAvatar.style.transform = `translate(${rightPos.x}px, ${rightPos.y}px)`;
            
            // 创建轨迹
            createTrail(centerX + leftPos.x + 30, centerY + leftPos.y + 30, 'left', leftDx, leftDy);
            createTrail(centerX + rightPos.x + 30, centerY + rightPos.y + 30, 'right', rightDx, rightDy);
            
            // 检测碰撞，只在进度接近结束时触发
            if (progress > 0.95) {
                const distance = Math.sqrt(
                    Math.pow(rightPos.x - leftPos.x, 2) + 
                    Math.pow(rightPos.y - leftPos.y, 2)
                );
                
                // 当距离小于一定值时触发特效，并且只触发一次
                if (distance < 20 && !leftAvatar._collided) {
                    leftAvatar._collided = true;
                    createCollisionEffects(
                        centerX + (leftPos.x + rightPos.x) / 2 + 30,
                        centerY + (leftPos.y + rightPos.y) / 2 + 30
                    );
                }
            }
            
            // 保存当前位置
            leftAvatar._lastPos = leftPos;
            rightAvatar._lastPos = rightPos;
        }
    } else {
        // 重置到初始位置
        leftAvatar.style.transform = 'none';
        rightAvatar.style.transform = 'none';
        leftAvatar._lastPos = null;
        rightAvatar._lastPos = null;
        leftAvatar._collided = false;
    }
});

// 在页面加载时创建灰色遮罩和雨滴容器，但不要立即激活
const grayOverlay = document.createElement('div');
grayOverlay.className = 'gray-overlay';
document.body.appendChild(grayOverlay);

const rainContainer = document.createElement('div');
rainContainer.className = 'rain';
document.body.appendChild(rainContainer);

// 修改activateGrayEffects函数
function activateGrayEffects() {
    // 添加灰色遮罩
    const overlay = document.querySelector('.gray-overlay');
    overlay.classList.add('active');

    // 添加雨滴效果
    const rain = document.querySelector('.rain');
    rain.classList.add('active');
    createRaindrops();

    // 爱心变灰并开始交互
    setTimeout(() => {
        onHeartTurnGray();
    }, 1000);
}

// 移除在页面加载时立即调用activateGrayEffects的代码
document.addEventListener('DOMContentLoaded', () => {
    createSnow();
    createStaticChristmasTree();
});

function showHeartMessage(message, duration) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'heart-message';
    messageDiv.textContent = message;
    document.querySelector('.breakup-animation').appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 500);
    }, duration);
}

function initHeartInteraction() {
    const heart = document.querySelector('.broken-heart');
    let clickCount = 0;
    const maxClicks = 5;
    let isAnimating = false;

    // 显示第一条消息
    setTimeout(() => {
        showHeartMessage('难道....这个圣诞节...', 4000);
        
        // 显示第二条消息
        setTimeout(() => {
            showHeartMessage('不！我应该要用心告诉他！', 4000);
            
            // 添加发光效果并显示提示
            setTimeout(() => {
                heart.classList.add('glow');
                showHeartMessage('点击爱心重燃希望', 2000);
                
                // 添加点击事件
                heart.addEventListener('click', function() {
                    if (isAnimating) return;
                    isAnimating = true;

                    // 添加点击波动效果
                    heart.classList.add('pulse');
                    
                    clickCount++;
                    const progress = clickCount / maxClicks;
                    const red = Math.floor(128 + (255 - 128) * progress);
                    const gray = Math.floor(128 * (1 - progress));
                    
                    // 更新颜色和发光效果
                    const newColor = `linear-gradient(135deg, 
                        rgb(${red}, ${gray}, ${gray}) 0%, 
                        rgb(${Math.floor(red * 0.8)}, ${Math.floor(gray * 0.8)}, ${Math.floor(gray * 0.8)}) 100%)`;
                    const newShadow = `0 0 ${15 + progress * 20}px rgba(${red}, ${gray}, ${gray}, 0.8)`;
                    
                    heart.querySelectorAll('::before, ::after').forEach(el => {
                        el.style.background = newColor;
                        el.style.boxShadow = newShadow;
                    });
                    
                    // 动画结束后移除pulse类
                    setTimeout(() => {
                        heart.classList.remove('pulse');
                        isAnimating = false;
                    }, 500);
                    
                    if (clickCount >= maxClicks) {
                        heart.classList.remove('gray', 'glow');
                        showHeartMessage('希望永远不会消失！', 3000);
                        
                        // 移除灰色遮罩和雨滴效果
                        const overlay = document.querySelector('.gray-overlay');
                        const rain = document.querySelector('.rain');
                        overlay.classList.remove('active');
                        rain.classList.remove('active');
                        
                        // 等待消息显示完毕后滚动到婚礼详情页面
                        setTimeout(() => {
                            document.querySelector('.details-section').scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // 清理雨滴元素
                            while (rain.firstChild) {
                                rain.removeChild(rain.firstChild);
                            }
                        }, 3500);
                    }
                });
            }, 8500);
        }, 4500);
    }, 500);
}

// 在适当的时机调用这个函数，比如在爱心变灰后
function onHeartTurnGray() {
    const heart = document.querySelector('.broken-heart');
    heart.classList.add('gray');
    initHeartInteraction();
}

// 创建雨滴
function createRaindrops() {
    const numberOfDrops = 100;
    for (let i = 0; i < numberOfDrops; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        raindrop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(raindrop);
    }
}

// 弹幕功能
function createDanmaku(name, message) {
    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku';
    danmaku.textContent = `${name}: ${message}`;
    
    // 随机生成弹幕的垂直位置
    const top = Math.random() * 70 + 15; // 15% 到 85% 之间
    danmaku.style.top = `${top}%`;
    
    // 随机生成弹幕的颜色
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead',
        '#ff9999', '#99ccff', '#ff99cc', '#99ff99', '#ffcc99'
    ];
    danmaku.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    // 将弹幕添加到容器中
    const container = document.querySelector('.danmaku-container');
    container.appendChild(danmaku);
    
    // 动画结束后移除弹幕
    danmaku.addEventListener('animationend', () => {
        danmaku.remove();
    });
}

// 处理表单提交
document.querySelector('.rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('sender-name');
    const messageInput = document.getElementById('blessing-message');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (name && message) {
        // 创建弹幕
        createDanmaku(name, message);
        
        // 清空表单
        nameInput.value = '';
        messageInput.value = '';
        
        // 显示成功提示
        alert('祝福已发送！');
    } else {
        alert('请填写姓名和祝福语！');
    }
});

// 音乐控制
let currentMusic = null;
const music1 = document.getElementById('bgMusic1');
const music2 = document.getElementById('bgMusic2');
const muteButton = document.querySelector('.mute-button');
const muteIcon = muteButton.querySelector('i');
let isMuted = false;

// 监听滚动事件来切换音乐
window.addEventListener('scroll', function() {
    const storySection = document.querySelector('.story-section');
    const storySectionRect = storySection.getBoundingClientRect();
    const isStoryVisible = storySectionRect.top <= window.innerHeight / 2 && 
                          storySectionRect.bottom >= window.innerHeight / 2;

    if (isStoryVisible && currentMusic !== music2) {
        // 如果滚动到"我很生气！"部分，播放第二首音乐
        if (currentMusic) currentMusic.pause();
        music2.currentTime = 0;
        music2.play();
        currentMusic = music2;
    } else if (!isStoryVisible && currentMusic !== music1) {
        // 如果离开"我很生气！"部分，播放第一首音乐
        if (currentMusic) currentMusic.pause();
        music1.currentTime = 0;
        music1.play();
        currentMusic = music1;
    }
});

// 静音按钮点击事件
muteButton.addEventListener('click', function() {
    isMuted = !isMuted;
    music1.muted = isMuted;
    music2.muted = isMuted;
    
    if (isMuted) {
        muteIcon.className = 'fas fa-volume-mute';
    } else {
        muteIcon.className = 'fas fa-volume-up';
    }
});

// 页面加载时自动播放第一首音乐
document.addEventListener('DOMContentLoaded', function() {
    // 设置音乐循环播放
    music1.loop = true;
    music2.loop = true;
    
    // 尝试播放第一首音乐
    const playPromise = music1.play();
    currentMusic = music1;
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Auto-play was prevented. Please click anywhere to start playing music.");
            // 添加点击事件来启动音乐（解决自动播放限制）
            document.addEventListener('click', function() {
                if (!music1.playing) {
                    music1.play();
                    currentMusic = music1;
                }
            }, { once: true });
        });
    }
});

// 创建初始交互提示
function createInitialInteraction() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
        color: white;
        font-size: 24px;
        text-align: center;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        animation: pulse 1.5s infinite;
    `;
    message.innerHTML = '点击任意位置开始<br>🎄圣诞快乐🎄';

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // 点击事件处理
    overlay.addEventListener('click', function() {
        // 播放第一首音乐
        music1.play().then(() => {
            currentMusic = music1;
            // 移除遮罩
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }).catch(error => {
            console.error('Failed to play music:', error);
        });
    });
}

// 页面加载时显示交互提示
document.addEventListener('DOMContentLoaded', function() {
    // 设置音乐循环播放
    music1.loop = true;
    music2.loop = true;
    
    // 创建初始交互提示
    createInitialInteraction();
}); 