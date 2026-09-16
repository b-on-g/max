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
				photo: ticket.photo()?.uri() ?? null,
				voices: ticket.voices(),
				created: ticket.Created()?.val()?.toString() ?? null,
				react_till: ticket.react_till()?.toString() ?? null,
				fix_till: ticket.fix_till()?.toString() ?? null,
				log: ticket.log_by( lords ),
			}
		}

		GET( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			if( msg.uri().pathname !== '/tickets' ) return msg.reply( 'Есть только GET /org/tickets и POST /org/status', { code: 404 } )
			const tickets = this.bot().uk().tickets()
				.filter( ticket => ticket.category()?.Owner()?.val() === owner )
				.map( ticket => this.dump( ticket ) )
			msg.reply({ owner, tickets })
		}

		POST( msg: $mol_rest_message ) {
			const owner = this.owner( msg )
			if( !owner ) return msg.reply( 'Нужен заголовок Authorization: Bearer <ключ организации>', { code: 401 } )
			if( msg.uri().pathname !== '/status' ) return msg.reply( 'Есть только GET /org/tickets и POST /org/status', { code: 404 } )
			const body = msg.data() as null | { ticket?: string, status?: string, note?: string }
			if( !body || typeof body !== 'object' ) return msg.reply( 'Ожидается JSON с полями ticket, status, note', { code: 422 } )
			const status = String( body.status ?? '' )
			if( !( status in $bog_max_status ) ) return msg.reply( `Статус один из: ${ Object.keys( $bog_max_status ).join( ', ' ) }`, { code: 422 } )
			const ticket = this.bot().ticket( String( body.ticket ?? '' ) )
			if( !ticket ) return msg.reply( 'Заявка не найдена', { code: 404 } )
			if( ticket.category()?.Owner()?.val() !== owner ) return msg.reply( 'Заявка адресована другой организации', { code: 403 } )
			this.bot().set_status( ticket, status, String( body.note ?? '' ) )
			msg.reply( this.dump( ticket ) )
		}

	}

}
