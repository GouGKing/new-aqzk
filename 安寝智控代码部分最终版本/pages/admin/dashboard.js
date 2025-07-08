Page({
  data: {
    currentTab: 'addInfo', // 当前选中导航项（默认添加信息）
    showStudentInfoFields: false, // 学生信息输入框显示状态
    link: '', // 外部链接
    text: '', // 文本内容
    showDormDetail: false, // 寝室详情显示状态
    dormMembers: '张三、李四、王五', // 寝室成员
    dormLeader: '张三', // 寝室长
    doorStatus: '未知', // 门锁状态
    students: [], // 学生列表
    studentId: '', // 学号
    studentName: '', // 姓名
    dormitoryNumber: '', // 寝室号
    alertVisible: false, // 提示框显示状态
    alertMsg: '', // 提示信息
    alertColor: '#fff', // 提示框颜色
    isSettingsPage: false,
    dormList: ['614', '615', '616', '617', '618', '619'] // 新增寝室列表
  },
  
  // 跳转到设置页面
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 切换底部导航
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // 显示学生信息输入框
  showStudentInfoInput() {
    this.setData({ showStudentInfoFields: !this.data.showStudentInfoFields });
  },

  // 学号输入处理
  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  // 姓名输入处理
  onStudentNameInput(e) {
    this.setData({ studentName: e.detail.value });
  },

  // 寝室号输入处理
  onDormitoryNumberInput(e) {
    this.setData({ dormitoryNumber: e.detail.value });
  },

// 添加学生信息
addStudent() {
  const { studentId, studentName, dormitoryNumber } = this.data;
  if (!studentId ||!studentName ||!dormitoryNumber) {
    wx.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  wx.request({
    url: 'http://localhost:3000/addstudent',
    method: 'POST',
    data: {
      studentId,
      studentName,
      dormitoryNumber
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      if (res.statusCode === 200) {
        wx.showToast({
          title: '学生信息插入成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '插入失败',
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
submitData() {
  const { link, text } = this.data;
  // 模拟存储数据到本地缓存，实际应用中可替换为后端接口调用
  wx.setStorageSync('transferredData', { link, text });
  wx.showToast({
    title: '提交成功',
    icon: 'success'
  });
  wx.navigateTo({
    url: '/pages/student/home/home'
  });
},

  // 获取学生信息（跳转页面）
  getStudents() {
    wx.navigateTo({ url: '/pages/studentList/studentList' });
  },

  // 点击寝室查看详情
  handleDormitoryJump() {
    this.setData({ showDormDetail: !this.data.showDormDetail });
    // 模拟获取门锁状态（实际需替换为硬件接口）
    this.setData({ doorStatus: '已关闭' });
  },
  // 处理链接输入
  handleLinkInput(e) {
    this.setData({ link: e.detail.value });
  },

  // 处理文本输入
  handleTextInput(e) {
    this.setData({ text: e.detail.value });
  },

  // 提交数据到学生页面
  submitData() {
    const { link, text } = this.data;
    
    // 验证输入
    if (!link && !text) {
      wx.showToast({
        title: '请至少输入链接或文本',
        icon: 'none'
      });
      return;
    }
    
    // 存储数据到全局缓存
    wx.setStorageSync('transferredData', { 
      link, 
      text,
      timestamp: Date.now()  // 当前时间戳
    });
    
    console.log('已存储数据:', { link, text });
    
    // 显示成功提示
    this.showAlert('公告发送成功', '#34c759');
    
    // 清空输入框
    this.setData({
      link: '',
      text: ''
    });
  },

  // 页面加载时触发
  onLoad() {
    this.getLockStatus();
  },
   // 切换宿舍详情的显示与隐藏
   handleDormitoryJump() {
    const targetPage = '/pages/dormDetail/dormDetail';
    const dormNumber = '617';
    wx.navigateTo({
      url: `${targetPage}?dormNumber=${dormNumber}`
    });
  },

  // 模拟从ESP8266获取门锁状态
  getLockStatus() {
    setTimeout(() => {
      this.setData({
        doorStatus: '已关闭'
      });
    }, 2000);
  },
 


  // 显示提示框
  showAlert(msg, color) {
    this.setData({
      alertVisible: true,
      alertMsg: msg,
      alertColor: color
    });
    
    // 2秒后自动隐藏提示框
    setTimeout(() => {
      this.setData({ alertVisible: false });
    }, 2000);
  }
});  