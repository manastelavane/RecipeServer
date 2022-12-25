import express from 'express';
import { getCards, createCard,getCard,createCardComment,getNewCards,getRecommendSearch,autocompletesearch } from '../controllers/cards.js';
const router = express.Router();

router.get('/', getCards);
router.post('/createcard', createCard);
router.put('/review', createCardComment);
router.get('/new', getNewCards);
router.get('/recomendsearch', getRecommendSearch);
router.get('/autocompletesearch', autocompletesearch);
router.get('/:id', getCard);

export default router;