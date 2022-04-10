const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/Msg.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('동전던지기')
		.setDescription('동전던지기 게임을 합니다.')
        .addNumberOption(option => option.setName('배팅-금액').setDescription('배팅할 금액').setRequired(true))
        .addStringOption(option =>
            option.setName('결과-선택')
                .setDescription('배팅할 결과')
                .addChoice('앞면', 'front')
                .addChoice('뒷면', 'back')
                .setRequired(true)),
                

	async execute(interaction, client) {
        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        if(interaction.channelId == data.Settings.Channels.minigame)
        {
            if(!(interaction.user.id in data.Users))
            { 
                //가입 되어 있지 않다면 가입
                await join.CreateNewUserData(interaction.user.id, client)
                //Data.json 파일 다시 불러오기
                jsonBuffer = fs.readFileSync('./lib/Data.json')
                dataJson = jsonBuffer.toString();
                data = JSON.parse(dataJson);
            }
    
            const batting = interaction.options._hoistedOptions[0].value
    
            if(batting <= data.Users[interaction.user.id].point)
            {
                if(Math.random() >= 0.55)
                {
                    //예상 성공
                    data.Users[interaction.user.id].point += (batting * 0.95)
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Data.json', datastr);
    
                    await msg.moneyalart(client, interaction.user.id, (batting * 0.95), '동전던지기', 1)
    
                    const embed = new MessageEmbed()
                        .setTitle('예측 성공 ✅')
                        .setDescription(`${(batting * 0.95)}포인트 가 입금 되었습니다.`)
                        .setColor('#20E86A')
                    await interaction.reply({ embeds: [embed] })
                }
                else
                {
                    //예상 실패
                    data.Users[interaction.user.id].point -= batting
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Data.json', datastr);
    
                    await msg.moneyalart(client, interaction.user.id, batting, '동전던지기', 0)
    
                    const embed = new MessageEmbed()
                        .setTitle('예측 실패 ❌')
                        .setDescription(`${batting}포인트 를 잃었습니다.`)
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] })
                }
            }
            else
            {
                //배팅 실패
                const embed = new MessageEmbed()
                    .setTitle('배팅 실패 ❌')
                    .addField('사유', '잔액이 부족합니다.')
                    .setColor('#FC5E5B')
                await interaction.reply({ embeds: [embed] })
            }
        }
        else
        {
            //배팅 실패
            const embed = new MessageEmbed()
                .setTitle('게임 시작 실패 ❌')
                .addField('사유', '게임 채널이 아닙니다.')
                .setColor('#FC5E5B')
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}