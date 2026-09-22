namespace $.$$ {

	$.$mol_select = $bog_max_select

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
		role: 'resident' | 'dispatcher' | 'admin'
		duty: readonly string[]
		integrations: readonly string[]
		staff_link: string
		house: string | null
		text?: string
		user: { id: number, name: string, username?: string, photo?: string }
	}

	export class $bog_max_app extends $.$bog_max_app {

		platform() {
			return $bog_max_bridge.platform()
		}

		auto() {
			this.pin()
			$bog_max_bridge.ready()
			this.chat_text_open()
			this.heal()
		}

		@ $mol_mem
		chat_text_used( next = false ) {
			return next
		}

		chat_text_open() {
			if( this.waiting() || this.fail() ) return
			if( !this.session().text || this.chat_text_used() ) return
			this.chat_text_used( true )
			this.$.$mol_state_arg.dict({ ... this.$.$mol_state_arg.dict(), screen: 'new', ticket: null })
		}

		@ $mol_mem
		text( next?: string ) {
			return next ?? this.session().text ?? ''
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
			const raw = this.$.$mol_state_arg.value( 'init' ) ?? ''
			if( raw ) return raw
			const id = Number( this.$.$mol_state_arg.value( 'user' ) ?? '' )
			const start = this.$.$mol_state_arg.value( 'start' ) ?? ''
			if( !id && !start ) return ''
			return new URLSearchParams({
				... id ? { user: JSON.stringify({ id, first_name: `Демо ${ id }` }) } : {},
				... start ? { start_param: start } : {},
			}).toString()
		}

		@ $mol_mem
		fail() {
			try {
				this.session()
				this.uk().Houses()
				return ''
			} catch( error ) {
				if( $mol_promise_like( error ) ) return ''
				const message = ( error as Error ).message
				if( /Failed to fetch|Load failed|NetworkError/.test( message ) ) {
					return 'Приложение работает как мини-приложение в MAX. Откройте его из чата с ботом управляющей компании.'
				}
				if( this.broken( message ) ) {
					return 'Локальная копия данных повреждена. Нажмите «Сбросить локальные данные», заявки и роль хранятся у бота и вернутся после перезагрузки.'
				}
				return message
			}
		}

		broken( message: string ) {
			return /No Seal for/.test( message )
		}

		heal() {
			if( this.waiting() ) return
			let message = ''
			try {
				this.uk().Houses()
			} catch( error ) {
				if( $mol_promise_like( error ) ) return
				message = ( error as Error ).message
			}
			if( !this.broken( message ) ) return
			const last = Number( this.$.$mol_state_local.value( '$bog_max_healed' ) ?? 0 )
			if( Date.now() - last < 60_000 ) return
			this.$.$mol_state_local.value( '$bog_max_healed', Date.now() )
			this.reset()
		}

		@ $mol_action
		reset() {
			const win = this.$.$mol_dom_context
			const request = win.indexedDB.deleteDatabase( '$giper_baza_mine' )
			const reload = ()=> win.location.reload()
			request.onsuccess = reload
			request.onerror = reload
			request.onblocked = reload
			setTimeout( reload, 3000 )
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

		role() {
			try {
				return this.session().role
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return 'resident'
			}
		}

		staff() {
			return this.role() !== 'resident'
		}

		admin() {
			return this.role() === 'admin'
		}

		@ $mol_mem
		my_houses() {
			if( this.admin() ) return this.house_options()
			const duty = this.session().duty ?? []
			return this.house_options().filter( link => duty.includes( link ) )
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
				case 'dispatch': return 'Диспетчер'
				case 'admin': return 'Админ'
			}
			return 'Мои заявки'
		}

		@ $mol_mem
		main_body() {
			if( this.waiting() ) return [ this.Wait() ]
			if( this.fail() ) return [ this.Fail(), this.Reset() ]
			switch( this.section() ) {
				case 'house': return !this.house() ? [ this.House_pick(), this.House_missing() ] : [
					this.House_pick(),
					this.House_tabs(),
					... this.house_tab() === 'news'
						? [ this.news_rows().length ? this.News() : this.News_empty() ]
						: [ this.Search(), this.house_rows().length ? this.House_rows() : this.House_empty() ],
				]
				case 'account': return [
					this.Account_head(),
					this.Account_id(),
					this.Account_house(),
					this.Account_count(),
					this.Account_note(),
					this.Account_role(),
					this.Account_code(),
					this.Account_code_note(),
					this.Account_demo(),
					this.Reset(),
				]
				case 'dispatch': return this.staff() ? [
					this.Admin_title(),
					this.admin_rows().length ? this.Admin_rows() : this.Admin_empty(),
					this.All_link(),
					this.Qr_title(),
					this.Qr_house(),
					this.Qr(),
					this.Qr_link(),
					this.Qr_print(),
					this.Post_form(),
				] : [ this.Fail() ]
				case 'admin': return this.admin() ? [
					this.Stats_link(),
					this.House_form(),
					this.Houses_title(),
					this.Admin_houses(),
					this.Staff_title(),
					... this.staff_link() ? [ this.Staff_invite(), this.Staff_qr() ] : [],
					this.Staff_form(),
					this.Orgs_title(),
					this.Orgs(),
				] : [ this.Fail() ]
			}
			return [
				... this.house() ? [ this.New_link(), this.House_title() ] : [ this.House_missing() ],
				... this.mine().length ? [ this.Rows() ] : this.house() ? [ this.Empty() ] : [],
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
				... fix ? [ `до ${ fix.toOffset().toString( 'DD.MM hh:mm' ) }` ] : [],
				... voices ? [ `поддержали: ${ voices }` ] : [],
			].join( ', ' )
		}

		@ $mol_mem
		neighbours() {
			const house = this.house()
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
			const house = this.house()
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
			if( since && till ) return `с ${ since.toOffset().toString( 'DD.MM hh:mm' ) } до ${ till.toOffset().toString( 'DD.MM hh:mm' ) }`
			return post.Created()?.val()?.toString( 'DD.MM.YYYY' ) ?? ''
		}

		news_text( link: string ) {
			return this.post( link ).Text()?.val() ?? ''
		}

		account_head() {
			return [
				this.account_photo() ? this.Account_photo() : this.Account_avatar(),
				this.Account_titles(),
			]
		}

		account_titles() {
			return [
				this.Account_name(),
				... this.account_username() ? [ this.Account_username() ] : [],
			]
		}

		account_name() {
			return this.session().user.name || 'Без имени'
		}

		account_username() {
			const username = this.session().user.username ?? ''
			return username ? '@' + username : ''
		}

		account_photo() {
			return this.session().user.photo ?? ''
		}

		account_id() {
			return String( this.session().user.id )
		}

		account_role() {
			switch( this.role() ) {
				case 'admin': return 'Админ УК: заводит дома и сотрудников'
				case 'dispatcher': return `Диспетчер, домов: ${ this.my_houses().length }`
			}
			return 'Житель'
		}

		account_code() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		staff_link() {
			return this.session().staff_link ?? ''
		}

		@ $mol_action
		staff_add() {
			const code = this.staff_code().trim()
			if( !code ) return
			this.uk().Staff( 'auto' )!.key( code, 'auto' )!.val( this.staff_role() )
			this.uk().Duty( 'auto' )!.key( code, 'auto' )!.val( this.staff_houses().join( ',' ) )
			this.staff_code( '' )
			this.staff_houses( [] )
		}

		@ $mol_mem
		house_tried( next = false ) {
			return next
		}

		@ $mol_mem
		house_address_bids() {
			return !this.house_tried() || this.house_address_new().trim() ? [] : [ 'Нужен адрес' ]
		}

		slug( text: string ) {
			const map: Record< string, string > = {
				а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
				н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
				ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
			}
			return text.toLowerCase()
				.replace( /ул\.|улица|пр\.|проспект|д\.|дом|к\.|корпус|стр\./g, ' ' )
				.split( '' ).map( char => map[ char ] ?? char ).join( '' )
				.replace( /[^a-z0-9]+/g, '' )
				.slice( 0, 24 )
		}

		@ $mol_action
		house_add() {
			const address = this.house_address_new().trim()
			if( !address ) {
				this.house_tried( true )
				return
			}
			const uk = this.uk()
			const taken = new Set( uk.Houses()?.remote_list().map( house => house.Code()?.val() ?? '' ) ?? [] )
			let code = this.slug( address ) || 'house'
			while( taken.has( code ) ) code += Math.floor( Math.random() * 10 )
			const house = uk.Houses( 'auto' )!.make( null )
			house.Address( 'auto' )!.val( address )
			house.Code( 'auto' )!.val( code )
			this.house_address_new( '' )
			this.house_tried( false )
		}

		admin_house_rows() {
			return this.house_options().map( link => this.Admin_house( link ) )
		}

		house_code( link: string ) {
			return this.house_of( link ).Code()?.val() ?? ''
		}

		@ $mol_mem
		house_removing( next = '' ) {
			return next
		}

		house_remove_title( link: string ) {
			return this.house_removing() === link ? 'Точно удалить?' : ''
		}

		@ $mol_action
		house_remove( link: string ) {
			if( this.house_removing() !== link ) {
				this.house_removing( link )
				return
			}
			this.house_removing( '' )
			this.uk().Houses( 'auto' )!.cut( new $giper_baza_link( link ) )
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
			if( this.staff() ) return this.my_houses()[0] ?? ''
			return ''
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
		category( next?: string ) {
			const value = next ?? ''
			return this.category_options().includes( value ) ? value : ''
		}

		@ $mol_mem
		category_dictionary() {
			return {
				'': 'Выберите категорию',
				... Object.fromEntries( this.categories().map( category => [ category.link().str, category.Title()?.val() ?? '' ] ) ),
			}
		}

		@ $mol_mem
		tried( next = false ) {
			return next
		}

		category_valid() {
			return this.category_options().includes( this.category() )
		}

		place_valid() {
			return Boolean( this.place().trim() )
		}

		@ $mol_mem
		category_bids() {
			return !this.tried() || this.category_valid() ? [] : [ 'Выберите категорию' ]
		}

		@ $mol_mem
		place_bids() {
			return !this.tried() || this.place_valid() ? [] : [ 'Укажите, где именно' ]
		}

		photo_limit() {
			return 5
		}

		@ $mol_mem
		photo_files( next?: readonly File[] ) {
			return next ?? []
		}

		@ $mol_mem
		photo_picked( next?: readonly File[] ) {
			if( next?.length ) this.photo_files( [ ... this.photo_files(), ... next ].slice( 0, this.photo_limit() ) )
			return [] as readonly File[]
		}

		photo_pick_label() {
			const count = this.photo_files().length
			if( !count ) return 'Фото или видео по желанию'
			return count < this.photo_limit() ? `Файлов: ${ count }, можно ещё ${ this.photo_limit() - count }` : `Файлов: ${ count }, это максимум`
		}

		photo_key( file: File ) {
			return `${ file.name }:${ file.size }:${ file.lastModified }`
		}

		photo_file( key: string ) {
			return this.photo_files().find( file => this.photo_key( file ) === key ) ?? null
		}

		photo_previews() {
			return this.photo_files().map( file => this.Photo_item( this.photo_key( file ) ) )
		}

		@ $mol_mem_key
		photo_url( key: string ) {
			const file = this.photo_file( key )
			return file ? URL.createObjectURL( file ) : ''
		}

		photo_is_video( key: string ) {
			return this.photo_file( key )?.type.startsWith( 'video/' ) ?? false
		}

		photo_item_sub( key: string ) {
			return [
				this.photo_is_video( key ) ? this.Photo_video( key ) : this.Photo_open( key ),
				this.Photo_drop( key ),
			]
		}

		@ $mol_action
		photo_drop( key: string ) {
			this.photo_files( this.photo_files().filter( file => this.photo_key( file ) !== key ) )
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
				this.House_field(),
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
			if( !this.house_options().length ) return [ this.House_missing() ]
			return [
				this.Form(),
				... this.similar().length ? [ this.Similar_title(), this.Similar() ] : [],
			]
		}

		@ $mol_action
		submit() {
			if( !this.category_valid() || !this.place_valid() ) {
				this.tried( true )
				return
			}
			const uk = this.uk()
			const house = this.house_of( this.house() )
			const category = this.category_of( this.category() )
			const author = this.user_id()
			const files = this.photo_files()
			const created = new $mol_time_moment()
			const ticket = uk.Tickets( 'auto' )!.make( null )
			ticket.House( 'auto' )!.remote( house )
			ticket.Category( 'auto' )!.remote( category )
			ticket.Entrance( 'auto' )!.val( this.entrance() )
			ticket.Place( 'auto' )!.val( this.place() )
			ticket.Text( 'auto' )!.val( this.text() )
			ticket.Author( 'auto' )!.val( author )
			ticket.Created( 'auto' )!.val( created )
			if( files.length ) this.sent_files_at( Date.now() )
			for( const file of files ) {
				const store = ticket.Photos( 'auto' )!.make( null )
				store.blob( file )
			}
			if( files.length ) {
				const store = ticket.Photo( 'auto' )!.ensure( null )!
				store.blob( files[0] )
				ticket.Photo( 'auto' )!.remote( store )
			}
			this.place( '' )
			this.text( '' )
			this.entrance( '' )
			this.category( '' )
			this.photo_files( [] )
			this.tried( false )
			this.$.$mol_state_arg.dict({ ... this.$.$mol_state_arg.dict(), screen: null, ticket: ticket.link().str })
		}

		@ $mol_mem
		sent_files_at( next = 0 ) {
			return next
		}

		uploading() {
			const at = this.sent_files_at()
			if( !at ) return false
			return this.$.$mol_state_time.now( 1000 ) - at < 15000
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
				... this.screen() === 'all' && this.staff() ? [ this.All() ] : [],
				... this.screen() === 'stats' && this.admin() ? [ this.Stats() ] : [],
				... this.ticket_link() ? [ this.Ticket() ] : [],
			]
		}

		ticket_body() {
			return [
				this.Ticket_status(),
				... this.uploading() ? [ this.Ticket_uploading() ] : [],
				... this.ticket_note() ? [ this.Ticket_note() ] : [],
				... this.ticket_media().length ? [ this.Ticket_media() ] : [],
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

		ticket_media_links() {
			const ticket = this.current()
			const list = ( ticket.Photos()?.items() ?? [] ).map( link => link.str )
			if( list.length ) return list
			const one = ticket.Photo()?.val()?.str
			return one ? [ one ] : []
		}

		ticket_media() {
			return this.ticket_media_links().map( link => this.Ticket_item( link ) )
		}

		ticket_item_sub( link: string ) {
			const file = this.$.$giper_baza_glob.Pawn( new $giper_baza_link( link ), $giper_baza_file )
			return [ file.type().startsWith( 'video/' ) ? this.Ticket_video( link ) : this.Ticket_image( link ) ]
		}

		ticket_media_url( link: string ) {
			return `${ this.bot_url() }?BAZA:file=${ link };name=file`
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
			return this.current().react_till()?.toOffset().toString( 'DD.MM.YYYY hh:mm' ) ?? 'не нормируется'
		}

		ticket_fix() {
			return this.current().fix_till()?.toOffset().toString( 'DD.MM.YYYY hh:mm' ) ?? ''
		}

		ticket_basis() {
			return this.current().category()?.Basis()?.val() ?? ''
		}

		voices_text() {
			const count = this.current().voices()
			if( this.own() ) return count ? `Ваша заявка, поддержали: ${ count }` : 'Ваша заявка, поддержать могут соседи'
			return count ? `Поддержали: ${ count }` : 'Пока никто не поддержал'
		}

		own() {
			return this.current().Author()?.val() === this.user_id()
		}

		voice_allowed() {
			if( this.own() ) return false
			const keys = this.current().Voices()?.keys().map( String ) ?? []
			return !keys.includes( this.user_id() )
		}

		@ $mol_action
		voice() {
			if( !this.voice_allowed() ) return
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
			return `${ new $mol_time_moment( time ).toOffset().toString( 'DD.MM hh:mm' ) }: ${ label }`
		}

		@ $mol_mem
		all() {
			const houses = this.my_houses()
			return this.uk().tickets()
				.filter( ticket => houses.includes( ticket.House()?.val()?.str ?? '' ) )
				.map( ticket => ticket.link().str )
				.reverse()
		}

		@ $mol_mem
		recent() {
			return this.all()
				.filter( link => ![ 'done', 'rejected' ].includes( this.status_of( link ) ) )
				.slice( 0, 5 )
		}

		admin_rows() {
			return this.recent().map( link => this.Admin_row( link ) )
		}

		all_title() {
			return `Все заявки: ${ this.all().length }`
		}

		all_status_options() {
			return [ '', ... Object.keys( $bog_max_status ) ]
		}

		all_status_dictionary() {
			return { '': 'Любой статус', ... $bog_max_status }
		}

		@ $mol_mem
		found() {
			const status = this.all_status()
			return this.all()
				.filter( link => !status || this.status_of( link ) === status )
				.filter( $mol_match_text( this.all_query(), link => {
					const ticket = this.ticket( link )
					return [
						String( this.number( link ) ),
						ticket.category()?.Title()?.val() ?? '',
						ticket.house()?.Address()?.val() ?? '',
						ticket.Entrance()?.val() ?? '',
						ticket.Place()?.val() ?? '',
						ticket.Text()?.val() ?? '',
					]
				} ) )
		}

		all_rows() {
			return this.found().map( link => this.Admin_row( link ) )
		}

		stats_house_options() {
			return [ '', ... this.house_options() ]
		}

		stats_house_dictionary() {
			return { '': 'Все дома', ... this.house_dictionary() }
		}

		@ $mol_mem
		stats_since() {
			const period = this.stats_period()
			if( period === 'all' ) return null
			return new $mol_time_moment().shift({ day: -Number( period ) })
		}

		@ $mol_mem
		stats_tickets() {
			const since = this.stats_since()
			const house = this.stats_house()
			return this.uk().tickets()
				.filter( ticket => !house || ticket.House()?.val()?.str === house )
				.filter( ticket => !since || ( ticket.Created()?.val()?.valueOf() ?? 0 ) >= since.valueOf() )
				.map( ticket => ticket.link().str )
		}

		measure( links: readonly string[] ) {
			const lords = this.lords()
			const now = new $mol_time_moment()
			let open = 0, overdue = 0, done = 0, voices = 0, reacted = 0, react_hours = 0
			for( const link of links ) {
				const ticket = this.ticket( link )
				voices += ticket.voices()
				const status = ticket.status_by( lords )
				const log = ticket.log_by( lords )
				const created = ticket.Created()?.val()
				const moved = log.find( ([ , state ])=> state !== 'new' )?.[0]
				if( created && moved ) {
					++ reacted
					react_hours += ( new $mol_time_moment( moved ).valueOf() - created.valueOf() ) / 3600000
				}
				if( status === 'done' ) { ++ done; continue }
				if( status === 'rejected' ) continue
				++ open
				const fix = ticket.fix_till()
				if( fix && fix.valueOf() < now.valueOf() ) ++ overdue
			}
			return { total: links.length, open, overdue, done, voices, react: reacted ? react_hours / reacted : null }
		}

		hours( value: number | null ) {
			if( value === null ) return 'нет данных'
			if( value < 1 ) return `${ Math.round( value * 60 ) } мин`
			if( value < 48 ) return `${ Math.round( value ) } ч`
			return `${ Math.round( value / 24 ) } дн`
		}

		@ $mol_mem
		summary() {
			const m = this.measure( this.stats_tickets() )
			return [
				[ 'total', String( m.total ), 'заявок за период' ],
				[ 'open', String( m.open ), 'открытых' ],
				[ 'overdue', String( m.overdue ), 'просрочено по нормативу' ],
				[ 'done', String( m.done ), 'выполнено' ],
				[ 'react', this.hours( m.react ), 'среднее время до реакции' ],
				[ 'voices', String( m.voices ), 'голосов соседей' ],
			] as const
		}

		summary_rows() {
			return this.summary().map( ([ id ])=> this.Summary( id ) )
		}

		summary_value( id: string ) {
			return this.summary().find( ([ key ])=> key === id )?.[1] ?? ''
		}

		summary_label( id: string ) {
			return this.summary().find( ([ key ])=> key === id )?.[2] ?? ''
		}

		owner_stat_rows() {
			return Object.keys( $bog_max_owner ).map( owner => this.Owner_stat( owner ) )
		}

		owner_stat_name( owner: string ) {
			return $bog_max_owner[ owner as keyof typeof $bog_max_owner ] ?? owner
		}

		owner_stat_line( owner: string ) {
			const links = this.stats_tickets().filter( link => this.ticket( link ).category()?.Owner()?.val() === owner )
			const m = this.measure( links )
			return `всего ${ m.total }, открытых ${ m.open }, просрочено ${ m.overdue }, выполнено ${ m.done }, реакция ${ this.hours( m.react ) }`
		}

		stats_rows() {
			return this.house_options().map( link => this.Stat( link ) )
		}

		stat_house( link: string ) {
			return this.house_address( link )
		}

		stat_line( link: string ) {
			const links = this.stats_tickets().filter( item => this.ticket( item ).House()?.val()?.str === link )
			const m = this.measure( links )
			return `всего ${ m.total }, открытых ${ m.open }, просрочено ${ m.overdue }, выполнено ${ m.done }, голосов соседей ${ m.voices }`
		}

		org_rows() {
			return Object.keys( $bog_max_owner ).map( owner => this.Org( owner ) )
		}

		org_name( owner: string ) {
			return $bog_max_owner[ owner as keyof typeof $bog_max_owner ] ?? owner
		}

		org_state( owner: string ) {
			const keyed = ( this.session().integrations ?? [] ).includes( owner )
			const seen = this.uk().org_seen( this.session().lord, owner )
			const when = seen ? `последний запрос ${ new $mol_time_moment( seen ).toString( 'DD.MM hh:mm' ) }` : 'запросов ещё не было'
			return keyed ? `ключ API выдан, ${ when }` : 'ключ API не выдан, заявки видны только диспетчеру'
		}

		status_options() {
			return Object.keys( $bog_max_status )
		}

		status_dictionary() {
			return $bog_max_status
		}

		@ $mol_mem_key
		admin_row_sub( link: string ) {
			return [
				this.Row( link ),
				this.Admin_status( link ),
				... this.status_of( link ) === 'rejected' ? [ this.Admin_note( link ) ] : [],
			]
		}

		@ $mol_mem_key
		admin_note( link: string, next?: string ) {
			const ticket = this.ticket( link )
			if( next !== undefined ) ticket.Note( 'auto' )!.val( next )
			return ticket.note_by( this.lords() )
		}

		admin_status( link: string, next?: string ) {
			if( next !== undefined ) {
				const ticket = this.ticket( link )
				ticket.Status( 'auto' )!.val( next )
				ticket.Log( 'auto' )!.key( new $mol_time_moment().toString(), 'auto' )!.val( next )
				return next
			}
			return this.status_of( link )
		}

		@ $mol_mem
		qr_house( next?: string ) {
			const houses = this.my_houses()
			if( next !== undefined && houses.includes( next ) ) return next
			return houses.includes( this.house() ) ? this.house() : houses[0] ?? ''
		}

		qr_uri() {
			const code = this.house_of( this.qr_house() ).Code()?.val() ?? ''
			const bot = this.session().bot
			if( bot ) return `https://max.ru/${ bot }?start=house_${ code }`
			const location = this.$.$mol_dom_context.location
			return `${ location.origin }${ location.pathname }#!house=${ code }`
		}

		@ $mol_action
		qr_print() {
			const svg = this.Qr().dom_node().outerHTML
			const address = this.house_address( this.qr_house() )
			const win = this.$.$mol_dom_context.open( '', '_blank' )
			if( !win ) return
			win.document.write( `<!doctype html><html><head><meta charset="utf-8"><title>${ address }</title>
				<style>body{font-family:system-ui;text-align:center;padding:2rem} svg{width:60vmin;height:60vmin} h1{font-size:1.5rem} p{color:#555}</style></head>
				<body><h1>${ address }</h1><p>Наведите камеру, чтобы сообщить о проблеме в доме</p>${ svg }<p>${ this.qr_uri() }</p></body></html>` )
			win.document.close()
			win.focus()
			win.print()
		}

		@ $mol_mem
		post_tried( next = false ) {
			return next
		}

		@ $mol_mem
		post_title_bids() {
			return !this.post_tried() || this.post_title().trim() ? [] : [ 'Нужен заголовок' ]
		}

		@ $mol_mem
		post_house( next?: string ) {
			const houses = this.my_houses()
			if( next !== undefined && houses.includes( next ) ) return next
			return houses.includes( this.house() ) ? this.house() : houses[0] ?? ''
		}

		@ $mol_action
		post_add() {
			if( !this.post_title().trim() ) {
				this.post_tried( true )
				return
			}
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
			this.post_tried( false )
		}

	}

}
