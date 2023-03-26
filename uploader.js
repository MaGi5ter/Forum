let index = require('./index')
let client = index.client
const config = require('./config.json')
const {MessageAttachment} = require('discord.js')

client.channels.fetch(config.channel)

function uploadImageToDiscord(blob) {
    return new Promise((resolve, reject) => {
      const channel = client.channels.cache.get(config.channel);
      const attachment = new MessageAttachment(blob, 'image.png');
  
      channel.send({ files: [attachment] })
        .then(message => {
            const attachmentUrl = message.attachments.first().url;
            resolve(attachmentUrl);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = uploadImageToDiscord