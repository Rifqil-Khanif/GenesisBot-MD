import fetch from 'node-fetch';
import Sph from 'ytdl-mp3';

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
    // Verificar si el mensaje citado existe y contiene el resultado de "YouTube Play"
    if (!m.quoted) return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'));
    if (!m.quoted.text.includes("*`【Y O U T U B E - P L A Y】`*")) {
        return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'));
    }

    // Extraer URLs del mensaje citado
    let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]+)/, 'gi'));
    if (!urls) return conn.reply(m.chat, `Resultado no encontrado.`, m).then(() => m.react('✖️'));
    if (urls.length < text) return conn.reply(m.chat, `Resultado no encontrado.`, m).then(() => m.react('✖️'));

    let user = global.db.data.users[m.sender];
    let videoUrl = urls[0]; // Tomar el primer URL encontrado

    await m.react('🕓');

    try {
        // Segunda opción: Usar ytdl-mp3
        let cxf = await Sph.ytdl(videoUrl);
        let txt = `\`乂  Y O U T U B E  -  M P 3\`\n\n` +
                  `✩   *Título* : ${cxf.title}\n` +
                  `✩   *Calidad* : ${cxf.quality}\n` +
                  `✩   *Url* : ${cxf.url}\n\n` +
                  `>- 🤎 El audio se está enviando, espera un momento...`;

        // await conn.sendMessage(m.chat, { image: { url: cxf.thumbnail }, caption: txt }, { quoted: m });
        await conn.sendMessage(m.chat, { audio: { url: cxf.dl_url }, fileName: `${cxf.title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m });
        await m.react('✅');
    } catch (error2) {
        // Manejo de error final
        await m.react('✖️');
        return m.reply(`Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.`);
    }
};

handler.help = ['A'];
handler.tags = ['downloader'];
handler.customPrefix = /^(a|A)/; // Prefijo personalizado
handler.command = new RegExp();

export default handler;
