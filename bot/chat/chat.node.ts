namespace $ {

	export type $bog_max_bot_chat_step = {
		text: string
		options: readonly { label: string, payload: string }[]
		ticket?: string
	}

	export type $bog_max_bot_chat_draft = {
		text: string
		files: readonly string[]
		step: 'house' | 'scope' | 'category' | 'place'
		house?: string
		scope?: string
		category?: string
	}

	export class $bog_max_bot_chat extends $mol_object {

		bot() {
			return null! as $bog_max_bot
		}

		drafts = new Map< number, $bog_max_bot_chat_draft >()

		houses() {
			return this.bot().uk().Houses()?.remote_list() ?? []
		}

		categories( scope: string ) {
			return ( this.bot().uk().Categories()?.remote_list() ?? [] )
				.filter( category => ( category.Scope()?.val() ?? 'house' ) === scope )
		}

		last_house( user: number ) {
			const own = this.bot().uk().tickets().filter( ticket => ticket.Author()?.val() === String( user ) )
			return own.at( -1 )?.House()?.val()?.str ?? ''
		}

		cancel() {
			return { label: 'Отмена', payload: 'f:x' }
		}

		start( user: number, text: string, files: readonly string[] ): $bog_max_bot_chat_step {
			const houses = this.houses()
			if( !houses.length ) return { text: 'Домов пока нет. Откройте приложение по QR-коду с подъезда или по ссылке от УК.', options: [] }
			const last = this.last_house( user )
			const draft: $bog_max_bot_chat_draft = { text, files, step: 'house' }
			this.drafts.set( user, draft )
			if( houses.length === 1 ) return this.pick( user, 'f:h:0' )
			const order = [ ... houses.keys() ].sort( ( a, b )=> Number( houses[ b ].link().str === last ) - Number( houses[ a ].link().str === last ) )
			return {
				text: `Заявка: «${ text }». В каком доме?`,
				options: [ ... order.map( index => ({ label: houses[ index ].Address()?.val() ?? '', payload: `f:h:${ index }` }) ), this.cancel() ],
			}
		}

		pick( user: number, payload: string ): $bog_max_bot_chat_step {
			const draft = this.drafts.get( user )
			if( !draft ) return { text: 'Черновик заявки потерялся. Опишите проблему ещё раз одним сообщением.', options: [] }
			if( payload === 'f:x' ) {
				this.drafts.delete( user )
				return { text: 'Заявку не создаём. Когда понадобится, опишите проблему сообщением.', options: [] }
			}
			const [ , kind, value ] = payload.split( ':' )
			if( kind === 'h' ) {
				const house = this.houses()[ Number( value ) ]
				if( !house ) return { text: 'Такого дома нет, начните заново.', options: [] }
				draft.house = house.link().str
				draft.step = 'scope'
				return {
					text: `Дом: ${ house.Address()?.val() ?? '' }. Где проблема?`,
					options: [ ... Object.entries( $bog_max_scope ).filter( ([ key ])=> key !== 'other' ).map( ([ key, label ])=> ({ label, payload: `f:s:${ key }` }) ), this.cancel() ],
				}
			}
			if( kind === 's' ) {
				const categories = this.categories( value )
				if( !categories.length ) return { text: 'Для этого места категорий нет, выберите другое.', options: [ this.cancel() ] }
				draft.scope = value
				draft.step = 'category'
				return {
					text: 'Что случилось?',
					options: [ ... categories.map( ( category, index )=> ({ label: category.Title()?.val() ?? '', payload: `f:c:${ index }` }) ), this.cancel() ],
				}
			}
			if( kind === 'c' ) {
				const category = this.categories( draft.scope ?? 'house' )[ Number( value ) ]
				if( !category ) return { text: 'Такой категории нет, начните заново.', options: [] }
				draft.category = category.link().str
				draft.step = 'place'
				return {
					text: `${ category.Title()?.val() ?? '' }. Где именно? Напишите одним сообщением: подъезд, этаж, квартира или ориентир.`,
					options: [ this.cancel() ],
				}
			}
			return { text: 'Не понял выбор, начните заново.', options: [] }
		}

		ticket_make( user: number, house: string, category: string, place: string, text: string, files: readonly string[] ) {
			const uk = this.bot().uk()
			const house_pawn = this.$.$giper_baza_glob.Pawn( new $giper_baza_link( house ), $bog_max_house )
			const category_pawn = this.$.$giper_baza_glob.Pawn( new $giper_baza_link( category ), $bog_max_category )
			const created = new $mol_time_moment()
			const ticket = uk.Tickets( 'auto' )!.make( null )
			ticket.House( 'auto' )!.remote( house_pawn )
			ticket.Category( 'auto' )!.remote( category_pawn )
			ticket.Place( 'auto' )!.val( place )
			ticket.Text( 'auto' )!.val( text )
			ticket.Author( 'auto' )!.val( String( user ) )
			ticket.Created( 'auto' )!.val( created )
			for( const link of files ) ticket.Photos( 'auto' )!.add( new $giper_baza_link( link ) )
			if( files.length ) ticket.Photo( 'auto' )!.val( new $giper_baza_link( files[0] ) )
			return ticket.link().str
		}

		waiting( user: number ) {
			return this.drafts.get( user )?.step === 'place'
		}

		place( user: number, place: string ) {
			const draft = this.drafts.get( user )
			if( !draft?.house || !draft.category ) return ''
			const link = this.ticket_make( user, draft.house, draft.category, place, draft.text, draft.files )
			this.drafts.delete( user )
			return link
		}

		placed( link: string ): $bog_max_bot_chat_step {
			if( !link ) return { text: 'Черновик заявки потерялся. Опишите проблему ещё раз одним сообщением.', options: [] }
			const ticket = this.bot().ticket( link )
			const number = ticket ? this.bot().uk().ticket_number( ticket ) : 0
			return {
				text: `Заявка${ number ? ` № ${ number }` : '' } создана. Ответственного и срок по нормативу пришлю следующим сообщением, статус можно смотреть командой /my.`,
				options: [],
				ticket: link,
			}
		}

		mine( user: number ) {
			const bot = this.bot()
			const lords = bot.lords()
			const own = bot.uk().tickets().filter( ticket => ticket.Author()?.val() === String( user ) )
			if( !own.length ) return 'У вас пока нет заявок. Опишите проблему одним сообщением, и бот её оформит.'
			const lines = own.slice( -10 ).reverse().map( ticket => {
				const status = ticket.status_by( lords )
				const label = $bog_max_status[ status as keyof typeof $bog_max_status ] ?? ( status || 'ждёт регистрации' )
				return `№ ${ bot.uk().ticket_number( ticket ) }, ${ ticket.heading() }: ${ label }`
			} )
			return [ own.length > 10 ? 'Последние 10 заявок:' : 'Ваши заявки:', ... lines ].join( '\n' )
		}

	}

}
