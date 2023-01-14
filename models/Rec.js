/* eslint-disable linebreak-style */
import mongoose from "mongoose";

const recSchema = mongoose.Schema({
    level_0:{type:Number,default:0},
    index:{type:Number,default:0},
    RecipeId:{type:Number,default:0},
    Name:String,
    AuthorId:String | Number,
    AuthorName:String,
    CookTime:Number,
    PrepTime:Number,
    TotalTime:Number,
    DatePublished:{type:Date,default:Date.now()},
    Description:String,
    Images:[String],
    RecipeCategory:String,
    Keywords:[String],
    RecipeIngredientQuantities:[String],
    RecipeIngredientParts:[String],
    AggregatedRating:{type:Number,default:0},
    ReviewCount:{type:Number,default:0},
    Calories:Number,
    FatContent:Number,
    SaturatedFatContent:Number,
    CholesterolContent:Number,
    SodiumContent:Number,
    CarbohydrateContent:Number,
    FiberContent:Number,
    SugarContent:Number,
    ProteinContent:Number,
    RecipeServings:Number,
    RecipeYield:{type:String,default:"people"},
    RecipeInstructions:[String],
    Comments:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true,
            },
            name:{
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    CommentsCount:{
        type: Number,
        default:0,
    },
},{collection:"SortRec"});

var Rec =  mongoose.model("SortRec", recSchema);
export default Rec;
