const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitFeild,Permissions } = require('discord.js');
const { getUUID, getProfile } = require('mojang');

// Create a new Discord client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'check') {
        const username = args[0];
        if (!username) {
            return message.reply('Please provide a Minecraft username.');
        }

        try {
            const validUsername = await is_valid_minecraft_username(username);
            if (validUsername) {
                message.channel.send(`${username} is a valid Minecraft username.`);
                const uuid = await getUUID(username);
                if (uuid) {
                    message.channel.send(`${username}'s UUID is ${uuid}`);
                    const profile = await getProfile(uuid);
                    message.channel.send(`${username}'s skin URL is ${profile.skinURL}`);
                    message.channel.send(`${username}'s skin variant is ${profile.skinVariant}`);
                    message.channel.send(`${username}'s cape URL is ${profile.capeURL}`);
                } else {
                    message.channel.send(`${username} is not a taken username.`);
                }
            } else {
                message.channel.send(`${username} is not a valid Minecraft username.`);
            }
        } catch (error) {
            console.error('Error:', error);
            message.channel.send('An error occurred while checking the Minecraft username.');
        }
    }
});

async function is_valid_minecraft_username(username) {
    try {
        const profile = await getProfile(username);
        return !!profile;
    } catch (error) {
        if (error.code === 204) {
            return false;
        } else {
            throw error;
        }
    }
}

// Login to Discord with your app's token
client.login('MTIxNDU4MzM4MDM0ODM3OTE2Ng.GDHWyg.vQ_MaCt09LFYLJYdFqz4x7RgIa6CE1KALIJiIA');
