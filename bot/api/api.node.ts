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

		name() {
			return ''
		}

		variant_ok = 0
		variant_seen = false

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

		open( text: string, payload: string, variant: number ): ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'button' ][ 'openApp' ] > | ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'button' ][ 'link' ] > {
			const { Keyboard } = $node[ '@maxhub/max-bot-api' ]
			if( variant === 0 ) return Keyboard.button.openApp( text, this.name() || this.app(), undefined, payload || undefined )
			if( variant === 1 ) return Keyboard.button.openApp( text, this.app(), undefined, payload || undefined )
			return Keyboard.button.link( text, this.app() + ( payload ? '#!start=' + encodeURIComponent( payload ) : '' ) )
		}

		keyboard( text: string, payload: string, variant = 0 ): ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'inlineKeyboard' ] > {
			const { Keyboard } = $node[ '@maxhub/max-bot-api' ]
			return Keyboard.inlineKeyboard([[ this.open( text, payload, variant ) ]])
		}

		static text_payload( text: string ) {
			return 't_' + Buffer.from( text.trim().slice( 0, 300 ) ).toString( 'base64url' )
		}

		static text_of( payload: string ) {
			if( !payload.startsWith( 't_' ) ) return ''
			return Buffer.from( payload.slice( 2 ), 'base64url' ).toString()
		}

		problem( message: $bog_max_bot_api_message, me: $bog_max_bot_api_me ) {
			let text = message.body.text ?? ''
			if( me.username ) text = text.replace( new RegExp( '@' + me.username + '\\b,?', 'gi' ), '' )
			text = text.replace( /\s+/g, ' ' ).trim()
			if( text.startsWith( '/' ) ) return ''
			return text
		}

		question( text: string ) {
			return `Создать заявку по проблеме: «${ text }»?`
		}

		declined() {
			return 'Хорошо, заявку не создаём. Когда понадобится, опишите проблему одним сообщением или нажмите /start.'
		}

		confirm( text: string, variant = 0 ): ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'inlineKeyboard' ] > {
			const { Keyboard } = $node[ '@maxhub/max-bot-api' ]
			return Keyboard.inlineKeyboard([[
				this.open( 'Да', $bog_max_bot_api.text_payload( text ), variant ),
				Keyboard.button.callback( 'Нет', 'no' ),
			]])
		}

		unbound( error: unknown ) {
			return /Link not found/.test( String( error ) )
		}

		async deliver( send: ( variant: number )=> Promise< unknown > ): Promise< unknown > {
			for( let variant = this.variant_ok; ; ++ variant ) {
				try {
					const result = await send( variant )
					if( !this.variant_seen || variant !== this.variant_ok ) {
						this.variant_seen = true
						if( variant < 2 ) this.variant_ok = variant
						this.$.$mol_log3_rise({ place: this, message: 'Кнопка мини-аппа принята, вариант ' + variant })
					}
					return result
				} catch( error ) {
					if( variant >= 2 || !this.unbound( error ) ) throw error
					if( variant === 1 ) this.$.$mol_log3_warn({ place: this, message: 'Мини-апп не привязан к боту, кнопка ушла обычной ссылкой', hint: 'MAX для бизнеса → Чат-боты → бот → Настройки → ссылка мини-приложения ' + this.app() })
				}
			}
		}

		answer( ctx: $bog_max_bot_api_context, text: string, keys: ( variant: number )=> ReturnType< typeof $node[ '@maxhub/max-bot-api' ][ 'Keyboard' ][ 'inlineKeyboard' ] > ): Promise< unknown > {
			return this.deliver( variant => ctx.reply( text, { attachments: [ keys( variant ) ] } ) )
		}

		invite( ctx: $bog_max_bot_api_context, text: string, payload: string ) {
			return this.answer( ctx, text, variant => this.keyboard( 'Подать заявку', payload, variant ) )
		}

		ask( ctx: $bog_max_bot_api_context, text: string ) {
			return this.answer( ctx, this.question( text ), variant => this.confirm( text, variant ) )
		}

		@ $mol_memo.method
		client(): $bog_max_bot_api_client {
			const { Bot } = $node[ '@maxhub/max-bot-api' ]
			const bot = new Bot( this.token() )
			const fail = ( error: unknown )=> this.$.$mol_log3_fail({ place: this, message: String( error ) })
			bot.on( 'bot_started', ctx => this.invite( ctx, this.greeting(), ctx.startPayload ?? '' ) )
			bot.on( 'bot_added', ctx => ctx.update.is_channel ? undefined : this.invite( ctx, this.greeting_chat(), '' ) )
			bot.on( 'message_created', ( ctx, next )=> this.addressed( ctx.message, ctx.botInfo ?? {} ) ? next() : undefined )
			bot.command( 'start', ctx => this.invite( ctx, this.greeting(), '' ) )
			bot.command( 'help', ctx => ctx.reply( this.help() ) )
			bot.command( 'id', ctx => ctx.reply( `Ваш ID в MAX: ${ ctx.message?.sender?.user_id ?? '?' }` ) )
			bot.on( 'message_created', ctx => {
				const me = ctx.botInfo ?? {}
				const text = this.problem( ctx.message, me )
				if( text ) return this.ask( ctx, text )
				if( this.mentioned( ctx.message, me ) ) return this.invite( ctx, this.help(), '' )
			} )
			bot.on( 'message_callback', ctx => ctx.callback.payload === 'no' ? ctx.answerOnCallback({ message: { text: this.declined() } }) : undefined )
			bot.catch( fail )
			bot.api.setMyCommands( this.commands() ).catch( fail )
			bot.start()
			return bot
		}

		send( user: number, text: string, payload: string ): Promise< unknown > {
			return this.deliver( variant => this.client().api.sendMessageToUser( user, text, { attachments: [ this.keyboard( 'Открыть заявку', payload, variant ) ] } ) )
		}

	}

}
