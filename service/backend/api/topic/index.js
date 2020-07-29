const Router = require("koa-router");
const Controller = require("./controller");

const app = new Router();

//==========================================
// GET
//==========================================
app.get("/count/:domain", Controller.getTopicCounts);
app.get("/categories/:domain", Controller.getCategories);
// 글 읽는 페이지
app.get("/read/:id", Controller.getContent);
// 글 쓰는 페이지
app.get("/save", Controller.getSavedContent);

//==========================================
// POST
//==========================================
app.post("/list", Controller.getTopics);
app.post("/list/widget", Controller.getListToWidget);
app.post("/list/post", Controller.getPosts);
app.post("/list/post/me", Controller.getMyPosts);
app.post("/list/image", Controller.getImages);

// 글 쓰기
app.post("/write", Controller.createTopic);
app.post("/write/save", Controller.createTopicSave);
app.post("/write/post", Controller.createPost);
app.post("/vote", Controller.createTopicVotes);
app.post("/vote/post", Controller.createPostVotes);

//==========================================
// patch
//==========================================
app.patch("/edit/notice", Controller.updateTopicByIsNotice);
app.patch("/edit/post", Controller.updatePost);
app.patch("/edit/:id", Controller.updateTopic);

//==========================================
// delete
//==========================================

// 글 삭제하기
app.delete("/delete", Controller.deleteTopic);
app.delete("/delete/post", Controller.deletePost);

module.exports = app;
