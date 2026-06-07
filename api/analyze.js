// api/analyze.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method tidak diizinkan' });
    }

    const { kategori, merk, budget } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key OpenAI belum dikonfigurasi di Vercel.' });
    }

    const prompt = `Berikan rekomendasi laptop spesifik (nama seri/tipe) berdasarkan data berikut:\n- Kategori Penggunaan: ${kategori}\n- Preferensi Merk: ${merk}\n- Maksimal Budget: Rp ${budget}\n\nBerikan 2-3 pilihan laptop terbaik beserta spesifikasi singkat dan alasan mengapa laptop tersebut cocok untuk budget dan kategori tersebut.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error.message });
        }

        return res.status(200).json({ answer: data.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
