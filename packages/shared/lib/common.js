// 标记打包时间
if (typeof console === 'object' && typeof console.log === 'function') {
  window._version = `${process.env.PROJECT_NAME} project pack time is ${process.env.BUILD_TIME}`
}
