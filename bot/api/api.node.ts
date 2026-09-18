namespace $ {

	export type $bog_max_bot_api_client = InstanceType< typeof $node[ '@maxhub/max-bot-api' ][ 'Bot' ] >
	export type $bog_max_bot_api_context = InstanceType< typeof $node[ '@maxhub/max-bot-api' ][ 'Context' ] >
	export type $bog_max_bot_api_message = NonNullable< $bog_max_bot_api_context[ 'message' ] >
	export type $bog_max_bot_api_me = { user_id?: number, username?: string | null }

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

		greeting_chat() {
			return 'Я бот заявок в управляющую компанию. Жители дома могут подать заявку кнопкой ниже, а в чате я отвечаю только на команды, упоминание и сообщения со словом «заявка».'
		}

		help() {
			return [
				'Что умеет бот:',
				'/start — открыть приложение и подать заявку',
				'/id — узнать свой ID в MAX',
				'/help — эта подсказка',
				'В групповом чате бот отвечает на команды, упоминание и сообщения со словами «заявка», «авария», «проблема», «жалоба».',
			].join( '\n' )
		}

		commands(): Parameters< $bog_max_bot_api_client[ 'api' ][ 'setMyCommands' ] >[ 0 ] {
			return [
				{ name: 'start', description: 'Открыть приложение и подать заявку' },
				{ name: 'help', description: 'Что умеет бот' },
				{ name: 'id', description: 'Мой ID в MAX' },
			]
		}

		trigger() {
			return /заявк|авари|проблем|жалоб/i
		}

		mentioned( message: $bog_max_bot_api_message, me: $bog_max_bot_api_me ) {
			const text = message.body.text ?? ''
			if( me.username && text.toLowerCase().includes( '@' + me.username.toLowerCase() ) ) return true
			return ( message.body.markup ?? [] ).some( mark => mark.type === 'user_mention' && Boolean( me.user_id ) && mark.user_id === me.user_id )
		}

		addressed( message: $bog_max_bot_api_message, me: $bog_max_bot_api_me ) {
			if( message.recipient.chat_type === 'dialog' ) return true
			const text = message.body.text ?? ''
			if( text.startsWith( '/' ) ) return true
			if( this.trigger().test( text ) ) return true
			return this.mentioned( message, me )
		}

		keyboard( text: string, payload: string, inside = true ): ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'inlineKeyboard' ] > {
			const { Keyboard } = $node[ '@maxhub/max-bot-api' ]
			return Keyboard.inlineKeyboard([[
				inside
					? Keyboard.button.openApp( text, this.app(), undefined, payload || undefined )
					: Keyboard.button.link( text, this.app() + ( payload ? '#!start=' + encodeURIComponent( payload ) : '' ) ),
			]])
		}

		unbound( error: unknown ) {
			return /Link not found/.test( String( error ) )
		}

		async answer( ctx: $bog_max_bot_api_context, text: string, button: string, payload: string ): Promise< unknown > {
			try {
				return await ctx.reply( text, { attachments: [ this.keyboard( button, payload ) ] } )
			} catch( error ) {
				if( !this.unbound( error ) ) throw error
				return await ctx.reply( text, { attachments: [ this.keyboard( button, payload, false ) ] } )
			}
		}

		@ $mol_memo.method
		client(): $bog_max_bot_api_client {
			const { Bot } = $node[ '@maxhub/max-bot-api' ]
			const bot = new Bot( this.token() )
			const fail = ( error: unknown )=> this.$.$mol_log3_fail({ place: this, message: String( error ) })
			bot.on( 'bot_started', ctx => this.answer( ctx, this.greeting(), 'Подать заявку', ctx.startPayload ?? '' ) )
			bot.on( 'bot_added', ctx => ctx.update.is_channel ? undefined : this.answer( ctx, this.greeting_chat(), 'Подать заявку', '' ) )
			bot.on( 'message_created', ( ctx, next )=> this.addressed( ctx.message, ctx.botInfo ?? {} ) ? next() : undefined )
			bot.command( 'start', ctx => this.answer( ctx, this.greeting(), 'Подать заявку', '' ) )
			bot.command( 'help', ctx => ctx.reply( this.help() ) )
			bot.command( 'id', ctx => ctx.reply( `Ваш ID в MAX: ${ ctx.message?.sender?.user_id ?? '?' }` ) )
			bot.hears( this.trigger(), ctx => this.answer( ctx, 'Оформить заявку можно в приложении, оно само определит ответственного и срок.', 'Подать заявку', '' ) )
			bot.on( 'message_created', ctx => this.mentioned( ctx.message, ctx.botInfo ?? {} ) ? this.answer( ctx, this.help(), 'Подать заявку', '' ) : undefined )
			bot.catch( fail )
			bot.api.setMyCommands( this.commands() ).catch( fail )
			bot.start()
			return bot
		}

		async send( user: number, text: string, payload: string ): Promise< unknown > {
			try {
				return await this.client().api.sendMessageToUser( user, text, { attachments: [ this.keyboard( 'Открыть заявку', payload ) ] } )
			} catch( error ) {
				if( !this.unbound( error ) ) throw error
				return await this.client().api.sendMessageToUser( user, text, { attachments: [ this.keyboard( 'Открыть заявку', payload, false ) ] } )
			}
		}

	}

}
