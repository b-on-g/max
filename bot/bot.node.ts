namespace $ {

	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = ()=> []

	if( process.env.BAZA_AUTH ) $giper_baza_auth.embryos.push( process.env.BAZA_AUTH )

	export class $bog_max_bot extends $giper_baza_app_node {

		env() {
			return this.$.$mol_env()
		}

		env_list( name: string ) {
			return ( this.env()[ name ] ?? '' ).split( ',' ).map( item => item.trim() ).filter( Boolean )
		}

		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		lords() {
			return this.uk().staff_by( this.lord() )
		}

		@ $mol_memo.method
		auth() {
			return $bog_max_bot_auth.make({ bot: ()=> this })
		}

		@ $mol_memo.method
		org() {
			return $bog_max_bot_org.make({ bot: ()=> this })
		}

		@ $mol_memo.method
		api() {
			return $bog_max_bot_api.make({
				token: ()=> this.env().BOT_TOKEN ?? '',
				app: ()=> this.env().APP_URL ?? '',
			})
		}

		@ $mol_mem
		bot_name() {
			const named = this.env().BOT_NAME ?? ''
			if( named ) return named
			if( !this.env().BOT_TOKEN ) return ''
			return $mol_wire_sync( this.api().client().api ).getMyInfo().username ?? ''
		}

		start_link( payload: string ) {
			const name = this.bot_name()
			return name ? `https://max.ru/${ name }?start=${ payload }` : ''
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

		ticket( link: string ) {
			return this.uk().tickets().find( ticket => ticket.link().str === link ) ?? null
		}

		message( ticket: $bog_max_ticket ) {
			const lords = this.lords()
			const status = ticket.status_by( lords )
			const label = $bog_max_status[ status as keyof typeof $bog_max_status ] ?? status
			const lines = [ `Заявка № ${ this.uk().ticket_number( ticket ) }: ${ label }` ]
			const note = ticket.note_by( lords )
			if( status !== 'new' ) {
				if( note ) lines.push( note )
				return lines.join( '\n' )
			}
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

		set_status( ticket: $bog_max_ticket, status: string, note = '' ) {
			ticket.Status( 'auto' )!.val( status )
			ticket.Note( 'auto' )!.val( note )
			ticket.Log( 'auto' )!.key( new $mol_time_moment().toString(), 'auto' )!.val( status )
		}

		@ $mol_mem
		notified() {
			const uk = this.uk()
			for( const ticket of uk.tickets() ) {
				if( !ticket.status_by( this.lords() ) ) this.set_status( ticket, 'new' )
				const status = ticket.status_by( this.lords() )
				const key = ticket.link().str
				if( uk.Notified()?.key( key )?.val() === status ) continue
				const author = Number( ticket.Author()?.val() ?? '' )
				if( author && this.env().BOT_TOKEN ) try {
					$mol_wire_sync( this.api() ).send( author, this.message( ticket ), key )
				} catch( error ) {
					if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
					this.$.$mol_log3_fail({ place: this, ticket: key, message: String( error ) })
				}
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
