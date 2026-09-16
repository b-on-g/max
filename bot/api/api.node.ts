namespace $ {

	export class $bog_max_bot_api extends $mol_object {

		token() {
			return ''
		}

		app() {
			return ''
		}

		greeting() {
			return 'Это бот заявок в управляющую компанию. Нажмите кнопку, опишите проблему, и в ответ придёт номер заявки, ответственный и срок по нормативу.'
		}

		keyboard( text: string, payload: string ): ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'inlineKeyboard' ] > {
			const { Keyboard } = $node[ '@maxhub/max-bot-api' ]
			return Keyboard.inlineKeyboard([[
				Keyboard.button.openApp( text, this.app(), undefined, payload || undefined ),
			]])
		}

		@ $mol_memo.method
		client(): InstanceType< typeof $node[ '@maxhub/max-bot-api' ][ 'Bot' ] > {
			const { Bot } = $node[ '@maxhub/max-bot-api' ]
			const bot = new Bot( this.token() )
			bot.on( 'bot_started', ctx => ctx.reply( this.greeting(), {
				attachments: [ this.keyboard( 'Подать заявку', ctx.startPayload ?? '' ) ],
			} ) )
			bot.command( 'start', ctx => ctx.reply( this.greeting(), {
				attachments: [ this.keyboard( 'Подать заявку', '' ) ],
			} ) )
			bot.command( 'id', ctx => ctx.reply( `Ваш ID в MAX: ${ ctx.message?.sender?.user_id ?? '?' }. Добавьте его в UK_STAFF, чтобы открыть раздел диспетчера.` ) )
			bot.hears( /заявк|авари|проблем|жалоб/i, ctx => ctx.reply( 'Оформить заявку можно в приложении, оно само определит ответственного и срок.', {
				attachments: [ this.keyboard( 'Подать заявку', '' ) ],
			} ) )
			bot.catch( error => this.$.$mol_log3_fail({ place: this, message: String( error ) }) )
			bot.start()
			return bot
		}

		send( user: number, text: string, payload: string ): Promise< unknown > {
			return this.client().api.sendMessageToUser( user, text, {
				attachments: [ this.keyboard( 'Открыть заявку', payload ) ],
			} )
		}

	}

}
