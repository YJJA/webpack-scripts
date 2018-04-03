import KoaRouter from 'koa-router'

const router = new KoaRouter()

router.post('/demo', async (ctx, next) => {
  ctx.body = {list: []}
})

export default router.routes()
