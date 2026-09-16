namespace $.$$ {

	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = ()=> {
		const url = $bog_max_app.Root( 0 ).bot_url()
		return url ? [ url ] : []
	}

	export type $bog_max_app_session = {
		land: string
		lord: string
		house: string | null
		user: { id: number, name: string }
	}

	export class $bog_max_app extends $.$bog_max_app {

		platform() {
			return $bog_max_bridge.platform()
		}

		auto() {
			$bog_max_bridge.ready()
		}

		bot_url() {
			const arg = this.$.$mol_state_arg.value( 'bot' )
			if( arg ) return arg
			const location = this.$.$mol_dom_context.location
			if( /\.github\.io$/.test( location.hostname ) ) return this.bot_prod()
			return location.origin + '/'
		}

		@ $mol_mem
		session(): $bog_max_app_session {
			const url = this.bot_url()
			if( !url ) $mol_fail( new Error( 'Адрес бота не задан' ) )
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			const init_data = $bog_max_bridge.init_data()
			const response = this.$.$mol_fetch.response( url + 'auth', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ init_data, pass }),
			})
			if( response.status() !== 'success' ) $mol_fail( new Error( response.text() ) )
			return response.json() as $bog_max_app_session
		}

		@ $mol_mem
		fail() {
			try {
				this.session()
				return ''
			} catch( error ) {
				if( $mol_promise_like( error ) ) return 'Подключаемся к управляющей компании…'
				return ( error as Error ).message
			}
		}

		land() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.session().land ) )
		}

		uk() {
			return this.land().Data( $bog_max_uk )
		}

		lord() {
			return this.session().lord
		}

		user_id() {
			return String( this.session().user.id )
		}

		ticket( link: string ) {
			return this.land().Pawn( $bog_max_ticket ).Head( new $giper_baza_link( link ) )
		}

		house_of( link: string ) {
			return this.land().Pawn( $bog_max_house ).Head( new $giper_baza_link( link ) )
		}

		category_of( link: string ) {
			return this.land().Pawn( $bog_max_category ).Head( new $giper_baza_link( link ) )
		}

		@ $mol_mem
		mine() {
			const user = this.user_id()
			return this.uk().tickets()
				.filter( ticket => ticket.Author()?.val() === user )
				.map( ticket => ticket.link().str )
				.reverse()
		}

		@ $mol_mem
		home_body() {
			if( this.fail() ) return [ this.Fail() ]
			return this.mine().length ? [ this.Rows() ] : [ this.Empty() ]
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

		status_label( link: string ) {
			const status = this.ticket( link ).status_by( this.lord() )
			if( !status ) return 'Отправлена, ждём регистрации'
			return $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
		}

		row_title( link: string ) {
			return `№ ${ this.number( link ) }, ${ this.ticket( link ).category()?.Title()?.val() ?? '' }`
		}

		row_status( link: string ) {
			const fix = this.ticket( link ).fix_till()
			return this.status_label( link ) + ( fix ? `, до ${ fix.toString( 'DD.MM hh:mm' ) }` : '' )
		}

		@ $mol_mem
		screen() {
			return this.$.$mol_state_arg.value( 'screen' ) ?? ''
		}

		@ $mol_mem
		ticket_link() {
			return this.$.$mol_state_arg.value( 'ticket' ) ?? ''
		}

		pages() {
			return [
				this.Home(),
				... this.screen() === 'new' ? [ this.New() ] : [],
				... this.ticket_link() ? [ this.Ticket() ] : [],
			]
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
			return next ?? this.session().house ?? this.house_options()[0] ?? ''
		}

		@ $mol_mem
		category_options() {
			return this.uk().Categories()?.remote_list().map( category => category.link().str ) ?? []
		}

		@ $mol_mem
		category_dictionary() {
			return Object.fromEntries( this.category_options().map( link => [ link, this.category_of( link ).Title()?.val() ?? '' ] ) )
		}

		@ $mol_mem
		submit_allowed() {
			return Boolean( this.house() && this.category() && this.place().trim() )
		}

		@ $mol_action
		submit() {
			const uk = this.uk()
			const house = this.house_of( this.house() )
			const category = this.category_of( this.category() )
			const author = this.user_id()
			const created = new $mol_time_moment()
			const ticket = uk.Tickets( 'auto' )!.make( null )
			ticket.House( 'auto' )!.remote( house )
			ticket.Category( 'auto' )!.remote( category )
			ticket.Place( 'auto' )!.val( this.place() )
			ticket.Text( 'auto' )!.val( this.text() )
			ticket.Author( 'auto' )!.val( author )
			ticket.Created( 'auto' )!.val( created )
			this.place( '' )
			this.text( '' )
			this.category( '' )
			this.$.$mol_state_arg.dict({ ... this.$.$mol_state_arg.dict(), screen: null, ticket: ticket.link().str })
		}

		ticket_title() {
			return `Заявка № ${ this.number( this.ticket_link() ) }`
		}

		ticket_status() {
			return this.status_label( this.ticket_link() )
		}

		ticket_category() {
			return this.ticket( this.ticket_link() ).category()?.Title()?.val() ?? ''
		}

		ticket_house() {
			return this.ticket( this.ticket_link() ).house()?.Address()?.val() ?? ''
		}

		ticket_place() {
			return this.ticket( this.ticket_link() ).Place()?.val() ?? ''
		}

		ticket_text() {
			return this.ticket( this.ticket_link() ).Text()?.val() ?? ''
		}

		ticket_owner() {
			const owner = this.ticket( this.ticket_link() ).category()?.Owner()?.val() ?? ''
			return $bog_max_owner[ owner as keyof typeof $bog_max_owner ] ?? owner
		}

		ticket_react() {
			return this.ticket( this.ticket_link() ).react_till()?.toString( 'DD.MM.YYYY hh:mm' ) ?? 'не нормируется'
		}

		ticket_fix() {
			return this.ticket( this.ticket_link() ).fix_till()?.toString( 'DD.MM.YYYY hh:mm' ) ?? ''
		}

		ticket_basis() {
			return this.ticket( this.ticket_link() ).category()?.Basis()?.val() ?? ''
		}

		@ $mol_mem
		log_rows() {
			return this.ticket( this.ticket_link() ).log_by( this.lord() ).map( ([ time ])=> this.Log_row( time ) )
		}

		log_row( time: string ) {
			const status = this.ticket( this.ticket_link() ).log_by( this.lord() ).find( ([ key ])=> key === time )?.[1] ?? ''
			const label = $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
			return `${ new $mol_time_moment( time ).toString( 'DD.MM hh:mm' ) }: ${ label }`
		}

	}

}
