import express from 'express';
import { askAiAssistant, getPromptSuggestions } from '../controllers/aiController.js';

const router = express.Router();

// Publicly accessible so farmers can ask questions seamlessly anytime
router.post('/chat', askAiAssistant);
router.get('/suggestions', getPromptSuggestions);

export default router;
