const postsService = require("../services/postsService");
const APIError = require("../utils/APIError");

const createPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const post = await postsService.createPost(req.body, userId);
        res.status(201).json({
            message: "Post Created Successfully",
            data: post
        })
    } catch (error) {
        next(error);
    }
}

const getAllPosts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await postsService.getAllPosts(req.query, userId);
        res.status(200).json({
            message: "Posts Fetched Successfully",
            data
        })
    } catch (error) {
        next(error);
    }
}

const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await postsService.getPostById(id, userId);

        if (!post) {
            return next(new APIError("Post Not Found", 404));
        }

        res.status(200).json({
            message: "Post Fetched Successfully",
            data: post
        })
    } catch (error) {
        next(error);
    }
}

const updatePostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await postsService.updatePostById(id, req.body, userId);

        if (!post) {
            return next(new APIError("Post Not Found", 404));
        }

        res.status(200).json({
            message: "Post Updated Successfully",
            data: post
        })
    } catch (error) {
        next(error);
    }
}

const deletePostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await postsService.deletePostById(id, userId);

        if (!post) {
            return next(new APIError("Post Not Found", 404));
        }

        res.status(200).json({
            message: "Post Deleted Successfully",
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
}
