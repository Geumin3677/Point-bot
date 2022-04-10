const { MessageEmbed } = require('discord.js')
const fs = require('fs');

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    async updateloop(client) {
        const date = new Date()

        //Data.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/Data.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);
        if(date.getDate() != data.log.dateOld)
        {
            console.log('dayChanged')
            data.log.dateOld = date.getDate()
            for(user of Object.keys(data.Users))
            {
                data.Users[user].logs.tweet = 0
            }
            const datastr = JSON.stringify(data, null, '\t');
            fs.writeFileSync('./lib/Data.json', datastr); 
        }
        sleep(30000)
    }
}