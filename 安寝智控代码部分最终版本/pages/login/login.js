Page({
  /**
   * 页面的初始数据
   */
  data: {
    isStudent: true, // 默认学生登录
    studentId: '',
    account: '',
    password: '',
    isPasswordVisible: false, // 控制密码是否可见
    passwordType: 'password' // 输入框类型
  },

  adminAccount: '1',
  adminPassword: '1',

  // 切换角色
  switchToStudent() {
    this.setData({ isStudent: true });
  },

  switchToAdmin() {
    this.setData({ isStudent: false });
  },

  // 输入绑定
  onStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    });
  },

  onAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 切换密码显示/隐藏
  togglePasswordVisibility() {
    this.setData({
      isPasswordVisible: !this.data.isPasswordVisible,
      passwordType: this.data.isPasswordVisible ? 'password' : 'text'
    });
  },

  // 登录处理
  handleLogin() {
    const { isStudent, account, password } = this.data;

    // 表单验证
    if (isStudent && !this.data.studentId) {
      wx.showToast({
        title: '请输入学号',
        icon: 'none'
      });
      return;
    }

    if (!isStudent && !account) {
      wx.showToast({
        title: '请输入管理员账号',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    if (isStudent) {
      // 学生登录逻辑
      const { studentId, password } = this.data;
      wx.request({
        url: 'http://localhost:3000/getStudents',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            const students = res.data;
            // 查找学号和密码都匹配的学生
            const validStudent = students.find(
              student =>
                student.student_id === studentId &&
                password === student.student_id  // 账号和密码都必须与student_id相同
            );

            if (validStudent) {
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
              // 登录成功后跳转到指定页面
              wx.navigateTo({
                url: '/pages/student/home'
              });
            } else {
              wx.showToast({
                title: '学号或密码错误',
                icon: 'none'
              });
            }
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
    } else {
      // 管理员登录逻辑保持不变
      if (account === this.adminAccount && password === this.adminPassword) {
        wx.setStorageSync('token', 'admin_token');
        wx.reLaunch({
          url: '/pages/admin/dashboard',
        });
      } else {
        wx.showToast({
          title: '管理员账号或密码错误',
          icon: 'none'
        });
      }
    }
  },

  // 其他生命周期函数保持不变
  // ...
});