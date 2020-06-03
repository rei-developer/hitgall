module.exports = {
	start: io => {
		io.on('connection', socket => {
			socket.on('newTopic', data => io.sockets.emit('newTopic', data))
			socket.on('join', id => socket.join(id))
			socket.on('leave', id => socket.leave(id))
			// socket.on('disconnect', () => {})
		})
	},
	newBest: (io, id, domain, title) => io.sockets.emit('newBest', { id, domain, title }),
	newTopic: (io, id, domain, title) => io.sockets.emit('newTopic', { id, domain, title }),
	newPost: (io, id) => io.sockets.in(id).emit('newPost'),
	vote: (io, id, likes, hates) => io.sockets.in(id).emit('vote', { likes, hates }),
	votePost: (io, id, postId, likes, hates) => io.sockets.in(id).emit('votePost', { postId, likes, hates })
}