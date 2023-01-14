/* eslint-disable linebreak-style */
import express from "express";

import SortRec from "../models/Rec.js";

const router = express.Router();


export const getCards = async (req, res) => { 
    try {
        const {category,page}=req.query;
        const category1 = (category!="All")
            ? {
                RecipeCategory: category,
            }
            : {};
        const LIMIT = 10;
        const startIndex = (Number(page) - 1) * LIMIT; 
        const total = await SortRec.countDocuments(category=="All"?{}:{RecipeCategory:category});
        const cardMessages = await SortRec.find(category1).limit(LIMIT).skip(startIndex);
        console.log("home",cardMessages.length,category,page);

        res.status(200).json({data:cardMessages, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

export const getNewCards = async (req, res) => { 
    try {
        const {page}=req.query;
        const LIMIT = 10;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await SortRec.countDocuments();
        const cardMessages = await SortRec.find().sort({DatePublished:-1}).limit(LIMIT).skip(startIndex);
        // console.log("new",cardMessages.length)
        res.status(200).json({data:cardMessages, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

export const getRelatedCards = async (req, res) => { 
    try {
        const { query } = req.query;
        const agg = [
            {$search: {autocomplete: {query: query, path: "Name"}}},
            {$limit: 10},
            {$project: {_id: 1,Name: 1,Images:1,AggregatedRating:1,CommentsCount:1,TotalTime:1,Calories:1,CarbohydrateContent:1,ProteinContent:1,FatContent:1}}
        ];
        const response = await SortRec.aggregate(agg);
        res.status(200).json({data:response});
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

export const getCard = async (req, res) => { 
    const { id } = req.params;
    try {
        const card = await SortRec.findById(id);
        // console.log("card")
        res.status(200).json(card);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createCard = async (req, res) => {
    const formData = req.body;
    const newRec = new SortRec({ ...formData });
    try {
        await newRec.save();
        res.status(201).json(newRec );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const createCardComment = async (req, res) => {
    const { rating, comment, CardId,UserId,UserName } = req.body;
    const review = {
        user: UserId,
        name:UserName,
        rating: Number(rating),
        comment,
    };
    const card = await SortRec.findById(CardId);
    const isReviewed = card.Comments.find(
        (rev) => rev?.user?.toString() === UserId.toString()
    );
    if (isReviewed) {
        card.Comments.forEach((rev) => {
            if (rev.user.toString() === UserId.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        card.Comments.push(review);
        card.CommentsCount = card.Comments.length;
    }
    let avg = 0;
    card.Comments.forEach((rev) => {
        avg += rev.rating;
    });
    card.AggregatedRating = (avg+card.AggregatedRating) / (card.Comments.length+1);
    await card.save({ validateBeforeSave: false });
    res.status(200).json({
        success: card,
    });
};

export const getCardsBySearch = async (req, res) => {
    const { Keywords } = req.query;
    try {
        const cards = await SortRec.find({  Keywords: { $in: Keywords.split(",") } }).limit(4);
        res.json({data:cards });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
};

export const autocompletesearch = async (req, res) => {
    try {
        const { name } = req.query;
        const agg = [
            {$search: {autocomplete: {query: name, path: "Name"}}},
            {$limit: 10},
            {$project: {_id: 1,Name: 1}}
        ];
        const response = await SortRec.aggregate(agg);
        return res.json(response);
    } catch (error) {
        console.log("error",error);
        return res.json(error.message);
    }
};
export const getRecommendSearch = async (req, res) => {
    const { Keywords} = req.query;
    var array = Keywords.split(",");
    if(array===null){
        res.json({data:null });
        return;
    } 
    try {
        const cards = await SortRec.aggregate([
            {
                "$set": {
                    "interSize": {
                        "$size": {
                            "$setIntersection": [
                                "$RecipeIngredientParts",
                                array
                            ]
                        }
                    }
                }
            },
            {
                "$sort": {
                    "interSize": -1
                }
            },
            {
                "$limit": 6
            }
        ]);
        res.json({data:cards });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
};



export default router;