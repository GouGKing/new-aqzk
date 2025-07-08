Component({
  properties: {
    blynkAuth: {
      type: String,
      value: 'fA50fg3MDoWU1WwRvCZFV2AIi6bNIISB'
    },
    virtualPin: {
      type: Number,
      value: 8
    },
    soundAuth: {
      type: String,
      value: 'fA50fg3MDoWU1WwRvCZFV2AIi6bNIISB' // 新增：声音传感器的Blynk令牌
    },
    soundPin: {
      type: Number,
      value: 10 // 新增：声音状态虚拟引脚V10
    },
    enableSoundAlert: {
      type: Boolean,
      value: true // 新增：启用声音警报功能
    }
  },
  
  data: {
    // 原有灯光状态数据
    lightStatus: false,
    backgroundColor: '#4CAF50',
    statusText: '已关灯',
    updateInterval: null,
    lastUpdate: '',
    loading: true,
    errorCount: 0,
    lastError: '',
    
    // 新增声音状态数据
    soundStatus: false,       // 声音状态：false=正常，true=过高
    soundText: '声音正常',    // 声音状态显示文本
    soundClass: 'normal',     // 声音状态样式类
    soundAlertVisible: false, // 声音警报提示可见性
    lastSoundAlert: ''        // 上次声音警报时间
  },
  
  lifetimes: {
    attached() {
      this.fetchLightStatus();
      // 新增：首次获取声音状态
      if (this.properties.enableSoundAlert) {
        this.fetchSoundStatus();
      }
      
      // 新增：定时更新灯光和声音状态
      this.data.updateInterval = setInterval(() => {
        this.fetchLightStatus();
        if (this.properties.enableSoundAlert) {
          this.fetchSoundStatus();
        }
      }, 5000);
    },
    
    detached() {
      clearInterval(this.data.updateInterval);
    }
  },
  
  methods: {
    // 原有灯光状态获取方法（保持不变）
    fetchLightStatus() {
      const timestamp = new Date().toLocaleTimeString();
      this.setData({ lastUpdate: `灯光: ${timestamp}`, loading: true });
      
      const pin = `V${this.properties.virtualPin}`;
      const token = this.properties.blynkAuth;
      
      wx.request({
        url: `https://blynk.cloud/external/api/get?token=fA50fg3MDoWU1WwRvCZFV2AIi6bNIISB&pin=V8`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            const isLightOn = res.data === '1' || res.data === 'true' || res.data === 1 || res.data === true;
            this.updateLightStatus(isLightOn, () => {
              console.log('灯光UI更新完成');
            });
            this.setData({ errorCount: 0, lastError: '' });
          } else {
            this.handleError(`灯光API错误 ${res.statusCode}`);
          }
        },
        fail: (err) => {
          this.handleError(err.errMsg || '灯光网络请求失败');
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
    },
    
    updateLightStatus(isLightOn, callback) {
      const backgroundColor = isLightOn ? '#F44336' : '#4CAF50';
      const statusText = isLightOn ? '未关灯' : '已关灯';
      this.setData({
        lightStatus: isLightOn,
        backgroundColor: backgroundColor,
        statusText: statusText
      }, callback);
    },
    
    // 新增：声音状态获取方法
    fetchSoundStatus() {
      const timestamp = new Date().toLocaleTimeString();
      this.setData({ lastUpdate: `灯光/声音: ${timestamp}`, loading: true });
      
      const pin = `V${this.properties.soundPin}`;
      const token = this.properties.soundAuth;
      
      wx.request({
        url: `https://blynk.cloud/external/api/get?token=fA50fg3MDoWU1WwRvCZFV2AIi6bNIISB&pin=V10`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            // 转换Blynk返回值为声音状态（1=过高，0=正常）
            const isSoundHigh = res.data === '1' || res.data === 'true' || res.data === 1 || res.data === true;
            this.updateSoundDisplay(isSoundHigh);
          }
        },
        fail: (err) => {
          console.error('声音网络请求失败:', err);
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
    },
    
    // 新增：更新声音状态显示
    updateSoundDisplay(isSoundHigh) {
      this.setData({
        soundStatus: isSoundHigh,
        soundText: isSoundHigh ? '声音过高' : '声音正常',
        soundClass: isSoundHigh ? 'sound-alert' : 'sound-normal'
      });
      
      // 当声音过高时显示警报提示
      if (isSoundHigh && this.properties.enableSoundAlert) {
        this.setData({
          soundAlertVisible: true,
          lastSoundAlert: new Date().toLocaleTimeString()
        });
        
        // 3秒后自动隐藏警报
        setTimeout(() => {
          this.setData({ soundAlertVisible: false });
        }, 3000);
      }
    },
    
    // 新增：关闭声音警报提示
    closeSoundAlert() {
      this.setData({ soundAlertVisible: false });
    },
    
    // 原有错误处理方法（保持不变）
    handleError(message) {
      this.setData({
        errorCount: this.data.errorCount + 1,
        lastError: message
      });
    },
    
    // 原有刷新方法（保持不变）
    onRefresh() {
      this.setData({ loading: true });
      this.fetchLightStatus();
      if (this.properties.enableSoundAlert) {
        this.fetchSoundStatus();
      }
    }
  }
});