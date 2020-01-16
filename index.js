const telegraf = require('telegraf')
const data = require('./data.json')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const {leave} = Stage
const stage = new Stage()

// id va tokenlar
const admin = data.channel_id
const token = data.token

const bot = new telegraf(token) // token data.json da 

// kiritish uchun 
const getName = new Scene('getName')
stage.register(getName)
const getAge = new Scene('getAge')
stage.register(getAge)
const getCourse = new Scene('getCourse')
stage.register(getCourse)
const getDay = new Scene('getDay')
stage.register(getDay)
const getTime = new Scene('getTime')
stage.register(getTime)
const getNum = new Scene('getNum')
stage.register(getNum)
const check = new Scene('check')
stage.register(check)

bot.use(session())
bot.use(stage.middleware())

bot.hears('◀ Bosh menyu', (ctx) => {
    ctx.reply(
        'Ism-Familiyangizni  kiriting',
        { reply_markup: { remove_keyboard: true} }
    )
    ctx.scene.enter('getName')
})

bot.start((ctx) => {
    ctx.reply(
        `Salom, ${ctx.from.first_name}`+
        '\n\nIsm-Familiyangizni  kiriting',
        { reply_markup: { remove_keyboard: true} }
    )

    console.log(`ID: ${ctx.message.from.id}\nName: ${ctx.message.from.first_name}\nUsername: ${ctx.message.from.username}`);
    // console.log(`Message: ${ctx.message.text}`);
    
    ctx.scene.enter('getName')
})

// ismni kiritish
getName.command('start', async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getCourse')
    ctx.scene.enter('getName')
})

getName.on('text', async (ctx) => {
    if (ctx.message.text === '◀ Orqaga') {
        return ctx.reply( 'Siz registratsiyaning boshidasiz. Iltimos ism familiyangizni kiriting')
    }
  ctx.session.name = ctx.message.text
  ctx.reply(
      'Yoshingizni kiriting' +
      `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}`,
      { reply_markup: { keyboard: [[ `◀ Orqaga`]], resize_keyboard: true, on_time_keyboard: true }}
  )  
  await ctx.scene.leave('getName')
  ctx.scene.enter('getAge')
})

//yoshini kiritish
getAge.hears (/^[0-9]{2}$/, async (ctx) => {
    ctx.session.age = ctx.message.text
    ctx.reply(
        `Qanday kurslarda o'qimoqchisiz?` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getAge')
    ctx.scene.enter('getCourse')
} )

getAge.hears( '◀ Orqaga', async (ctx) => {
    ctx.reply(
        'Ism-Familiyangizni  kiriting',
        { reply_markup: { remove_keyboard: true} }
    )
    await ctx.scene.leave('getAge')
    ctx.scene.enter('getName')
})

getAge.on('text', async (ctx) => {
    ctx.reply (
        `Yoshingizni to'g'ri yozing. Namuna: 20` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
})

// Kurslarni tanlash
getCourse.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Yoshingizni kiriting` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getCourse')
    ctx.scene.enter('getAge')
})

getCourse.hears([ `❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getCourse')
    ctx.scene.enter('getName')
})

getCourse.on('text', async(ctx) => {
    ctx.session.course = ctx.message.text
    ctx.reply(
        `Qaysi kunlar siz uchun ma'qul?\nMasalan: 1.Du-Chor-Ju 2.Se-Pay-Shan` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getCourse')
    ctx.scene.enter('getDay')
})

// o'qish kunlarini kiritish
getDay.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Qanday kurslarda o'qimoqchisiz?` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getDay')
    ctx.scene.enter('getCourse')
})

getDay.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getDay')
    ctx.scene.enter('getName')
})

getDay.on('text', async (ctx) => {
    ctx.session.day = ctx.message.text
    ctx.reply(
        `Dars vaqti soat nechida bo'lsin?` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}\nKunlar: ${ctx.session.day}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getDay')
    ctx.scene.enter('getTime')
})

// vaqtini kiritish
getTime.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Qaysi kunlar siz uchun ma'qul?\nMasalan: 1.Du-Chor-Ju 2.Se-Pay-Shan` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getTime')
    ctx.scene.enter('getDay')
})

getTime.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getTime')
    ctx.scene.enter('getName')
})

                                    // tel nomerni optional ham qilish kerak
getTime.on('text', async (ctx) => {
    ctx.session.time = ctx.message.text
    ctx.reply(
        `Telefon raqamingizni yuboring`+
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}\nVaqt: ${ctx.session.time}`,
        { reply_markup: { keyboard: [[{text: '📞 Telefon raqamni yuborish', request_contact: true}],
        [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getTime')
    ctx.scene.enter('getNum')
})

//raqamni kiritish
getNum.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Dars vaqti soat nechida bo'lsin?` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}\nKunlar: ${ctx.session.day}`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('getTime')
})

getNum.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('getName')
    ctx.session = null
})
                    // shu yerda phone num orniga oddiy number bolishi ham mumkin deb qoyish kere
getNum.on('contact', async (ctx) => {
    ctx.session.num = ctx.message.contact.phone_number
    ctx.reply (
        `❗ Ma'lumotlarni qayta tekshirib ko'ring. "✅ Jo'natish" ni bosing` +
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}\nVaqt: ${ctx.session.time}`+
        `\nTelefon raqam: ${ctx.session.num}`,
        { reply_markup: { keyboard: [[ `✅ Jo'natish`],
            [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }, parse_mode: 'markdown'}
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('check')
})

check.hears(`✅ Jo'natish`, (ctx) => {
    ctx.reply(
        `✅ Raxmat. Siz ro'yxatga olindingiz. Tez orada siz bilan bog'lanamiz.` +
        `\n\n"Robocode IT Academy" - robototexnika va dasturlash maktabi\n📱 Telegram kanal: @robocode_andijan\n👨‍💻 Admin: @Robocode_admin\n🌐 Websayt: https://robocode.uz`,
        { reply_markup: { keyboard: [['◀ Bosh menyu']], resize_keyboard: true, on_time_keyboard: true } }
        // { reply_markup: { remove_keyboard: true} }
    )
    ctx.scene.leave('main')

    //adminga xabar yuborish
    ctx.telegram.sendMessage(admin,
        `Yangi a'zo!\n\nIsm-Familiya: [${ctx.session.name}]\nUsername: @${ctx.from.username}\nYoshi: ${ctx.session.age}\nKurs: ${ctx.session.course}\nKunlar: ${ctx.session.day}\nVaqt: ${ctx.session.time}` +
        `\nTelefon raqami: ${ctx.session.num}` )
    

    console.log(`Yangi a'zo!\n\nIsm-Familiya: [${ctx.session.name}]\nUsername: @${ctx.from.username}\nYoshi: ${ctx.session.age}\nKurs: ${ctx.session.course}\nKunlar: ${ctx.session.day}\nVaqt: ${ctx.session.time}` +
    `\nTelefon raqami: ${ctx.session.num}\n`);


    ctx.session = null
})




check.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Telefon raqamingizni yuboring`+
        `\n\nMa'lumotlar:\nIsm-Familiya: ${ctx.session.name}\nYosh: ${ctx.session.age}\nKurs: ${ctx.session.course}\nVaqt: ${ctx.session.time}`,
        { reply_markup: { keyboard: [[{text: '📞 Telefon raqamni yuborish', request_contact: true}],
        [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('check')
    ctx.scene.enter('getNum')
})

check.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Boshidan boshlaymiz. Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('check')
    ctx.scene.enter('getName')

    ctx.session = null
})



console.log('Bot is LIVE');


bot.catch((err, ctx) => {
    console.log(`Ooops, ecountered an error for ${ctx.updateType}`, err)
  })

bot.startPolling()