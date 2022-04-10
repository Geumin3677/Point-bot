const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const fs = require('fs');
const msg = require('../Functions/Msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('포인트-지급')
		.setDescription('특정 대상에게 포인트를 지급 합니다')
        .setDefaultPermission(false)
        .addUserOption(option => option.setName('대상').setDescription('지급 대상').setRequired(true))
        .addNumberOption(option => option.setName('금액').setDescription('대상에게 지급할 금액').setRequired(true)),

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

        var targetId = interaction.options._hoistedOptions[0].user.id
        var value = interaction.options._hoistedOptions[1].value
        var targetName = `${interaction.options._hoistedOptions[0].user.username}#${interaction.options._hoistedOptions[0].user.discriminator}`

        //송금 대상이 봇이 아닌지
        if(!interaction.options._hoistedOptions[0].user.bot)
        {
            //송금 대상이 서비스에 가입 되어있는지 확인
            if(!(targetId in data.Users))
            {
                //가입 되어 있지 않다면 가입
                await join.CreateNewUserData(targetId, client)
                //Data.json 파일 다시 불러오기
                jsonBuffer = fs.readFileSync('./lib/Data.json')
                dataJson = jsonBuffer.toString();
                data = JSON.parse(dataJson);
            }
            //Data에서 포인트 지급
            data.Users[targetId].point += value
            const datastr = JSON.stringify(data, null, '\t');
            fs.writeFileSync('./lib/Data.json', datastr);                     

            const name = `${interaction.user.username}#${interaction.user.discriminator}`
            msg.moneyalart(client, targetId, value, name, 1)

            const embed2 = new MessageEmbed()
                .setTitle('지급 성공 ✅')
                .setDescription(`${targetName} 님에게 ${value} 포인트 를 지급했습니다`)
                .addField('대상', targetName, true)
                .addField('금액', `${value}원`, true)
                .setColor('#20E86A')
            await interaction.reply({ embeds: [embed2] })
        }
        else
        {
            //오류 표출
            const embed = new MessageEmbed()
                .setTitle('지급 실패 ❌')
                .addField('사유', '봇에게 지급할수 없습니다.')
                .setColor('#FC5E5B')
            await interaction.reply({ embeds: [embed] });
        }
    }
}