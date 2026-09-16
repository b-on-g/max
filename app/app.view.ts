namespace $.$$ {

	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = ()=> {
		const url = $bog_max_app.Root( 0 ).bot_url()
		return url ? [ url ] : []
	}

	export type $bog_max_app_session = {
		land: string
		lord: string
		lords: readonly string[]
		bot: string
		role: 'resident' | 'staff'
		house: string | null
		user: { id: number, name: string }
	}

	export class $bog_max_app extends $.$bog_max_app {

		platform() {
			return $bog_max_bridge.platform()
		}

		auto() {
			this.pin()
			$bog_max_bridge.ready()
		}

		pin() {
			const yard = this.$.$giper_baza_yard
			const url = this.bot_url()
			const masters = yard.masters()
			if( masters.length === 1 && masters[0] === url ) return
			yard.masters_default.length = 0
			yard.masters = ()=> url ? [ url ] : []
			const live = this.$.$giper_baza_glob.yard()
			live.master_cursor( 1 )
			live.master_cursor( 0 )
		}

		bot_url() {
			const arg = this.$.$mol_state_arg.value( 'bot' )
			if( arg ) return ( /^https?:/.test( arg ) ? arg : 'http://' + arg ).replace( /\/?$/, '/' )
			const location = this.$.$mol_dom_context.location
			if( /\.github\.io$/.test( location.hostname ) ) return this.bot_prod()
			return location.origin + '/'
		}

		@ $mol_mem
		session(): $bog_max_app_session {
			const url = this.bot_url()
			if( !url ) $mol_fail( new Error( 'Адрес бота не задан' ) )
			this.$.$bog_max_bridge.loaded()
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			const init_data = $bog_max_bridge.init_data() || this.dev_init_data()
			const response = this.$.$mol_fetch.response( url + 'auth', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ init_data, pass }),
			})
			if( response.status() !== 'success' ) $mol_fail( new Error( `Бот ${ url } ответил: ${ response.text() }` ) )
			return response.json() as $bog_max_app_session
		}

		dev_init_data() {
			const id = Number( this.$.$mol_state_arg.value( 'user' ) ?? '' )
			if( !id ) return ''
			return new URLSearchParams({ user: JSON.stringify({ id, first_name: `Демо ${ id }` }) }).toString()
		}

		@ $mol_mem
		fail() {
			try {
				this.session()
				return ''
			} catch( error ) {
				if( $mol_promise_like( error ) ) return ''
				const message = ( error as Error ).message
				if( /Failed to fetch|Load failed|NetworkError/.test( message ) ) {
					return 'Приложение работает как мини-приложение в MAX. Откройте его из чата с ботом управляющей компании.'
				}
				return message
			}
		}

		@ $mol_mem
		waiting() {
			try {
				this.session()
				return false
			} catch( error ) {
				return $mol_promise_like( error )
			}
		}

		land() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.session().land ) )
		}

		uk() {
			return this.land().Data( $bog_max_uk )
		}

		lords() {
			return this.session().lords ?? [ this.session().lord ]
		}

		staff() {
			try {
				return this.session().role === 'staff'
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return false
			}
		}

		user_id() {
			return String( this.session().user.id )
		}

		ticket( link: string ) {
			return this.land().Pawn( $bog_max_ticket ).Head( new $giper_baza_link( link ).head() )
		}

		house_of( link: string ) {
			return this.land().Pawn( $bog_max_house ).Head( new $giper_baza_link( link ).head() )
		}

		category_of( link: string ) {
			return this.land().Pawn( $bog_max_category ).Head( new $giper_baza_link( link ).head() )
		}

		@ $mol_mem
		section() {
			return this.$.$mol_state_arg.value( 'section' ) ?? 'tickets'
		}

		main_title() {
			switch( this.section() ) {
				case 'house': return 'Дом'
				case 'account': return 'Профиль'
				case 'admin': return 'Диспетчер'
			}
			return 'Мои заявки'
		}

		@ $mol_mem
		main_body() {
			if( this.waiting() ) return [ this.Wait() ]
			if( this.fail() ) return [ this.Fail() ]
			switch( this.section() ) {
				case 'house': return [
					this.House_pick(),
					this.House_tabs(),
					... this.house_tab() === 'news'
						? [ this.news_rows().length ? this.News() : this.News_empty() ]
						: [ this.Search(), this.house_rows().length ? this.House_rows() : this.House_empty() ],
				]
				case 'account': return [
					this.Account_name(),
					this.Account_id(),
					this.Account_house(),
					this.Account_count(),
					this.Account_note(),
				]
				case 'admin': return this.staff() ? [
					this.Admin_title(),
					this.admin_rows().length ? this.Admin_rows() : this.Admin_empty(),
					this.Qr_title(),
					this.Qrs(),
					this.Post_form(),
				] : [ this.Fail() ]
			}
			return [
				this.New_link(),
				this.House_title(),
				this.mine().length ? this.Rows() : this.Empty(),
			]
		}

		@ $mol_mem
		mine() {
			const user = this.user_id()
			return this.uk().tickets()
				.filter( ticket => ticket.Author()?.val() === user )
				.map( ticket => ticket.link().str )
				.reverse()
		}

		rows() {
			return this.mine().map( link => this.Row( link ) )
		}

		row_link( link: string ) {
			return link
		}

		number( link: string ) {
			return this.uk().ticket_number( this.ticket( link ) )
		}

		status_of( link: string ) {
			return this.ticket( link ).status_by( this.lords() )
		}

		status_label( link: string ) {
			const status = this.status_of( link )
			if( !status ) return 'Отправлена, ждём регистрации'
			return $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
		}

		row_title( link: string ) {
			return `№ ${ this.number( link ) }, ${ this.ticket( link ).category()?.Title()?.val() ?? '' }`
		}

		row_status( link: string ) {
			const ticket = this.ticket( link )
			const fix = ticket.fix_till()
			const voices = ticket.voices()
			return [
				this.status_label( link ),
				... fix ? [ `до ${ fix.toString( 'DD.MM hh:mm' ) }` ] : [],
				... voices ? [ `поддержали: ${ voices }` ] : [],
			].join( ', ' )
		}

		@ $mol_mem
		house_filter( next?: string ) {
			return next ?? this.house()
		}

		@ $mol_mem
		neighbours() {
			const house = this.house_filter()
			return this.uk().tickets()
				.filter( ticket => ticket.House()?.val()?.str === house )
				.filter( $mol_match_text( this.query(), ticket => [
					ticket.category()?.Title()?.val() ?? '',
					ticket.Entrance()?.val() ?? '',
					ticket.Place()?.val() ?? '',
					ticket.Text()?.val() ?? '',
				] ) )
				.map( ticket => ticket.link().str )
				.reverse()
		}

		house_rows() {
			return this.neighbours().map( link => this.Row( link ) )
		}

		@ $mol_mem
		news() {
			const house = this.house_filter()
			return this.uk().posts()
				.filter( post => {
					const own = post.House()?.val()?.str
					return !own || own === house
				} )
				.map( post => post.link().str )
				.reverse()
		}

		news_rows() {
			return this.news().map( link => this.Post( link ) )
		}

		post( link: string ) {
			return this.land().Pawn( $bog_max_post ).Head( new $giper_baza_link( link ).head() )
		}

		news_title( link: string ) {
			const post = this.post( link )
			const kind = post.Kind()?.val() === 'outage' ? 'Отключение: ' : ''
			return kind + ( post.Title()?.val() ?? '' )
		}

		news_when( link: string ) {
			const post = this.post( link )
			const since = post.Since()?.val()
			const till = post.Till()?.val()
			if( since && till ) return `с ${ since.toString( 'DD.MM hh:mm' ) } до ${ till.toString( 'DD.MM hh:mm' ) }`
			return post.Created()?.val()?.toString( 'DD.MM.YYYY' ) ?? ''
		}

		news_text( link: string ) {
			return this.post( link ).Text()?.val() ?? ''
		}

		account_name() {
			return this.session().user.name || 'Без имени'
		}

		account_id() {
			return String( this.session().user.id )
		}

		account_count() {
			return String( this.mine().length )
		}

		house_address( link = this.house() ) {
			return this.house_dictionary()[ link ] ?? ''
		}

		@ $mol_mem
		house_options() {
			return this.uk().Houses()?.remote_list().map( house => house.link().str ) ?? []
		}

		@ $mol_mem
		house_dictionary() {
			return Object.fromEntries( this.house_options().map( link => [ link, this.house_of( link ).Address()?.val() ?? '' ] ) )
		}

		@ $mol_mem
		house( next?: string ) {
			const options = this.house_options()
			const saved = String( this.$.$mol_state_local.value( '$bog_max_house', next ) ?? '' )
			if( options.includes( saved ) ) return saved
			const code = this.$.$mol_state_arg.value( 'house' ) ?? ''
			const coded = code ? this.uk().house_by_code( code )?.link().str ?? '' : ''
			if( options.includes( coded ) ) return coded
			const linked = this.session().house ?? ''
			if( options.includes( linked ) ) return linked
			return options[0] ?? ''
		}

		house_title() {
			const address = this.house_address()
			return address ? `Дом: ${ address }` : ''
		}

		scope_options() {
			return Object.keys( $bog_max_scope )
		}

		scope_dictionary() {
			return $bog_max_scope
		}

		@ $mol_mem
		categories() {
			return this.uk().Categories()?.remote_list() ?? []
		}

		@ $mol_mem
		category_options() {
			return this.categories()
				.filter( category => ( category.Scope()?.val() ?? 'house' ) === this.scope() )
				.map( category => category.link().str )
		}

		@ $mol_mem
		category_dictionary() {
			return {
				'': 'Выберите категорию',
				... Object.fromEntries( this.categories().map( category => [ category.link().str, category.Title()?.val() ?? '' ] ) ),
			}
		}

		@ $mol_mem
		category_bids() {
			return this.category_options().includes( this.category() ) ? [] : [ 'Выберите категорию' ]
		}

		@ $mol_mem
		place_bids() {
			return this.place().trim() ? [] : [ 'Укажите, где именно' ]
		}

		photo_pick_label() {
			const file = this.photo_files()[0]
			return file ? file.name : 'Фото по желанию'
		}

		@ $mol_mem
		photo_preview() {
			const file = this.photo_files()[0]
			return file ? URL.createObjectURL( file ) : ''
		}

		@ $mol_mem
		similar() {
			const category = this.category()
			const house = this.house()
			if( !category ) return []
			return this.uk().tickets()
				.filter( ticket => ticket.House()?.val()?.str === house )
				.filter( ticket => ticket.Category()?.val()?.str === category )
				.filter( ticket => ![ 'done', 'rejected' ].includes( ticket.status_by( this.lords() ) ) )
				.map( ticket => ticket.link().str )
				.reverse()
				.slice( 0, 3 )
		}

		similar_rows() {
			return this.similar().map( link => this.Row( link ) )
		}

		new_fields() {
			return [
				this.Scope_field(),
				this.Category_field(),
				... this.scope() === 'house' ? [ this.Entrance_field() ] : [],
				this.Place_field(),
				this.Text_field(),
				this.Photo_field(),
			]
		}

		place_hint() {
			switch( this.scope() ) {
				case 'yard': return 'Ориентир во дворе'
				case 'city': return 'Адрес или ориентир'
			}
			return 'Этаж, квартира, ориентир'
		}

		new_body() {
			return [
				this.House_line(),
				this.Form(),
				... this.photo_preview() ? [ this.Photo_preview() ] : [],
				... this.similar().length ? [ this.Similar_title(), this.Similar() ] : [],
			]
		}

		@ $mol_action
		submit() {
			if( !this.submit_allowed() ) return
			const uk = this.uk()
			const house = this.house_of( this.house() )
			const category = this.category_of( this.category() )
			const author = this.user_id()
			const file = this.photo_files()[0] ?? null
			const created = new $mol_time_moment()
			const ticket = uk.Tickets( 'auto' )!.make( null )
			ticket.House( 'auto' )!.remote( house )
			ticket.Category( 'auto' )!.remote( category )
			ticket.Entrance( 'auto' )!.val( this.entrance() )
			ticket.Place( 'auto' )!.val( this.place() )
			ticket.Text( 'auto' )!.val( this.text() )
			ticket.Author( 'auto' )!.val( author )
			ticket.Created( 'auto' )!.val( created )
			if( file ) {
				const store = ticket.Photo( 'auto' )!.ensure( null )!
				store.blob( file )
				ticket.Photo( 'auto' )!.remote( store )
			}
			this.place( '' )
			this.text( '' )
			this.entrance( '' )
			this.category( '' )
			this.photo_files( [] )
			this.$.$mol_state_arg.dict({ ... this.$.$mol_state_arg.dict(), screen: null, ticket: ticket.link().str })
		}

		@ $mol_mem
		ticket_link() {
			return this.$.$mol_state_arg.value( 'ticket' ) ?? ''
		}

		@ $mol_mem
		screen() {
			return this.$.$mol_state_arg.value( 'screen' ) ?? ''
		}

		pages() {
			return [
				this.Main(),
				... this.screen() === 'new' ? [ this.New() ] : [],
				... this.ticket_link() ? [ this.Ticket() ] : [],
			]
		}

		ticket_body() {
			return [
				this.Ticket_status(),
				... this.ticket_note() ? [ this.Ticket_note() ] : [],
				... this.ticket_photo() ? [ this.Ticket_photo() ] : [],
				this.Ticket_category(),
				this.Ticket_house(),
				this.Ticket_place(),
				... this.ticket_text() ? [ this.Ticket_text() ] : [],
				this.Ticket_owner(),
				this.Ticket_react(),
				this.Ticket_fix(),
				this.Ticket_basis(),
				this.Voices(),
				this.Log(),
			]
		}

		current() {
			return this.ticket( this.ticket_link() )
		}

		ticket_title() {
			return `Заявка № ${ this.number( this.ticket_link() ) }`
		}

		ticket_status() {
			return this.status_label( this.ticket_link() )
		}

		ticket_note() {
			return this.current().note_by( this.lords() )
		}

		ticket_photo() {
			const uri = this.current().photo()?.uri() ?? ''
			return uri ? this.bot_url() + uri : ''
		}

		ticket_category() {
			return this.current().category()?.Title()?.val() ?? ''
		}

		ticket_house() {
			return this.current().house()?.Address()?.val() ?? ''
		}

		ticket_place() {
			const ticket = this.current()
			const entrance = ticket.Entrance()?.val() ?? ''
			return [ ... entrance ? [ `подъезд ${ entrance }` ] : [], ticket.Place()?.val() ?? '' ].join( ', ' )
		}

		ticket_text() {
			return this.current().Text()?.val() ?? ''
		}

		ticket_owner() {
			const owner = this.current().category()?.Owner()?.val() ?? ''
			return $bog_max_owner[ owner as keyof typeof $bog_max_owner ] ?? owner
		}

		ticket_react() {
			return this.current().react_till()?.toString( 'DD.MM.YYYY hh:mm' ) ?? 'не нормируется'
		}

		ticket_fix() {
			return this.current().fix_till()?.toString( 'DD.MM.YYYY hh:mm' ) ?? ''
		}

		ticket_basis() {
			return this.current().category()?.Basis()?.val() ?? ''
		}

		voices_text() {
			const count = this.current().voices()
			return count ? `Поддержали: ${ count }` : 'Пока никто не поддержал'
		}

		voice_allowed() {
			const keys = this.current().Voices()?.keys().map( String ) ?? []
			return !keys.includes( this.user_id() )
		}

		@ $mol_action
		voice() {
			const ticket = this.current()
			const user = this.user_id()
			ticket.Voices( 'auto' )!.key( user, 'auto' )!.val( '1' )
		}

		@ $mol_mem
		log_rows() {
			return this.current().log_by( this.lords() ).map( ([ time ])=> this.Log_row( time ) )
		}

		log_row( time: string ) {
			const status = this.current().log_by( this.lords() ).find( ([ key ])=> key === time )?.[1] ?? ''
			const label = $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
			return `${ new $mol_time_moment( time ).toString( 'DD.MM hh:mm' ) }: ${ label }`
		}

		@ $mol_mem
		all() {
			return this.uk().tickets().map( ticket => ticket.link().str ).reverse()
		}

		admin_rows() {
			return this.all().map( link => this.Admin_row( link ) )
		}

		status_options() {
			return Object.keys( $bog_max_status )
		}

		status_dictionary() {
			return $bog_max_status
		}

		@ $mol_mem_key
		admin_status( link: string, next?: string ) {
			if( next !== undefined ) {
				const ticket = this.ticket( link )
				ticket.Status( 'auto' )!.val( next )
				ticket.Log( 'auto' )!.key( new $mol_time_moment().toString(), 'auto' )!.val( next )
				return next
			}
			return this.status_of( link )
		}

		qr_rows() {
			return this.house_options().map( link => this.Qr_card( link ) )
		}

		qr_uri( link: string ) {
			const code = this.house_of( link ).Code()?.val() ?? ''
			const bot = this.session().bot
			if( bot ) return `https://max.ru/${ bot }?start=house_${ code }`
			const location = this.$.$mol_dom_context.location
			return `${ location.origin }${ location.pathname }#!house=${ code }`
		}

		@ $mol_mem
		post_title_bids() {
			return this.post_title().trim() ? [] : [ 'Нужен заголовок' ]
		}

		@ $mol_mem
		post_house( next?: string ) {
			return next ?? this.house()
		}

		@ $mol_action
		post_add() {
			if( !this.post_allowed() ) return
			const uk = this.uk()
			const house = this.house_of( this.post_house() )
			const created = new $mol_time_moment()
			const post = uk.Posts( 'auto' )!.make( null )
			post.Title( 'auto' )!.val( this.post_title() )
			post.Text( 'auto' )!.val( this.post_text() )
			post.Kind( 'auto' )!.val( this.post_kind() )
			post.House( 'auto' )!.remote( house )
			post.Created( 'auto' )!.val( created )
			this.post_title( '' )
			this.post_text( '' )
		}

	}

}
