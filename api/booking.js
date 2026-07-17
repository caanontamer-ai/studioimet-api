export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method Not Allowed",
        })
    }

    try {
        const {
            fullName,
            contact,
            dateTime,
            purpose,
            comment,
            equipment,
        } = req.body

        const message = `
🎬 <b>Новая заявка на бронирование</b>

👤 <b>ФИО:</b>
${fullName}

📞 <b>Контакт:</b>
${contact}

📅 <b>Дата:</b>
${dateTime}

🎯 <b>Цель:</b>
${purpose}

💬 <b>Комментарий:</b>
${comment || "-"}

📦 <b>Оборудование:</b>

${equipment}
`

        const telegram = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                }),
            }
        )

        if (!telegram.ok) {
            throw new Error("Telegram Error")
        }

        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            success: false,
            error: err.message,
        })
    }
}
