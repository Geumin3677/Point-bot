const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const fs = require('fs');
const msg = require('../Functions/Msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('역할-구매-자판기설치')
		.setDescription('역할구매 자판기를 설치합니다.'),

	async execute(interaction, client) {

        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        const guild = client.guilds.cache.get('956475077824753674')
        const role1 = guild.roles.cache.find(r => r.id === data.Settings.firstRole)
        const role2 = guild.roles.cache.find(r => r.id === data.Settings.secondRole)

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('buy')
					.setLabel('역할 구매하기')
					.setStyle('PRIMARY'),
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('역할 상점')
			.setDescription(`${role1} >> 1000포인트\n${role1} -> ${role2} >> 500포인트`);

        interaction.reply({ content: '설치 완료', ephemeral: true });
		interaction.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'buy';

        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.customId === 'buy') {
                if(!(i.user.id in data.Users))
                { 
                    //가입 되어 있지 않다면 가입
                    await join.CreateNewUserData(i.user.id, client)
                    //Data.json 파일 다시 불러오기
                    jsonBuffer = fs.readFileSync('./lib/Data.json')
                    dataJson = jsonBuffer.toString();
                    data = JSON.parse(dataJson);
                }
                //@GOTMANI 가 있다면
                if(i.member.roles.cache.some(role => role.id === data.Settings.secondRole))
                {
                    const embed = new MessageEmbed()
                        .setTitle('역할 구매 실패 ❌')
                        .addField('사유', '이미 최고 역할을 가지고 있습니다.')
                        .setColor('#FC5E5B')
                    await i.reply({ embeds: [embed], ephemeral: true })
                }
                //@GAMANI 가 있다면
                else if(i.member.roles.cache.some(role => role.id === data.Settings.firstRole))
                {
                    //@GOTMANI 구매
                    //잔액 확인
                    if(500 <= data.Users[i.user.id].point)
                    {
                        //Data에서 포인트 차감
                        data.Users[i.user.id].point -= 500
                        data.Users[i.user.id].step = 2
                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/Data.json', datastr);                     

                        const name = `${i.user.username}#${i.user.discriminator}`
                        msg.moneyalart(client, i.user.id, 500, '역할 구매 상점', 0)

                        i.member.roles.add(role2)
                        i.member.roles.remove(role1)
                        

                        const embed2 = new MessageEmbed()
                            .setTitle('역할 구매 성공 ✅')
                            .setDescription(`${name} 님이  ${role2}을 구매 하셨습니다!`)
                            .setColor('#20E86A')
                        await i.reply({ embeds: [embed2], ephemeral: true })
                    }
                    else
                    {
                        //구매 실패
                        const embed = new MessageEmbed()
                            .setTitle('역할 구매 실패 ❌')
                            .addField('사유', '잔액이 부족합니다.')
                            .setColor('#FC5E5B')
                        await i.reply({ embeds: [embed], ephemeral: true })
                    }
                }
                //아무것도 없다면
                else
                {
                    //@GAMANI 구매
                    //잔액 확인
                    if(1000 <= data.Users[i.user.id].point)
                    {
                        //Data에서 포인트 차감
                        data.Users[i.user.id].point -= 1000
                        data.Users[i.user.id].step = 1
                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/Data.json', datastr);                     

                        const name = `${i.user.username}#${i.user.discriminator}`
                        msg.moneyalart(client, i.user.id, 1000, '역할 구매 상점', 0)

                        i.member.roles.add(role1)

                        const embed2 = new MessageEmbed()
                            .setTitle('역할 구매 성공 ✅')
                            .setDescription(`${name} 님이  ${role1}을 구매 하셨습니다!`)
                            .setColor('#20E86A')
                        await i.reply({ embeds: [embed2], ephemeral: true })
                    }
                    else
                    {
                        //구매 실패
                        const embed = new MessageEmbed()
                            .setTitle('역할 구매 실패 ❌')
                            .addField('사유', '잔액이 부족합니다.')
                            .setColor('#FC5E5B')
                        await i.reply({ embeds: [embed], ephemeral: true })
                    }
                }
            }
        });
    }
}