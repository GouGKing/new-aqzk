Page({
  data: {
    students: [],
    alertVisible: false, // 提示框显示状态
    alertMsg: '', // 提示内容
    alertColor: '#fff' ,// 提示框背景颜色
    //门锁
    doorStatus: '获取中...',
    statusColor: '#cccccc',
    blynkAuth: '',
    virtualPin: 0,

    currentTab: 'announcement', // 初始值设置为公告页
    lockStatus: 'open',
    // 轮播图配置
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    // 轮播图片列表
    imageList: [
      { url: 'https://ts1.tc.mm.bing.net/th/id/R-C.33917ad12ceaee244d5b7d0ac5b5a66a?rik=iS8uZagJWQT%2bTQ&riu=http%3a%2f%2fp5.itc.cn%2fimages01%2f20201020%2fd391c285b8174bb3b49ccb39640d090d.jpeg&ehk=qnMbUt5uc6edkOXMpwCrCG8SNzW92WukYAhD2MYC5cQ%3d&risl=&pid=ImgRaw&r=0', title: '图片1' },
      { url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.Dmfo5MYo2HW_Ed6VDmkI4QHaEK?rs=1&pid=ImgDetMain', title: '图片2' },
      { url: 'https://bpic.588ku.com/element_origin_min_pic/21/02/01/01ac88e5d9046401e9df31630e9dffb6.jpg', title: '图片3' }
    ],
    announcement: {
      link: '',
      text: '',
      timestamp: 0 // 用于检测数据更新
    },
    lastCheckedTime: 0 // 上次检查时间
  },

  // 加载公告数据
  onLoad() {
    this.loadAnnouncementData();
    this.fetchDoorStatus();
    this.fetchStudents();
    // 每 5 秒更新一次状态
    this.statusInterval = setInterval(() => {
      this.fetchDoorStatus();
    }, 5000);
    // 设置当前激活的标签页
    this.setData({
      currentTab: 'announcement'
    });
  },

  // 切换界面方法
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  onShow() {
    // 每次页面显示时检查是否有新数据
    const now = Date.now();
    if (now - this.data.lastCheckedTime > 1000) { // 避免频繁检查
      this.loadAnnouncementData();
    }
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },

  fetchDoorStatus() {
    wx.request({
      url: ``,
      method: 'GET',
      success: (res) => {
        console.log('Blynk API 返回:', res.data);
        const status = res.data === 1 || res.data === '1';
        const doorStatusText = status? '门锁未关' : '门锁关闭';
        const statusColor = status? '#ff0000' : '#00ff00';
        const newStatus = status? '门锁未关' : '门锁关闭';
        const prevStatus = this.data.doorStatus;
         // 仅在状态变化时触发提示
         if (newStatus !== prevStatus) {
          this.setData({
            doorStatus: doorStatusText,
          statusColor: statusColor,
          isLoading: false,
            doorStatus: newStatus,
            statusColor: newStatus === '门锁未关' ? '#ff0000' : '#00ff00',
            alertMsg: newStatus === '门锁未关' ? '⚠️ 警告：智能锁未关闭！' : '✅ 提示：智能锁已关闭',
            alertColor: newStatus === '门锁未关' ? '#ff4444' : '#34c759',
            alertVisible: true // 显示提示框
          });
  
          // 3秒后隐藏提示框
          setTimeout(() => {
            this.setData({ alertVisible: false });
          }, 3000);
        } else {
          // 状态未变化时仅更新状态
          this.setData({
            doorStatus: newStatus,
            statusColor: newStatus === '门锁未关' ? '#ff0000' : '#00ff00'
          });
        }
      },
      fail: (err) => {
        console.error('获取门状态失败:', err);
        this.setData({
          doorStatus: '获取状态失败',
          statusColor: '#cccccc'
        });
      }
    });
  },

  addSmartDevice() {
    // 添加智能家居的逻辑
    wx.showToast({
      title: '添加功能待开发',
      icon: 'none'
    });
  },

  fetchStudents() {
    wx.request({
      url: 'http://localhost:3000/getStudents',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const sortedStudents = res.data.sort((a, b) => a.id - b.id);
          this.setData({
            students: sortedStudents
          });
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('请求服务器失败:', err);
        wx.showToast({
          title: '请求服务器失败',
          icon: 'none'
        });
      }
    });
  },

  loadAnnouncementData() {
    try {
      const transferredData = wx.getStorageSync('transferredData');
      console.log('读取到的存储数据:', transferredData);
      if (transferredData) {
        // 更新页面数据
        this.setData({
          announcement: transferredData
        });
      }
    } catch (e) {
      console.error('读取公告数据失败:', e);
    }
  }
});