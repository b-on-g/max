namespace $ {

	export class $bog_max_bot_org extends $mol_rest_resource {

		bot() {
			return null! as $bog_max_bot
		}

		owner( msg: $mol_rest_message ) {
			const header = String( ( msg as any ).input?.headers?.authorization ?? '' )
			const key = header.replace( /^Bearer\s+/i, '' ).trim()
			if( !key ) return ''
			for( const pair of this.bot().env_list( 'ORG_KEYS' ) ) {
				const [ owner, secret ] = pair.split( ':' )
				if( secret !== key ) continue
				this.bot().uk().Orgs( 'auto' )!.key( owner, 'auto' )!.val( new $mol_time_moment().toString() )
				return owner
			}
			return ''
		}

		dump( ticket: $bog_max_ticket ) {
			const bot = this.bot()
			const lords = bot.lords()
			const category = ticket.category()
			return {
				link: ticket.link().str,
				number: bot.uk().ticket_number( ticket ),
				status: ticket.status_by( lords ),
				note: ticket.note_by( lords ),
				category: category?.Title()?.val() ?? '',
				owner: category?.Owner()?.val() ?? '',
				house: ticket.house()?.Address()?.val() ?? '',
				entrance: ticket.Entrance()?.val() ?? '',
				place: ticket.Place()?.val() ?? '',
				text: ticket.Text()?.val() ?? '',
				photo: this.file_uri( ticket.Photo()?.val()?.str ),
				photos: ( ticket.Photos()?.items() ?? [] ).map( link => this.file_uri( link.str ) ),
				voices: ticket.voices(),
				created: ticket.Created()?.val()?.toString() ?? null,
				react_till: ticket.react_till()?.toString() ?? null,
				fix_till: ticket.fix_till()?.toString() ?? null,
				log: ticket.log_by( lords ),
			}
		}

		file_uri( link?: string | null ) {
			return link ? `?BAZA:file=${ link };name=file` : null
		}

		@ $mol_mem_key
		dump_of( link: string ) {
			const ticket = this.bot().ticket( link )
			return ticket ? this.dump( ticket ) : null
		}

		@ $mol_mem_key
		owner_of( link: string ) {
			return this.bot().ticket( link )?.category()?.Owner()?.val() ?? ''
		}

		owners() {
			return this.bot().env_list( 'ORG_KEYS' ).map( pair => pair.split( ':' )[0] ).filter( Boolean )
		}

		@ $mol_mem
		warm() {
			return this.owners().map( owner => this.tickets_of( owner ).length )
		}

		@ $mol_mem_key
		tickets_of( owner: string ) {
			return this.bot().uk().tickets()
				.map( ticket => ticket.link().str )
				.filter( link => this.owner_of( link ) === owner )
				.map( link => this.dump_of( link ) )
				.filter( dump => dump !== null )
		}

		GET( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			if( msg.uri().pathname !== '/tickets' ) return msg.reply( 'Есть только GET /org/tickets и POST /org/status', { code: 404 } )
			msg.reply({ owner, tickets: this.tickets_of( owner ) })
		}

		POST( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			if( msg.uri().pathname !== '/status' ) return msg.reply( 'Есть только GET /org/tickets и POST /org/status', { code: 404 } )
			const body = msg.data() as null | { ticket?: string, status?: string, note?: string }
			if( !body || typeof body !== 'object' ) return msg.reply( 'Ожидается JSON с полями ticket, status, note', { code: 422 } )
			const status = String( body.status ?? '' )
			if( !( status in $bog_max_status ) ) return msg.reply( `Статус один из: ${ Object.keys( $bog_max_status ).join( ', ' ) }`, { code: 422 } )
			const link = String( body.ticket ?? '' )
			const ticket = this.bot().ticket( link )
			if( !ticket ) return msg.reply( 'Заявка не найдена', { code: 404 } )
			if( this.owner_of( link ) !== owner ) return msg.reply( 'Заявка адресована другой организации', { code: 403 } )
			this.bot().set_status( ticket, status, String( body.note ?? '' ) )
			msg.reply( this.dump_of( link ) )
		}

	}

}
