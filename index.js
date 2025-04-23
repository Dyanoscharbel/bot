const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GEMINI_API_KEY = 'AIzaSyCdRtUKHW2fDpeWw5NvWGfiCnT9auIxjBU';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📱 Scanne le QR code avec ton téléphone');
});

client.on('ready', () => {
  console.log('✅ Le bot est connecté et prêt !');
});

client.on('message', async (message) => {
    const userMessage = message.body.trim();
    console.log("Message reçu :", userMessage);
  
    // Filtrer les messages qui commencent par "Gemini "
    if (!userMessage.toLowerCase().startsWith("gemini ")) return;
  
    // Supprimer "Gemini " du message pour ne garder que la question
    const question = userMessage.slice(7).trim();
  
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      });
  
      const data = await response.json();
      console.log("Réponse brute Gemini :", data);
  
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      if (botReply) {
        message.reply(botReply);
      } else {
        message.reply("Je n'ai pas pu générer de réponse 😕.");
      }
    } catch (err) {
      console.error("Erreur Gemini:", err);
      message.reply("Une erreur est survenue avec l'IA.");
    }
  });
  

client.initialize();
