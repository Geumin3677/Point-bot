const { Client, Intents, Collection, MessageEmbed} = require('discord.js');
const { token } = require('./lib/config.json');
const fs = require('fs')
const msg = require('./Functions/Msg.js')
const join = require('./Functions/Newbie.js')
const loop = require('./Loop.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

//커맨드 로딩
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command)
}

//부팅시 로그
client.on('ready', () => {
	console.log('로그인 성공!');
	commandpermission()
	loop.updateloop()
});

async function commandpermission(){

	//Data.json 파일 불러오기
	var jsonBuffer = fs.readFileSync('./lib/Data.json')
	var dataJson = jsonBuffer.toString();
	var data = JSON.parse(dataJson);

	const role1 = data.Settings.firstRole
	const role2 = data.Settings.secondRole
	
	const permissions1_1 =  {
        id: role1,
        type: 'ROLE',
        permission: true,
    };
	const permissions1_2 =  {
        id: role2,
        type: 'ROLE',
        permission: true,
    };
	const permissions2 =  {
        id: '956476073040810064',
        type: 'ROLE',
        permission: true,
    };
	const guild = client.guilds.cache.get('956475077824753674')
		let commandsList = await guild.commands.fetch()
		commandsList.forEach(slashCommand => {
			if(slashCommand.name == '지갑')
			{
				guild.commands.permissions.set({
					command: slashCommand.id,
					permissions: [permissions1_1, permissions1_2, permissions2]
				});
			}
			else if(slashCommand.name == '포인트-지급')
			{
				guild.commands.permissions.set({
					command: slashCommand.id,
					permissions: [permissions2]
				});
			}
			else if(slashCommand.name == '지갑-txt내보내기')
			{
				guild.commands.permissions.set({
					command: slashCommand.id,
					permissions: [permissions2]
				});
			}
		});
}

async function missionReward(message){
	//Data.json 파일 불러오기
	var jsonBuffer = fs.readFileSync('./lib/Data.json')
	var dataJson = jsonBuffer.toString();
	var data = JSON.parse(dataJson);
	if(!(message.author.id in data.Users))
	{ 
		//가입 되어 있지 않다면 가입
		await join.CreateNewUserData(message.author.id, client)
		//Data.json 파일 다시 불러오기
		jsonBuffer = fs.readFileSync('./lib/Data.json')
		dataJson = jsonBuffer.toString();
		data = JSON.parse(dataJson);
	}

	switch(message.channel.id)
	{
		case data.Settings.Channels.tweet:
			if(data.Users[message.author.id].logs.tweet <= 1)
			{
				data.Users[message.author.id].logs.tweet += 1
				data.Users[message.author.id].point += data.Settings.tweetReward

				const datastr = JSON.stringify(data, null, '\t');
				fs.writeFileSync('./lib/Data.json', datastr);   

				msg.moneyalart(client, message.author.id, data.Settings.tweetReward, 'Admin', 1)

				const embed2 = new MessageEmbed()
					.setTitle('보상 지급 성공 ✅')
					.setDescription(`${data.Settings.tweetReward}포인트 의 보상이 지급 되었습니다!`)
					.setColor('#20E86A')
				await message.reply({ embeds: [embed2] })
			}
			else
			{
				const embed = new MessageEmbed()
					.setTitle('보상 지급 실패 ❌')
					.addField('사유', '오늘 이미 2번의 보상을 수령 하셨습니다')
					.setColor('#FC5E5B')
				await message.reply({ embeds: [embed] })
			}
			return 0
		case data.Settings.Channels.fan_art:
			if(!data.Users[message.author.id].logs.fan_art)
			{
				data.Users[message.author.id].logs.fan_art = true
				data.Users[message.author.id].point += data.Settings.fan_artReward

				const datastr = JSON.stringify(data, null, '\t');
				fs.writeFileSync('./lib/Data.json', datastr);   

				msg.moneyalart(client, message.author.id, data.Settings.fan_artReward, 'Admin', 1)

				const embed2 = new MessageEmbed()
					.setTitle('보상 지급 성공 ✅')
					.setDescription(`${data.Settings.fan_artReward}포인트 의 보상이 지급 되었습니다!`)
					.setColor('#20E86A')
				await message.reply({ embeds: [embed2] })
			}
			else
			{
				const embed = new MessageEmbed()
					.setTitle('보상 지급 실패 ❌')
					.addField('사유', '이미 1번의 보상을 수령 하셨습니다')
					.setColor('#FC5E5B')
				await message.reply({ embeds: [embed] })
			}
			return 0
		case data.Settings.Channels.sns_post:
			if(!data.Users[message.author.id].logs.sns_post)
			{
				data.Users[message.author.id].logs.sns_post = true
				data.Users[message.author.id].point += data.Settings.snsReward

				const datastr = JSON.stringify(data, null, '\t');
				fs.writeFileSync('./lib/Data.json', datastr);   

				msg.moneyalart(client, message.author.id, data.Settings.snsReward, 'Admin', 1)

				const embed2 = new MessageEmbed()
					.setTitle('보상 지급 성공 ✅')
					.setDescription(`${data.Settings.snsReward}포인트 의 보상이 지급 되었습니다!`)
					.setColor('#20E86A')
				await message.reply({ embeds: [embed2] })
			}
			else
			{
				const embed = new MessageEmbed()
					.setTitle('보상 지급 실패 ❌')
					.addField('사유', '이미 1번의 보상을 수령 하셨습니다')
					.setColor('#FC5E5B')
				await message.reply({ embeds: [embed] })
			}
			return 0
	}
}

//일반 메시지 감지 이벤트
client.on("messageCreate", (message) => {
	//봇인경우 반응하지 않음
	if (message.author.bot) return false;
	if(message.content.startsWith('https://twitter.com'))
	{
		missionReward(message)
	}
});

//명령어 이밴트 발생
client.on('interactionCreate', async interaction => {
    //커맨드가 아닐시 리턴
    if (!interaction.isCommand()) return;
    //커맨드 불러오기
	const command = client.commands.get(interaction.commandName);
    //존재하지 않는 커맨드일시 리턴
	if (!command) return;
    //커맨드 실행
	await command.execute(interaction, client);
});


client.login(token);