
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(455).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key OpenAI belum dikonfigurasi di Vercel.' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Menggunakan model hemat biaya & cepat
                messages: [
                    { 
                        role: 'system', 
                        content: 'Anda adalah seorang pakar spesifikasi laptop komputer. Berikan rekomendasi tipe laptop spesifik (minimal 2 pilihan merek/tipe) beserta alasannya berdasarkan kebutuhan user secara ringkas, ramah, dan solutif menggunakan Bahasa Indonesia.' 
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        return res.status(200).json({ result: data.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
