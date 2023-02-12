const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      typeValue: value,
      show: false
    })
    this.typeIndex = index
  },

  filePath: "",
  data: {
    tempFilePaths: "https://img0.baidu.com/it/u=2293485875,3491536313&fm=26&fmt=auto&gp=0.jpg",
    show: false,
    disabled: true
  },

  onLoad: function (options) {
  },
  onReady() {
  },

  doUpload: function () {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          tempFilePaths,
          disabled: false
        })
        _this.filePath = res.tempFilePaths[0];
      },
    })
  },
  doCloud() {
    Toast.loading({
      message: '识别中...',
      forbidClick: true,
      duration: 10000,
      mask: true
    });
    let filePath = this.filePath
    var _this = this
    const cloudPath = `img-detect/${Date.now()}${filePath.match(/\.[^.]+?$/)}`
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        let fileID = res.fileID
        let typeIndex = _this.typeIndex
        wx.cloud.callFunction({
          name: "archDetect",
          data: {
            fileID: fileID,
          },
          success: res => {
            console.log(res)
            if (res.result.code) {
              Toast.clear()
              Toast.fail('查无此物');
            }
            else{
              let result = res.result
              result = JSON.stringify(res.result)
              console.log("Result:"+result)
              wx.navigateTo({
                url: '../showDetail/showDetail?result='+result
              })
              Toast.clear()
            }
          },
          fail: res => {
            Toast.clear()
            Toast.fail('查无此物');
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '拍吧，AI智识苏州大学知名建筑',
      path: '/pages/index/index',
      imageUrl: 'https://636c-cloud1-3gynlyvd910d33fc-1306494746.tcb.qcloud.la/images/OldGate.jpeg',
    }
  },
  onShareTimeline: function () {
    return {
      title: '拍吧，AI智识苏州大学知名建筑',
      path: '/pages/index/index',
      imageUrl: 'https://636c-cloud1-3gynlyvd910d33fc-1306494746.tcb.qcloud.la/images/OldGate.jpeg',
    }
  }
})