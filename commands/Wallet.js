const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('지갑')
		.setDescription('지갑 관련 명령')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('등록')
                .setDescription('지갑을 등록 합니다.')
                .addStringOption(option => option.setName('지갑').setDescription('지갑 주소').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('확인')
                .setDescription('등록된 지갑을 확인 합니다.')),

	async execute(interaction, client) {
        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);
        if(!(interaction.user.id in data.Users))
        { 
            //가입 되어 있지 않다면 가입
            await join.CreateNewUserData(interaction.user.id, client)
            //Data.json 파일 다시 불러오기
            jsonBuffer = fs.readFileSync('./lib/Data.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }
        if(interaction.channelId == data.Settings.Channels.wallet_1 || interaction.channelId == data.Settings.Channels.wallet_2)
        {
            switch(interaction.options._subcommand)
            {
                case "등록":
                    const value = interaction.options._hoistedOptions[0].value
                    data.Users[interaction.user.id].wallet = value
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Data.json', datastr);
                    const embed = new MessageEmbed()
                        .setTitle('등록 성공 ✅')
                        .setDescription(`내 지갑 주소를 \`${data.Users[interaction.user.id].wallet}\` 로 설정했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed], ephemeral: true })
                    return 0
                case "확인":
                    if(data.Users[interaction.user.id].wallet != "")
                    {
                        const embed = new MessageEmbed()
                            .setTitle('내 지갑')
                            .setDescription(`${data.Users[interaction.user.id].wallet}`)
                            .setColor('#315CE8')
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                    }
                    else
                    {
                        const embed = new MessageEmbed()
                            .setTitle('조회 실패 ❌')
                            .addField('사유', '지갑이 등록되어 있지 않습니다.')
                            .setColor('#FC5E5B')
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                    }
                    return 0
            }
        }
        else
        {
            //명령 실패
            const embed = new MessageEmbed()
                .setTitle('명령 실패 ❌')
                .addField('사유', '지갑 등록/확인 채널이 아닙니다.')
                .setColor('#FC5E5B')
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
	}
}