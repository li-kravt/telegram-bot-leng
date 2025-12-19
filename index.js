import "dotenv/config"
import {Bot, GrammyError, HttpError, session} from "grammy"


const bot = new Bot(process.env.BOT_TOKEN)

bot.use(
  session({
    initial: () => ({
      storage: [],
      userName: ""
    })
  })
);

bot.api.setMyCommands([
  {command: "start",
    description: "start Bot"
  },
  {command: "vacabulary",
    description: "show all vocabulary"
  },
  {command: "clear",
    description: "clear vocabulary"
  },
])

bot.command("start", async (ctx) => {
  ctx.session.userName = ""
  await ctx.reply("Hi, I'm anki bot\nWhat is your name?", {parse_mode:"MarkdownV2"})
})


bot.command("vacabulary", async (ctx) => {
   if (storage.length === 0) {
        await ctx.reply("storage is empty")
        return
      }
      await ctx.reply(storage.join("\n"), {parse_mode: "HTMl"})
      return
})

bot.command("clear", async (ctx) => {
  storage = [];
      await ctx.reply("storage has cleaned")
})

bot.command("myName", async (ctx) => {
  await ctx.reply(ctx.session.userName)
})

bot.hears("ping", async (ctx) => {
  await ctx.reply("pong")
})

bot.on([":voice", ":media", "::email", "::url"], async (ctx) => {
      await ctx.reply("I cannot read this kind of messages") 
})

bot.on("msg", async (ctx) => {
  const text = ctx.message.text
  console.log(ctx.session)

    if (!ctx.session.userName) {
      ctx.session.userName = text;
      await ctx.reply(`Nice to meet you, ${ctx.session.userName}`)
      return
    } else {
      ctx.session.storage.push(text)
      console.log(ctx)
      await ctx.reply(`You added: *${(text)}*`, { parse_mode: "MarkdownV2",
        reply_parameters: {message_id: ctx.msg.message_id}
       }) 
       await ctx.react("👍")
      }
})


bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start()