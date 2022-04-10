const { MessageEmbed } = require('discord.js')
const fs = require('fs');

module.exports = {
    async moneyalart(client, targetId, value, name, state)
    {
        if(state)
        {
            const targetuser = client.users.cache.get(targetId)
            const embed3 = new MessageEmbed()
                .setTitle('입금 알림 🔔')
                .setDescription(`${name} 님이 ${value} 포인트 를 입금했습니다`)
                .setColor('#20E86A')
            targetuser.send({ embeds: [embed3] })
        }
        else
        {
            const targetuser = client.users.cache.get(targetId)
            const embed3 = new MessageEmbed()
                .setTitle('출금 알림 🔔')
                .setDescription(`${name} 님이 ${value} 포인트 를 출금했습니다`)
                .setColor('#FC5E5B')
            targetuser.send({ embeds: [embed3] })
        }
    }
}