const articleModel = require('../models/articleModel');
const {checkUser} = require("./baseController");
const userModel = require("../models/userModel");

exports.getArticles = async (request, response, callback) => {

    const currentUser = await checkUser(request, response);
    const params = request.query;
    try {
        let  articles = null;
        //Visitor
        if (!currentUser) {
            //Doesn't need params
            articles = await articleModel.find({
                visible: true
            }).sort({
                updated_at: 'desc'
            }).populate('author');
        }

        //User
        if (currentUser) {
            // TODO - to seek by params and keywords
            articles = await articleModel.find(params).sort({
                updated_at: 'desc'
            }).populate('author');
        }
        const articles_to_send = [];
        if (articles) {
            // Remove User password
            articles.map(article => {
                if (article.author) {
                    article.author.password = '';
                }
                articles_to_send.push(
                    {
                        id: article.id,
                        title: article.title,
                        article_url : article.article_url,
                        image_url : article.image_url,
                    }
                );
            });
        }

        response.status(200).json({
            message: 'Article fetched successfully',
            data: articles_to_send
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not found ' + e.message
        });
    }
}

exports.getArticle = async (request, response, callback) => {
    try {
        const article = await articleModel.findById(request.params.id).populate('author');
        if (article && article.author) {
            article.author.password = '';
        }
        response.status(200).json({
            message: 'Article fetched successfully',
            data: article
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not found ' + e.message
        });
    }
}

exports.createArticle = async (request, response, callback) => {
    // TODO - many Repeat - Have to optimize
    const admin = checkUser(request, response);
    if (admin.role !== 'ROLE_ADMIN') {
        return response.status(401).json({
            message: 'You are not authorized to create a Article'
        });
    }

    try {
        const article = await articleModel.create(request.body);
        await userModel.findByIdAndUpdate(admin.id, {$push: {articles: article.id}});
        await articleModel.findByIdAndUpdate(article.id, {$push: {author: admin.id}});

        response.status(201).json({
            message: 'Article created successfully',
            data: article
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not created. ' + e.message
        });
    }
}

exports.updateArticle = async (request, response, callback) => {
    try {
        const article = await articleModel.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        });
        response.status(201).json({
            message: 'Article updated successfully',
            data: article
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not updated. ' + e.message
        });
    }
}

exports.deleteArticle = async (request, response, callback) => {
    try {
        // I set listener on articleModel to delete Article from User
        await articleModel.findByIdAndDelete(request.params.id);
        response.status(200).json({
            message: 'Article deleted successfully',
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not deleted. ' + e.message
        });
    }
}
