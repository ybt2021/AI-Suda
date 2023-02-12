// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request-promise')

// 设置APPID/AK/SK for easyDL
const APP_ID = "24535491";
const API_KEY = "PWGmjAh4BtKde5GNckbAA0o1";
const SECRET_KEY = "PCOG5cujQgI9yOdV2rvVRssg5vH2cDAy";
const API_URL = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/classification/sudaArcDetect";

const ENV = "cloud1-3gynlyvd910d33fc";
cloud.init({ env: ENV })
const db = cloud.database({ env: ENV });

// 云函数入口函数
exports.main = async (event, context) => {

  return new Promise(async (resolve, reject) => {
    try {
      // 获取Baidu access_token数据
      // let {
      //     data:{
      //         access_token
      //     }
      // } = await db.collection('baidu-token').doc('token').get()

      const client_id = API_KEY  // 百度appid
      const client_secret = SECRET_KEY  // 百度secret
      const url_get_token = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
      let data = await rq({
        method: 'GET',
        uri: url_get_token,
        json: true
      })
      if (!data || !data.access_token) throw { code: 7320}
      let access_token = data.access_token
      if (data.error) {
        reject(data)
      }

      // 从云函数下载下来
      if (!event.fileID) throw { code: 7322, data: [], info: '图片不能为空' }
      // 参数
      let fileID = event.fileID

      let {
        fileContent
      } = await cloud.downloadFile({
        fileID,
      })
      cloud.deleteFile({ fileList: [fileID] })
      if (!fileContent) throw { code: 7323}
      let image = fileContent.toString('base64')

      // 向百度云请求图像识别
      let {
        results
      } = await rq({
        method: 'POST',
        uri: `${API_URL}?access_token=${access_token}`,
        json: true,
        headers: {
          "content-type": "application/json",
        },
        body: {
          'image': image
        }
      })
      console.log('Baidu results[0].score:'+results[0].score);
      
      // 错误判断
      if (!results) throw { code: 7325}
      if (results[0].score < 0.8) throw { code: 7326}

      // 请求成功的处理逻辑
      let queryKey = results[0].name;
      console.log(queryKey);
      // 查询DB数据
      let info = await db.collection('arcIntroduce').where({
        name: queryKey
      }).field({
        name: true,
        des: true,
        images: true,
        _id: false
      }).get()
      console.log(info);
      if (!info.data || !info.data.length ) throw { code: 7327}
      resolve(info.data[0])
    } catch (error) {
      console.log(error)
      // if (error.fileID) await cloud.deleteFile({ fileList: [error.fileID] })
      if (!error.code) reject(error)
      resolve(error)
    }
  })
}
