const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('순위')
		.setDescription('포인트 순위를 확인합니다.'),

	async execute(interaction, client) {
        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        var list = new Array()

        for(user of Object.keys(data.Users))
        {
            list.push({
                name : data.Users[user].name,
                point : data.Users[user].point
            })
        }

        list.sort(function (a,b){
            return a.point > b.point ? -1 : a.point < b.point ? 1 : 0; 
        });

        function minTwoDigits(n) {
            return (n < 10 ? '0' : '') + n;
        }
        const date = new Date()
        var message = `📈 \`${date.getFullYear()}/${minTwoDigits((date.getMonth() + 1))}/${minTwoDigits(date.getDate())} ${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}\` 포인트 보유 순위\n`

        message += '```xl\n'
        var cnt = 1
        for(item of list)
        {
            message += `#${cnt} ${item.name}    ${item.point} 포인트\n`
            cnt += 1
        }
        message += '\n```'

        interaction.reply(message)
    }
}