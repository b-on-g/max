namespace $ {

	export class $bog_max_bot_check extends $mol_object {

		static pairs( init_data: string ) {
			return [ ... new URLSearchParams( init_data ).entries() ]
		}

		static sign( pairs: readonly ( readonly [ string, string ] )[], token: string ) {
			const line = pairs
				.filter( ([ key ])=> key !== 'hash' )
				.sort( ([ a ], [ b ])=> a < b ? -1 : a > b ? 1 : 0 )
				.map( ([ key, value ])=> `${ key }=${ value }` )
				.join( '\n' )
			const secret = $node.crypto.createHmac( 'sha256', 'WebAppData' ).update( token ).digest()
			return $node.crypto.createHmac( 'sha256', secret ).update( line ).digest( 'hex' )
		}

		static user( init_data: string, token: string, now = Date.now() / 1000, max_age = 3600 ) {
			const pairs = this.pairs( init_data )
			const hash = pairs.find( ([ key ])=> key === 'hash' )?.[1] ?? ''
			const sign = this.sign( pairs, token )
			if( hash.length !== sign.length ) return null
			if( !$node.crypto.timingSafeEqual( Buffer.from( hash ), Buffer.from( sign ) ) ) return null
			const auth_date = Number( pairs.find( ([ key ])=> key === 'auth_date' )?.[1] )
			if( !auth_date || now - auth_date > max_age ) return null
			return this.unsafe( init_data )
		}

		static unsafe( init_data: string ) {
			const pairs = this.pairs( init_data )
			const raw = pairs.find( ([ key ])=> key === 'user' )?.[1] ?? ''
			const user = raw ? JSON.parse( raw ) as { id: number, first_name?: string, last_name?: string } : { id: 1, first_name: 'Тестовый житель' }
			if( !user.id ) return null
			const start = pairs.find( ([ key ])=> key === 'start_param' )?.[1] ?? ''
			return { user, start }
		}

	}

}
