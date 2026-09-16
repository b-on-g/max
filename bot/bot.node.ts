namespace $ {

	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = ()=> []

	if( process.env.BAZA_AUTH ) $giper_baza_auth.embryos.push( process.env.BAZA_AUTH )

	export class $bog_max_bot extends $giper_baza_app_node {

		env() {
			return this.$.$mol_env()
		}

		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		@ $mol_memo.method
		auth() {
			return $bog_max_bot_auth.make({ bot: ()=> this })
		}

		@ $mol_memo.method
		api() {
			return $bog_max_bot_api.make({
				token: ()=> this.env().BOT_TOKEN ?? '',
				app: ()=> this.env().APP_URL ?? '',
			})
		}

		check( init_data: string ) {
			if( this.env().DEV_SKIP_VALIDATION === '1' ) return $bog_max_bot_check.unsafe( init_data )
			return $bog_max_bot_check.user( init_data, this.env().BOT_TOKEN ?? '' )
		}

		@ $mol_mem
		uk_link() {
			const stored = String( this.$.$mol_state_local.value( '$bog_max_uk' ) ?? '' )
			if( stored ) return stored
			const land = this.$.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])
			$bog_max_seed( land.Data( $bog_max_uk ) )
			const link = land.link().str
			this.$.$mol_state_local.value( '$bog_max_uk', link )
			return link
		}

		uk_land() {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( this.uk_link() ) )
		}

		uk() {
			return this.uk_land().Data( $bog_max_uk )
		}

		message( ticket: $bog_max_ticket ) {
			const status = ticket.status_by( this.lord() )
			const label = $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
			const lines = [ `Заявка № ${ this.uk().ticket_number( ticket ) }: ${ label }` ]
			if( status !== 'new' ) return lines.join( '\n' )
			const category = ticket.category()
			const owner = $bog_max_owner[ category?.Owner()?.val() as keyof typeof $bog_max_owner ] ?? ''
			lines.push( `${ category?.Title()?.val() ?? '' }, ${ ticket.Place()?.val() ?? '' }` )
			lines.push( `Ответственный: ${ owner }` )
			const react = ticket.react_till()
			if( react ) lines.push( `Реакция по нормативу: до ${ react.toString( 'DD.MM hh:mm' ) }` )
			const fix = ticket.fix_till()
			if( fix ) lines.push( `Устранение по нормативу: до ${ fix.toString( 'DD.MM hh:mm' ) }` )
			lines.push( `Основание: ${ category?.Basis()?.val() ?? '' }` )
			return lines.join( '\n' )
		}

		register( ticket: $bog_max_ticket ) {
			ticket.Status( 'auto' )!.val( 'new' )
			ticket.Log( 'auto' )!.key( new $mol_time_moment().toString(), 'auto' )!.val( 'new' )
		}

		@ $mol_mem
		notified() {
			const uk = this.uk()
			for( const ticket of uk.tickets() ) {
				if( !ticket.status_by( this.lord() ) ) this.register( ticket )
				const status = ticket.status_by( this.lord() )
				const key = ticket.link().str
				if( uk.Notified()?.key( key )?.val() === status ) continue
				const author = Number( ticket.Author()?.val() ?? '' )
				if( author && this.env().BOT_TOKEN ) $mol_wire_sync( this.api() ).send( author, this.message( ticket ), key )
				uk.Notified( 'auto' )!.key( key, 'auto' )!.val( status )
			}
			return uk.tickets().length
		}

		_auto() {
			super._auto()
			if( this.env().BOT_TOKEN ) this.api().client()
			this.notified()
		}

	}

}
