const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

const join = require('../Functions/Newbie.js')

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {

	data: new SlashCommandBuilder()
		.setName('잔액')
		.setDescription('포인트 잔액을 확인합니다.'),

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
        
        //잔액 전송
        const embed = new MessageEmbed()
            .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 잔액`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .addField('잔여 포인트', `${data.Users[interaction.user.id].point}원`, false)
            .setColor('#315CE8')
        await interaction.reply({ embeds: [embed] })     
	}
}