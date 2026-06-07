// api/generate-image.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method tidak diizinkan' });
    }

    const { kategori, merk } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key OpenAI belum dikonfigurasi.' });
    }

    const prompt = `A professional product photography of a modern laptop branded ${merk || 'generic'}, setup for ${kategori} environment, clean studio lighting, 4k resolution, photorealistic.`;

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error.message });
        }

        return res.status(200).json({ imageUrl: data.data[0].url });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
