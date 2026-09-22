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
				$mol_wire_async( this ).seen( owner )
				return owner
			}
			return ''
		}

		dump_full( ticket: $bog_max_ticket ) {
			return { ... this.dump( ticket ), log: ticket.log_by( this.bot().lords() ) }
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
				owner: ticket.owner_by( lords ),
				owner_default: category?.Owner()?.val() ?? '',
				alarm: ticket.alarmed() || null,
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
			}
		}

		seen( owner: string ) {
			const now = new $mol_time_moment()
			const last = this.bot().uk().Orgs()?.key( owner )?.val() ?? ''
			if( last && now.valueOf() - new $mol_time_moment( last ).valueOf() < 600_000 ) return
			this.bot().uk().Orgs( 'auto' )!.key( owner, 'auto' )!.val( now.toString() )
		}

		file_uri( link?: string | null ) {
			return link ? `?BAZA:file=${ link };name=file` : null
		}

		owners() {
			return this.bot().env_list( 'ORG_KEYS' ).map( pair => pair.split( ':' )[0] ).filter( Boolean )
		}

		cache = new Map< string, readonly ReturnType< $bog_max_bot_org[ 'dump' ] >[] >()

		@ $mol_mem
		warm() {
			return this.owners().map( owner => {
				const list = this.tickets_of( owner )
				this.cache.set( owner, list )
				return list.length
			} )
		}

		@ $mol_mem_key
		dump_of( link: string ) {
			const ticket = this.bot().ticket( link )
			return ticket ? this.dump( ticket ) : null
		}

		@ $mol_mem_key
		owner_of( link: string ) {
			return this.bot().ticket( link )?.owner_by( this.bot().lords() ) ?? ''
		}

		@ $mol_mem_key
		tickets_of( owner: string ) {
			return [ ... this.bot().ticket_map().values() ]
				.map( ticket => ticket.link().str )
				.filter( link => this.owner_of( link ) === owner )
				.map( link => this.dump_of( link ) )
				.filter( ( dump ): dump is ReturnType< $bog_max_bot_org[ 'dump' ] > => dump !== null )
		}

		GET( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			if( msg.uri().pathname !== '/tickets' ) return msg.reply( 'Есть только GET /org/tickets и POST /org/status', { code: 404 } )
			msg.reply({ owner, tickets: this.cache.get( owner ) ?? this.tickets_of( owner ) })
		}

		POST( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			const path = msg.uri().pathname
			if( ![ '/status', '/transfer', '/dispute', '/escalate' ].includes( path ) ) return msg.reply( 'Есть GET /org/tickets и POST /org/status, /org/transfer, /org/dispute, /org/escalate', { code: 404 } )
			const body = msg.data() as null | { ticket?: string, status?: string, note?: string, to?: string, reason?: string }
			if( !body || typeof body !== 'object' ) return msg.reply( 'Ожидается JSON с полем ticket', { code: 422 } )
			const link = String( body.ticket ?? '' )
			const ticket = this.bot().ticket( link )
			if( !ticket ) return msg.reply( 'Заявка не найдена', { code: 404 } )
			const dump = this.dump_of( link )!
			if( dump.owner !== owner ) return msg.reply( 'Заявка адресована другой организации', { code: 403 } )
			const reason = String( body.reason ?? body.note ?? '' )
			const later = $mol_wire_async( this.bot() )
			let after = {} as Record< string, unknown >
			switch( path ) {
				case '/status': {
					const status = String( body.status ?? '' )
					if( !( status in $bog_max_status ) ) return msg.reply( `Статус один из: ${ Object.keys( $bog_max_status ).join( ', ' ) }`, { code: 422 } )
					later.set_status( ticket, status, reason )
					after = { status, note: reason }
					break
				}
				case '/transfer': {
					const to = String( body.to ?? '' )
					if( !( to in $bog_max_owner ) ) return msg.reply( `Организация одна из: ${ Object.keys( $bog_max_owner ).join( ', ' ) }`, { code: 422 } )
					if( to === owner ) return msg.reply( 'Заявка и так у вас', { code: 422 } )
					if( !reason.trim() ) return msg.reply( 'Нужна причина передачи в поле reason', { code: 422 } )
					later.set_owner( ticket, to, reason )
					after = { owner: to, note: reason }
					break
				}
				case '/dispute': {
					const last = ticket.log_by( this.bot().lords() ).at( -1 )?.[1] ?? ''
					if( last !== 'to:' + owner ) return msg.reply( 'Оспорить можно только передачу, которая пришла к вам последней', { code: 409 } )
					if( !reason.trim() ) return msg.reply( 'Нужна причина в поле reason', { code: 422 } )
					const back = ticket.owner_before( this.bot().lords() )
					later.set_owner( ticket, back, reason, true )
					after = { owner: back, note: reason }
					break
				}
				case '/escalate': {
					if( !reason.trim() ) return msg.reply( 'Нужна причина в поле reason', { code: 422 } )
					later.set_status( ticket, 'escalated', reason )
					after = { status: 'escalated', note: reason }
					break
				}
			}
			msg.reply({ ... this.dump_full( ticket ), ... after })
		}

	}

}
