import { defineNuxtPlugin } from '#app'
import mkcert from 'mkcert'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.env.NODE_ENV !== 'production' && process.server) {
    try {
      // 生成CA证书
      const ca = await mkcert.createCA({
        organization: 'Video Upload App Dev CA',
        countryCode: 'CN',
        state: 'Beijing',
        locality: 'Beijing',
        validityDays: 365 // mkcert实际使用validityDays而不是validity
      })

      // 使用CA证书签发服务器证书
      if (ca && ca.key && ca.cert) {
        const cert = await mkcert.createCert({
          domains: ['localhost', '127.0.0.1'],
          validityDays: 365, // mkcert实际使用validityDays而不是validity
          // mkcert库中使用的属性名是ca.key和ca.cert
          ca: {
            key: ca.key,
            cert: ca.cert
          }
        })

        if (cert && cert.key && cert.cert) {
          console.log('自签名证书已生成成功')
          return {
            provide: {
              sslCert: {
                key: cert.key,
                cert: cert.cert
              }
            }
          }
        } else {
          console.log('服务器证书生成失败')
        }
      } else {
        console.log('CA证书生成失败')
      }
    } catch (error) {
      console.error('生成自签名证书时出错:', error)
    }
  }
  
  return {}
}) 