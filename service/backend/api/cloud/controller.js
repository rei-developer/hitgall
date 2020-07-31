module.exports.createImage = type => async ctx => {
	const ext = ctx.req.file.originalname.substr(
		ctx.req.file.originalname.lastIndexOf('.') + 1,
		ctx.req.file.originalname.length
	)
	const checker = ext === /(.gif|.png|.jpg|.jpeg|.webp)/i.test(ctx.req.file.filename)
	try {
		if (checker) {
			ctx.body = {
				filename,
				status: 'ok'
			}
		} else {
			ctx.body = {
				message: 'gif, png, jpg, jpeg, webp만 가능',
				status: 'fail'
			}
		}
	} catch (e) {
		ctx.body = {
			message: e.message,
			status: 'fail'
		}
	}
}