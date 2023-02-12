// pages/showDetail/showDetail.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';


Page({
  data: {
    name: "",
    imgUrls: [],
    description: "",
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  goHome() {
    wx.navigateTo({
      url: '../toUpload/toUpload'
    })
  },

  onLoad: function (options) {
    //接受传来的json字符串
    console.log(options);
    let data = JSON.parse(options.result);
    console.log(data.name)
    // wx.setNavigationBarTitle({
    //   title: data.name
    // })
    
    //轮播图与描述信息
     if (true) {
      //轮播图 
      var imgArr = []

      wx.cloud.getTempFileURL({
        fileList: data.images,
        success: res => {
          // get temp file URL
           console.log(res.fileList)
          for (let i = 0; i < data.images.length; i++) {

            imgArr.push(res.fileList[i].tempFileURL)
            // console.log(imgArr)
          }
          this.setData({
            name: data.name,
            des: data.des,
            imgUrls: imgArr
          })
        },
        fail: err => {
          // handle error
        }
      })
     } 
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