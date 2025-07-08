Page({
  data: {
    students: []
  },
  onLoad() {
    this.fetchStudents();
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
  }
});