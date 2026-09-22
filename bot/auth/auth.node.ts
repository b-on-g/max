namespace $ {

	export class $bog_max_bot_auth extends $mol_rest_resource {

		bot() {
			return null! as $bog_max_bot
		}

		OPTIONS( msg: $mol_rest_message ) {
			msg.reply( null )
		}

		POST( msg: $mol_rest_message ) {

			const body = msg.data() as null | { init_data?: string, pass?: string }
			if( !body || typeof body !== 'object' ) return msg.reply( 'Ожидается JSON с полями init_data и pass', { code: 422 } )

			const bot = this.bot()
			const checked = bot.check( body.init_data ?? '' )
			if( !checked ) return msg.reply( 'Подпись MAX не прошла проверку или устарела', { code: 401 } )

			let pass: $giper_baza_auth_pass
			try {
				pass = $giper_baza_auth_pass.from( body.pass ?? '' )
			} catch {
				return msg.reply( 'Поле pass не похоже на публичный ключ', { code: 422 } )
			}

			const uk = bot.uk()
			bot.uk_land().give( pass, $giper_baza_rank_post( 'just' ) )
			const id = String( checked.user.id )
			const lord = pass.lord().str
			const prev_lord = bot.lord_of( uk.Bindings()?.key( id )?.val() ?? '' )
			if( prev_lord && prev_lord !== lord ) {
				const prev_role = uk.staff_roles( bot.lord() ).get( prev_lord )
				if( prev_role && prev_role !== 'resident' ) {
					uk.Staff( 'auto' )!.key( lord, 'auto' )!.val( prev_role )
					const prev_duty = uk.Duty()?.key( prev_lord )?.val() ?? ''
					if( prev_duty ) uk.Duty( 'auto' )!.key( lord, 'auto' )!.val( prev_duty )
				}
			}
			uk.Bindings( 'auto' )!.key( id, 'auto' )!.val( pass.toString() )

			const secret = bot.env().STAFF_SECRET ?? ''
			const invited = Boolean( secret ) && checked.start === `staff_${ secret }`
			const listed = bot.env_list( 'UK_STAFF' ).includes( String( checked.user.id ) )
			if( invited || listed ) uk.Staff( 'auto' )!.key( pass.lord().str, 'auto' )!.val( 'admin' )
			const role = uk.staff_roles( bot.lord() ).get( pass.lord().str ) ?? 'resident'
			const staff = role !== 'resident'

			const house = checked.start ? uk.house_by_code( checked.start.replace( /^house_/, '' ) ) : null
			const name = [ checked.user.first_name, checked.user.last_name ].filter( Boolean ).join( ' ' )

			msg.reply({
				land: bot.uk_link(),
				lord: bot.lord(),
				lords: bot.lords(),
				bot: bot.bot_name(),
				role,
				duty: uk.duty_by( bot.lord(), pass.lord().str ),
				integrations: bot.env_list( 'ORG_KEYS' ).map( pair => pair.split( ':' )[0] ),
				staff_link: staff && secret ? bot.start_link( `staff_${ secret }` ) : '',
				house: house?.link().str ?? null,
				text: $bog_max_bot_api.text_of( checked.start ),
				files: $bog_max_bot_api.files_of( checked.start ),
				user: {
					id: checked.user.id,
					name,
					username: checked.user.username ?? '',
					photo: checked.user.photo_url ?? '',
				},
			})

		}

	}

}
