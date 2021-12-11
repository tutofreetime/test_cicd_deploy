const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
    },
    source: {
        type: String,
        required: [true, 'Source is required'],
    },
    visible: {
        type: Boolean,
        required: [true, 'Visible is required'],
        default: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    article_url: {
        type: String,
        required: [true, 'Article URL is required'],
    },
    image_url: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

articleSchema.pre('remove', function(next) {
    this.model('User').update(
        {},
        { $pull: { articles: this._id } },
        { multi: true },
        next
    );
});
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
