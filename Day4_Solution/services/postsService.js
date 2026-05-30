const Post = require("../models/postModel");
const APIError = require("../utils/APIError");

const createPost = async (data, userId) => {
    try {
        const post = await Post.create({ ...data, userId });
        return post;
    } catch (error) {
        throw error;
    }
}

const getAllPosts = async (query, userId) => {
    try {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate("userId", "name email")
            .skip(skip)
            .limit(limit);

        const totalCount = await Post.countDocuments();

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }

        // add isOwner flag to each post
        const postsWithOwner = posts.map((post) => {
            const postObj = post.toObject();
            postObj.isOwner = post.userId._id.toString() === userId.toString();
            return postObj;
        });

        return { posts: postsWithOwner, pagination };
    } catch (error) {
        throw error;
    }
}

const getPostById = async (id, userId) => {
    try {
        const post = await Post.findById(id).populate("userId", "name email");
        if (!post) return null;

        const postObj = post.toObject();
        postObj.isOwner = post.userId._id.toString() === userId.toString();

        return postObj;
    } catch (error) {
        throw error;
    }
}

const updatePostById = async (id, data, userId) => {
    try {
        const post = await Post.findById(id);
        if (!post) return null;

        // check ownership
        if (post.userId.toString() !== userId.toString()) {
            throw new APIError("You are not allowed to update this post", 403);
        }

        const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
        return updatedPost;
    } catch (error) {
        throw error;
    }
}

const deletePostById = async (id, userId) => {
    try {
        const post = await Post.findById(id);
        if (!post) return null;

        // check ownership
        if (post.userId.toString() !== userId.toString()) {
            throw new APIError("You are not allowed to delete this post", 403);
        }

        const deletedPost = await Post.findByIdAndDelete(id);
        return deletedPost;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
}
