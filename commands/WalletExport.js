const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('지갑-txt내보내기')
		.setDescription('등록된 지갑들을 txt 파일로 내보냅니다')
        .setDefaultPermission(false),

	async execute(interaction, client) {
        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        var ctx1 = ''

        for(user of Object.keys(data.Users))
        {
            if(data.Users[user].step == 1 && data.Users[user].wallet != '')
            {
                ctx1 += `${data.Users[user].name}    ${data.Users[user].wallet}\n`
            }
        }

        fs.writeFile('./tmp/wallet_GAMANI.txt', ctx1, 'utf8', function(){ });

        var ctx2 = ''

        for(user of Object.keys(data.Users))
        {
            if(data.Users[user].step == 2 && data.Users[user].wallet != '')
            {
                ctx2 += `${data.Users[user].name}    ${data.Users[user].wallet}\n`
            }
        }

        fs.writeFile('./tmp/wallet_GODMANI.txt', ctx2, 'utf8', function(){ });

        interaction.reply('내보내기 성공')
        interaction.channel.send({ files: ["./tmp/wallet_GAMANI.txt"] })
        interaction.channel.send({ files: ["./tmp/wallet_GODMANI.txt"] })
    }
}