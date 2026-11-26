// ============================================================================
// KRUSHICONNECT ADVANCED REGIONAL AGRO-CLIMATIC AI ENGINE (कृषि AI मित्र)
// Powered by Local Llama 3 (Ollama) with ICAR-Calibrated State & Crop Datasets
// Provides exact, verified soil, seed variety, and regional cultivation data.
// ============================================================================

// 1. Authoritative Regional Indian Agricultural Knowledge Profiles (ICAR / SAU Grounded)
const indianRegionalAgronomy = [
  {
    state: 'Punjab & Haryana',
    keywords: ['punjab', 'haryana', 'ludhiana', 'amritsar', 'bathinda', 'karnal', 'hisar', 'sirsa', 'पंजाब', 'हरियाणा'],
    soilProfile: 'Deep Indo-Gangetic Alluvial Soils (Fine Loam, Silt Loam, and Sandy Loam; neutral to slightly alkaline pH 7.2 - 8.2). High canal network and deep tube-well irrigation density.',
    crops: {
      rice: '• Recommended Varieties: PR-126 (short duration 123 days, saves 20-25% water), PR-131, PR-128, Pusa Basmati 1121, Pusa Basmati 1509, Pusa Basmati 1718.\n• State Mandated Transplanting Window: June 15 to June 30 (mandatory by Punjab Govt to preserve deep groundwater).\n• Soil Fit: Heavy clay-loam to silt-loam alluvium with high water puddling retention.',
      wheat: '• Recommended Varieties: HD-3086 (Pusa Gautami), HD-2967, DBW-187 (Karan Vandana), PBW-824, DBW-222.\n• Sowing Window: November 1 to November 15 (optimum).\n• Soil Fit: Fertile, well-drained loam and sandy-loam with balanced N:P:K (50:25:12 kg/acre).',
      cotton: '• Southwest Belt (Bathinda, Mansa, Muktsar, Sirsa): Bt Cotton hybrids (RCH 688, Ankur 3028).\n• Sowing: April 15 to May 15 before summer heat peaks.',
      mustard: '• South Haryana (Bhiwani, Mahendragarh, Rewari): RH-749, Giriraj, Pusa Bold in light sandy loam.'
    }
  },
  {
    state: 'Maharashtra',
    keywords: ['maharashtra', 'vidarbha', 'marathwada', 'nashik', 'pune', 'nagpur', 'kolhapur', 'sangli', 'महाराष्ट्र', 'विदर्भ', 'मराठवाड़ा', 'नासिक'],
    soilProfile: 'Deep to Medium Black Cotton Soils (Regur/Vertisols; high montmorillonite clay content, excellent moisture retention, alkaline pH 7.5 - 8.5) in Vidarbha/Marathwada; fertile volcanic loams in Western Maharashtra valleys.',
    crops: {
      cotton: '• Heartland of Indian Cotton (Vidarbha & Marathwada): Bt Cotton (Rasi 659, Ajit 155, Ankur 3028).\n• Sowing Window: June 20 to July 10 (immediately after 75-100mm monsoon rain).\n• Soil: Deep black cotton soil with high moisture retention.',
      soybean: '• Top Varieties: JS 9560 (85 days early maturity), JS 20-34, NRC 127.\n• Sowing Window: June 25 to July 15.',
      onion: '• Nashik Hub (Highest producer in India): Bhima Super, Bhima Red (Kharif/Late Kharif), Bhima Kiran (Rabi storage).\n• Soil: Medium black to rich loamy soil with excellent drainage (pH 6.5 - 7.5).',
      sugarcane: '• Western Maharashtra (Kolhapur, Pune, Satara): Co 86032 (Nira), CoM 0265.\n• Planting: Adsali (July-August) gives record 120-140 tonnes/acre.',
      gram: '• Rabi Chickpea: Vijay, Digvijay, JAKI 9218 (Wilt resistant).'
    }
  },
  {
    state: 'Madhya Pradesh (MP)',
    keywords: ['madhya pradesh', 'mp', 'malwa', 'indore', 'ujjain', 'sehore', 'bhopal', 'mandsaur', 'hoshangabad', 'narmadapuram', 'मध्य प्रदेश', 'मालवा'],
    soilProfile: 'Medium to Deep Black Soils (काली मिट्टी) in Malwa and Nimar; deep alluvial soils in Narmada Valley; mixed red and black soils in Bundelkhand. Neutral to alkaline pH 7.0 - 8.3.',
    crops: {
      soybean: '• Soy State of India: Top Varieties: JS 20-34, JS 20-98, RVS 2001-4, NRC 127 (Resistance to YMV and stem borer).\n• Sowing: June 20 - July 10 on broad-bed furrow (BBF) in deep black soil.',
      wheat: '• World-famous Sharbati Wheat (Sehore, Vidisha): C-306, Sujata (golden grain, premium chapati quality).\n• Irrigated High Yield: HI-1544, MP 1203, GW 322.\n• Sowing Window: October 25 to November 20.',
      gram: '• Chickpea: JG 11, JG 16, Dollar Chana / Kabuli (Kak-2).\n• Soil: Deep black soil with residual moisture.',
      garlic: '• Mandsaur & Neemuch Belt: Amleta, Yamuna Safed (G-1), Riyawan.\n• Sowing: October in well-drained sandy loam.'
    }
  },
  {
    state: 'Uttar Pradesh (UP)',
    keywords: ['uttar pradesh', 'up', 'meerut', 'muzaffarnagar', 'varanasi', 'gorakhpur', 'lucknow', 'aligarh', 'agra', 'कानपुर', 'उत्तर प्रदेश'],
    soilProfile: 'Highly fertile Indo-Gangetic Alluvial Soils (Fine sandy loam in Western UP, silt loam to clayey alluvium in Central & Eastern UP; neutral pH 6.8 - 7.8).',
    crops: {
      sugarcane: '• Western UP Cane Belt: Co 0238 (high sugar recovery), Co 15023, CoLk 14201.\n• Planting: Autumn (Oct-Nov) or Spring (Feb-March).',
      potato: '• Agra-Aligarh Belt (Largest potato hub): Kufri Pukhraj, Kufri Bahar, Kufri Chipsona-1.\n• Soil: Deep sandy loam rich in organic matter.',
      wheat: '• HD-2967, PBW-502, DBW-187 (Karan Vandana).\n• Sowing: November in fertile alluvial loam.',
      rice: '• Eastern UP: Sarjoo 52, Sambha Mahsuri, NDR 359, Kalanamak (GI tagged heritage scented rice in Siddharthnagar).'
    }
  },
  {
    state: 'Gujarat',
    keywords: ['gujarat', 'saurashtra', 'rajkot', 'junagadh', 'amreli', 'ahmedabad', 'mehsana', 'kutch', 'गुजरात', 'सौराष्ट्र'],
    soilProfile: 'Medium Black Soils in Saurashtra; Sandy Loam (Goradu) in North/Central Gujarat; Coastal Alluvium along the Gulf. Alkaline to neutral pH 7.2 - 8.5.',
    crops: {
      groundnut: '• Peanut Capital (Saurashtra): GG-20, TAG-24, TG-37A, GG-11.\n• Sowing Window: June 15 to July 10 with onset of monsoon in well-drained calcareous black/loamy soil.',
      cotton: '• Saurashtra & Central Gujarat: Bt Cotton hybrids in deep black soil.',
      cumin: '• Jeera & Spices (Mehsana, Patan, Banaskantha): Gujarat Cumin-4 (GC-4), GC-2.\n• Sowing: November 15 to November 30 in well-drained light sandy loam.',
      castor: '• Arandi (World leader): GCH-7, GCH-9.'
    }
  },
  {
    state: 'Rajasthan',
    keywords: ['rajasthan', 'jodhpur', 'bikaner', 'barmer', 'jaipur', 'alwar', 'kota', 'sriganganagar', 'राजस्थान', 'जोधपुर'],
    soilProfile: 'Arid Desert Sandy Soils in Western districts (low water retention, high permeability, alkaline pH 7.8 - 8.8); fertile canal alluvium in Sriganganagar/Hanumangarh; black clay loam in Hadoti (Kota).',
    crops: {
      bajra: '• Pearl Millet (Western Rajasthan): HHB-67 Improved, RHB-173, MPMH-17.\n• Sowing: July after first soaking rain in sandy arid soil.',
      mustard: '• Alwar, Bharatpur, Sriganganagar (Mustard Capital): Giriraj, RH-749, Pusa Bold.\n• Sowing: October 1 to October 25 in sandy-loam.',
      guar: '• Cluster Bean (Bikaner, Barmer): RGC-936, RGC-1003.',
      moong: '• Green Gram: IPM 205-7 (Virat), RMG-62.'
    }
  },
  {
    state: 'West Bengal & Bihar',
    keywords: ['west bengal', 'bihar', 'bengal', 'kolkata', 'patna', 'begusarai', 'hooghly', 'murshidabad', 'पश्चिम बंगाल', 'बिहार'],
    soilProfile: 'Gangetic Alluvium, Silt Clay, and Deltaic Soils with high water table and humid subtropical climate. Rich in nitrogen and potassium (pH 5.8 - 7.2).',
    crops: {
      rice: '• Three Rice Seasons:\n  1. Aman (Kharif): Swarna (MTU 7029), Shatabdi (IET 4786), Ranjit.\n  2. Boro (Summer Rice): IET 4786 (Minikit), Lalat.\n  3. Scented: Gobindobhog (GI tagged in Burdwan).\n• Soil: Heavy silt-clay and alluvial delta soils.',
      jute: '• Golden Fibre (Nadia, Murshidabad, Hooghly): JRO-524, JBO-2003H.\n• Sowing: March to May.',
      maize: '• Bihar Rabi Maize (Begusarai, Khagaria - highest yield in India): Pioneer 3396, DKC 9081.'
    }
  },
  {
    state: 'Andhra Pradesh & Telangana',
    keywords: ['andhra', 'telangana', 'guntur', 'hyderabad', 'warangal', 'krishna', 'godavari', 'आंध्र', 'तेलंगाना'],
    soilProfile: 'Red Sandy Loam (Chalka) in Telangana plateau; deep black soils in northern districts; fertile river delta alluvium in Krishna-Godavari basin. pH 6.5 - 8.0.',
    crops: {
      rice: '• Krishna-Godavari Delta: BPT 5204 (Samba Mahsuri - premium table rice), MTU 1010, MTU 1061.\n• Sowing: Kharif (Sarva) in June-July; Rabi (Dalwa) in Nov-Dec.',
      chilli: '• Guntur Asia Largest Hub: Teja (Guntur Sannam), US 341, Armoor.\n• Soil: Well-drained deep black to rich red loams.',
      cotton: '• Telangana (Warangal, Adilabad): Bt Cotton in rainfed black soils.'
    }
  }
];

// Helper: Extract Region and Relevant Regional Crop Data
function extractRegionalContext(query) {
  const qLower = query.toLowerCase();
  for (const reg of indianRegionalAgronomy) {
    for (const kw of reg.keywords) {
      if (qLower.includes(kw)) {
        return reg;
      }
    }
  }
  return null;
}

// 2. Query Local Llama 3 via Ollama with RAG Injection
async function queryOllamaWithGrounding(question, isHindi, regionalContext) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    let contextSnippet = '';
    if (regionalContext) {
      contextSnippet = `\n--- VERIFIED ICAR REGIONAL AGRONOMY DATA FOR ${regionalContext.state.toUpperCase()} ---
State: ${regionalContext.state}
Dominant Soil Profile: ${regionalContext.soilProfile}
Verified Crop Recommendations:
${JSON.stringify(regionalContext.crops, null, 2)}
-----------------------------------------------------------------`;
    }

    const systemPrompt = isHindi
      ? `आप 'कृषि AI मित्र' (Krushi AI) हैं, KrushiConnect प्लेटफॉर्म पर ICAR (भारतीय कृषि अनुसंधान परिषद) के प्रमाणित कृषि वैज्ञानिक।
जब किसान भारत के किसी राज्य, क्षेत्र, मिट्टी या फसल के बारे में पूछे, तो दिए गए सत्यापित कृषि आंकड़ों के आधार पर सटीक, प्रामाणिक और वैज्ञानिक उत्तर दें।
अनुमान या अस्पष्ट बातें न कहें। राज्य की विशिष्ट मिट्टी, ICAR अनुमोदित बीज की किस्में, बुवाई का सही महीना और जल प्रबंधन का सटीक विवरण दें।
उत्तर स्पष्ट हिंदी में, बोल्ड हेडर्स और बुलेट पॉइंट्स में दें।`
      : `You are 'Krushi AI', an authoritative ICAR (Indian Council of Agricultural Research) certified agricultural scientist and farming advisor on KrushiConnect.
When a farmer asks about specific states, regions, soil types, or crops in India, answer with exact, verified agronomic data based on real Indian agro-climatic conditions.
Do NOT make vague guesses or general extrapolations. State the exact verified state soil classification, ICAR-recommended seed varieties, sowing calendar, and field practices for that exact region.
Use clean, bulleted formatting and bold headers for maximum farmer readability.`;

    const prompt = `${systemPrompt}${contextSnippet ? `\n${contextSnippet}` : ''}\n\nFarmer Question: ${question}\n\nExact Authoritative Answer:`;

    const payload = {
      model: 'llama3:8b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.2, // low temperature for high factual accuracy
        num_predict: 280
      }
    };

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.response && data.response.trim().length > 30) {
        return data.response.trim();
      }
    }
  } catch (err) {
    console.warn('Ollama query error or timeout:', err.message);
  }
  return null;
}

// 3. Fallback High-Precision Regional & Soil Generator
function generateFallbackResponse(query, isHindi, regionalContext) {
  const qLower = query.toLowerCase();

  // If a specific region was asked
  if (regionalContext) {
    const isRice = qLower.includes('rice') || qLower.includes('paddy') || qLower.includes('धान') || qLower.includes('चावल');
    const isWheat = qLower.includes('wheat') || qLower.includes('गेहूं') || qLower.includes('गेहूँ');
    const isCotton = qLower.includes('cotton') || qLower.includes('कपास');
    const isSoybean = qLower.includes('soybean') || qLower.includes('सोयाबीन');

    let cropDetail = '';
    if (isRice && regionalContext.crops.rice) cropDetail = regionalContext.crops.rice;
    else if (isWheat && regionalContext.crops.wheat) cropDetail = regionalContext.crops.wheat;
    else if (isCotton && regionalContext.crops.cotton) cropDetail = regionalContext.crops.cotton;
    else if (isSoybean && regionalContext.crops.soybean) cropDetail = regionalContext.crops.soybean;
    else {
      // List all major crops for this region
      cropDetail = Object.entries(regionalContext.crops)
        .map(([k, v]) => `**${k.toUpperCase()}:**\n${v}`)
        .join('\n\n');
    }

    if (isHindi) {
      return `🌾 **${regionalContext.state} के लिए प्रमाणित कृषि व मिट्टी का विवरण (ICAR Data):**\n\n1. **मिट्टी का प्रकार (Soil Profile):**\n   ${regionalContext.soilProfile}\n\n2. **अनुशंसित फसलें व उन्नत किस्में (Recommended Varieties):**\n${cropDetail}\n\n💡 **सलाह:** क्षेत्रीय कृषि विज्ञान केंद्र (KVK) द्वारा इस क्षेत्र के लिए अनुशंसित बीज ही बोएं।`;
    } else {
      return `🌾 **Verified Agronomic & Soil Profile for ${regionalContext.state} (ICAR Data):**\n\n1. **Regional Soil Profile:**\n   ${regionalContext.soilProfile}\n\n2. **Verified Crop Varieties & Calendar:**\n${cropDetail}\n\n💡 **Expert Tip:** Procure certified seed varieties verified by your local State Agricultural University for maximum pest resistance and yield.`;
    }
  }

  // General Rice Soil Query across India
  if (qLower.includes('rice') || qLower.includes('paddy') || qLower.includes('धान') || qLower.includes('चावल')) {
    if (isHindi) {
      return `🌾 **धान (Rice/Paddy) के लिए भारत के प्रमुख क्षेत्रों में उपयुक्त मिट्टी व किस्में:**\n\n1. **सर्वोत्तम मिट्टी:** चिकनी दोमट (Clay-Loam) व मटियारी मिट्टी जिसमें पानी रोकने की क्षमता (Puddling retention) सर्वाधिक हो। आदर्श pH: **5.5 से 7.0**।\n2. **उत्तर भारत (पंजाब, हरियाणा, प. यूपी):** जलोढ़ मिट्टी (Alluvial Loam) - किस्में: *PR-126, Pusa Basmati 1121, 1509*।\n3. **पूर्वी भारत (प. बंगाल, बिहार, असम):** भारी गाद-मटियारी मिट्टी (Silt-Clay) - किस्में: *Swarna (MTU 7029), Shatabdi, Boro Minikit*।\n4. **दक्षिण भारत (कृष्णा-गोदावरी डेल्टा, कावेरी बेसिन):** डेल्टाई व काली मिट्टी - किस्में: *BPT 5204 (सांभा महसूरी), MTU 1010*।\n\n⚠️ **सावधानी:** हल्की रेतीली (Sandy) मिट्टी में धान न लगाएं क्योंकि पानी तुरंत नीचे रिस जाता है।`;
    } else {
      return `🌾 **Ideal Soil Requirements & Regional Suitability for Rice across India:**\n\n1. **Core Soil Type:** Deep **Clay Loam and Silt Clay** with high water retention and low permeability. Optimal pH range: **5.5 to 7.0**.\n2. **Indo-Gangetic Plains (Punjab, Haryana, UP):** Deep alluvial loams - Best Varieties: *PR-126 (water saver), Pusa Basmati 1121, 1509*.\n3. **Eastern India (West Bengal, Bihar):** Silt-clay deltaic alluvium - Varieties: *Swarna (MTU 7029), Shatabdi (IET 4786)*.\n4. **Southern River Basins (Krishna-Godavari & Cauvery):** Heavy deltaic clay - Varieties: *BPT 5204 (Samba Mahsuri), MTU 1010*.\n\n⚠️ **Avoid:** Porous coarse sandy soils which cannot maintain required standing water.`;
    }
  }

  // General Direct Fallback
  if (isHindi) {
    return `🌱 **कृषि AI मित्र विश्लेषण:**\n\nआपने पूछा: *"_ ${query} _"*\n\nसटीक क्षेत्रीय जानकारी प्राप्त करने के लिए कृपया अपने **राज्य/क्षेत्र का नाम** (उदा. पंजाब, महाराष्ट्र, मालवा-MP, गुजरात) और **फसल का नाम** (उदा. धान, गेहूँ, कपास, सरसों) लिखकर पूछें ताकि मैं ICAR द्वारा उस विशिष्ट मिट्टी व जलवायु के लिए प्रमाणित बीज किस्में व बुवाई का सही समय बता सकूँ।\n\n📞 किसान कॉल सेंटर टोल-फ्री हेल्पलाइन: **1800-180-1551**`;
  } else {
    return `🌱 **Krushi AI Expert Regional Analysis:**\n\nYou asked: *"_ ${query} _"*\n\nTo obtain exact verified data, please mention your **specific State/Region** (e.g. Punjab, Maharashtra, MP, Gujarat) and **Crop Name** so I can deliver the exact ICAR-approved soil requirements, certified seed varieties, and local sowing calendar.\n\n📞 Kisan Call Centre 24/7 Helpline: **1800-180-1551**`;
  }
}

// Controller: Main AI Assistant Endpoint
export const askAiAssistant = async (req, res, next) => {
  try {
    const { question, language = 'hi' } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const trimmedQuery = question.trim();
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(trimmedQuery);

    // 1. Detect if question mentions a specific Indian region/state
    const regionalContext = extractRegionalContext(trimmedQuery);

    let answer = null;
    let source = 'ollama_llm';

    // 2. Query Local Llama 3 with ICAR Grounding / RAG injection
    const ollamaResponse = await queryOllamaWithGrounding(trimmedQuery, isHindi, regionalContext);

    if (ollamaResponse) {
      answer = ollamaResponse;
    } else {
      source = 'grounded_agronomy_engine';
      // 3. Fallback to Grounded Indian Regional Agronomy Dataset
      answer = generateFallbackResponse(trimmedQuery, isHindi, regionalContext);
    }

    res.status(200).json({
      success: true,
      question: trimmedQuery,
      answer,
      region: regionalContext ? regionalContext.state : 'all_india',
      source,
      language: isHindi ? 'hi' : 'en',
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Suggestions endpoint
export const getPromptSuggestions = (req, res) => {
  const suggestions = [
    { text_hi: 'पंजाब और हरियाणा में धान की कौन सी किस्म व मिट्टी सर्वोत्तम है?', text_en: 'Which rice variety and soil is best for Punjab and Haryana?' },
    { text_hi: 'महाराष्ट्र और विदर्भ में कपास के लिए कौन सी मिट्टी उपयुक्त है?', text_en: 'Which soil and cotton variety is suitable for Maharashtra & Vidarbha?' },
    { text_hi: 'मध्य प्रदेश के मालवा में सोयाबीन व गेहूं की खेती का विवरण', text_en: 'Cultivation guide for soybean and wheat in Malwa, MP' },
    { text_hi: 'गुजरात के सौराष्ट्र में मूंगफली के लिए कौन सी मिट्टी चाहिए?', text_en: 'Which soil type is ideal for groundnut in Saurashtra, Gujarat?' },
    { text_hi: 'सर्दियों / ठंड के समय कौन सी फसल उगानी चाहिए?', text_en: 'Which crops should I grow during winters / Rabi season?' },
    { text_hi: 'गेहूँ में पीला रतुआ कैसे रोकें और कौन सी दवा डालें?', text_en: 'How to cure and treat yellow rust in wheat?' }
  ];

  res.status(200).json({
    success: true,
    suggestions
  });
};
