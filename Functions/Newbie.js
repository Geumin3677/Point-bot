const { MessageEmbed } = require('discord.js')
const fs = require('fs');

module.exports = {
    async CreateNewUserData(targetId, client){
        //Data.json 파일 불러오기
        const jsonBuffer = fs.readFileSync('./lib/Data.json')
        const dataJson = jsonBuffer.toString();
        const data = JSON.parse(dataJson);

        const user = client.users.cache.find(user => user.id === targetId)
        //신규 유저 생성
        data.Users[targetId] = {
            point : 0,
            logs : {
                tweet : 0,
                fan_art : false,
                sns_post : false
            },
            wallet : "",
            name : `${user.username}#${user.discriminator}`,
            step : 0
        }
        const datastr = JSON.stringify(data, null, '\t');
        fs.writeFileSync('./lib/Data.json', datastr);
    }
}