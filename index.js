const Discord = require("discord.js");
const bot = new Discord.Client();

const prefix = "rg/"

const bdd = require("./bdd.json")

bot.on("message", message => {
  if(message.content.startsWith(bot.prefix + "userinfo")){
    if(message.mentions.users.first()){
      if(!bdd[message.guild.id]["warn"]){
        bdd[message.guild.id]["warn"] = {}
        Savebdd()
        if(!bdd[message.guild.id]["warn"][message.mentions.users.first().id]){
          bdd[message.guild.id]["warn"][message.mentions.users.first().id] = 0
          Savebdd()
        }
      }
      const userinfoembed = new Discord.MessageEmbed()
      .setTitle("Info de membre :")
      .addFields(
        { name: 'ID : ', value: message.mentions.users.first().id, inline: true },
        { name: 'NOM : ', value: message.mentions.users.first(), inline: true },
        { name: 'WARN : ', value: bdd[message.guild.id]["warn"][message.mentions.users.first().id], inline: true }
      )
    message.channel.send(userinfoembed)
    } else {
      message.reply(":x: Veuillez mentionner un utilisateur !");
    }
  }

  if (message.content.startsWith(bot.prefix + 'avatar')) {
  let user = message.mentions.users.first();
  if(!user) user = message.author;
  const avatarembed = new Discord.MessageEmbed()
    .setTitle("Voici l'avatar de cette personne !")
    .setImage(user.avatarURL())
    .setColor('#ff9900')
    .setThumbnail(user.avatarURL())
  message.channel.send(avatarembed)
 }

  if(message.content.startsWith(bot.prefix + "clear")){
        if(message.member.hasPermission('MANAGE_MESSAGES')){
	  message.delete();
          let args = message.content.trim().split(/ +/g)
           if(args[1]){
               if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){
                   //on effectue le clear

                  message.channel.bulkDelete(args[1])
                    message.channel.send(`**Vous avez supprimé ${args[1]} message(s)** :white_check_mark:`)
                    setTimeout(() => {
                      message.delete()
                    }, 3000)
                }
                else {
                    message.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
                }
            }
            else{
                message.channel.send(`Vous devez indiquer un nombre de messages à supprimer !`)
            }
        }
        else{
            message.channel.send("Vous devez avoir la permission `MANAGE_MESSAGES` pour exécuter cette commande !")
        }
  }

  if(message.content.startsWith(bot.prefix + "statsbot")){
        let totalservers = bot.guilds.cache.size;
	let name = bot.user.tag

        const statsbot = new Discord.MessageEmbed()
        //On créé un Embed contenant toutes les infos du serveur
	        .setColor('#ff9900')
	        .setTitle('Stats du bot')
            .setAuthor('Paulem79')
            .setURL('https://www.youtube.com/channel/UC_6kI0gHuyWZxrJ0fBj_kiQ?view_as=subscriber')
	        .setDescription('Voici les statistiques du bot')
	        .addFields(
           		{ name: 'Nombre de serveur où est le bot : ', value: totalservers, inline: true },
			{ name: 'Nom : ', value: name, inline: true }
	        )
	        .setTimestamp()
	        .setFooter('Par Paulem79');

        message.channel.send(statsbot)
        console.log("Serveurs totaux : " + totalservers + " Nom : " + name);
  }

  if(message.content.startsWith(bot.prefix + "warn")){
    if(!bdd[message.guild.id]["warn"]){
      bdd[message.guild.id]["warn"] = {}
      Savebdd()
    }
    if(message.member.hasPermission('BAN_MEMBERS')){
      if(!message.mentions.users.first()) return message.channel.send("**:x: Il faut indiquer une personne à warn !**")
      utilisateur = message.mentions.users.first().id
      if(bdd[message.guild.id]["warn"][utilisateur] == 2){
        delete bdd[message.guild.id]["warn"][utilisateur]
        const warnEmbed = new Discord.MessageEmbed()
        .setTitle("Ban")
        .setDescription(`Tu as été ban du serveur **${message.guild.name}** !`)
        .setColor('#ff9900')

        message.mentions.users.first().send(warnEmbed)
        message.guild.members.ban(utilisateur)
        message.channel.send("**L'utilisateur a bien été ban :white_check_mark:**")
      }
      else{
        if(!bdd[message.guild.id]["warn"][utilisateur]){
          bdd[message.guild.id]["warn"][utilisateur] = 1
          Savebdd();
          message.channel.send("**L'utilisateur a bien été averti :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
        }
        else{
          bdd[message.guild.id]["warn"][utilisateur]++
          Savebdd();
          message.channel.send("**L'utilisateur a bien été averti :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
        }
      }
    }
  }

    if(message.content.startsWith(bot.prefix + "unwarn")){
    if(!bdd[message.guild.id]["warn"]){
      bdd[message.guild.id]["warn"] = {}
      Savebdd()
    }
    if(message.member.hasPermission('BAN_MEMBERS')){
      if(!message.mentions.users.first()) return message.channel.send("**:x: Il faut indiquer une personne à unwarn !**")
      utilisateur = message.mentions.users.first().id
      if(bdd[message.guild.id]["warn"][utilisateur] == 2){
        bdd[message.guild.id]["warn"][utilisateur]--
        Savebdd()
        message.channel.send("**L'utilisateur a bien été unwarn :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
      }
      else{
        if(!bdd[message.guild.id]["warn"][utilisateur]){
          message.channel.send("**L'utilisateur n'a pas de warn !**")
        }
        else{
          bdd[message.guild.id]["warn"][utilisateur]--
          Savebdd();
          message.channel.send("**L'utilisateur a bien été unwarn :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
        }
      }
    }
  }

  if (message.content.startsWith(bot.prefix + 'kick')) {
    if(message.member.hasPermission('KICK_MEMBERS')){
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick(`Kické par ${message.member.author}`)
          .then(() => {
            message.reply(`**:white_check_mark: L'utilisateur ${user} a bien été kick**`)
          })
          .catch(err => {
            message.reply("**:x: Je n'ai pas pu kicker le membre**")
            console.error(err);
          });
      } else {
        message.reply("**:x: Cet utilisateur n'est pas dans cette guilde !**")
      }
    } else {
      message.reply("**:x: Vous devez mentionner un membre à kick !**")
    }
    }
  }

  if (message.content.startsWith(bot.prefix + 'ban')) {
    if(message.member.hasPermission('BAN_MEMBERS')){
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      let reason = `Banni par ${message.author}`
      if (member) {
        member
          .ban({
            reason: reason
          })
          .then(() => {
            message.reply(`**:white_check_mark: L'utilisateur ${user} a bien été banni**`)
          })
          .catch(err => {
            message.reply("**:x: Je n'ai pas pu bannir le membre**")
            console.error(err);
            message.channel.send("Raison : " + err)
          });
      } else {
        message.reply("**:x: Cet utilisateur n'est pas dans cette guilde !**")
      }
    } else {
      message.reply("**:x: Vous devez mentionner un utilisateur à bannir !**")
    }
    }
  }

  if(message.content.startsWith(bot.prefix + "ping")){
    message.channel.send("Pinging...").then(m =>{
      var ping = m.createdTimestamp - message.createdTimestamp;
      var embed = new Discord.MessageEmbed()
      .setAuthor(`Pong ! le ping est de ${ping}`)
      .setColor('#ff9900')
      m.edit(embed)
    })
  }

  if(message.content.startsWith(bot.prefix + "statsuser")){
    if(message.mentions.users.first()){
      const statsuser = new Discord.MessageEmbed()
      .setColor("#ff9900")
      .setTitle("Statistiques du membre :")
      .setAuthor("Paulem79")
      .setFooter("© Doomy Créer par Paulem79 Reproduction interdite")
      .setThumbnail('https://vectorified.com/images/discord-bot-icon-2.png')
      .setTimestamp(new Date())
      .addFields(
        { name: 'ID', value: "permet d'afficher ce message", inline: false },
      )
      message.channel.send(statsuser)
    }
  }
})

//****************Commande de fonction****************\\
function Savebdd() {
  fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
    if (err) message.channel.send("Une erreur est survenue.");
  });
}


bot.login(process.env.TOKEN)
