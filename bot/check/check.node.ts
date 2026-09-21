namespace $ {

	export type $bog_max_bot_check_user = {
		id: number
		first_name?: string
		last_name?: string | null
		username?: string | null
		language_code?: string | null
		photo_url?: string | null
	}

	export class $bog_max_bot_check extends $mol_object {

		static pairs( init_data: string ): ( readonly [ string, string ] )[] {
			const params = new URLSearchParams( init_data.replace( /^[^#]*#/, '' ) )
			const wrapped = params.get( 'WebAppData' )
			if( wrapped !== null ) return this.pairs( wrapped )
			return [ ... params.entries() ]
		}

		static unique( pairs: readonly ( readonly [ string, string ] )[] ) {
			const keys = pairs.map( ([ key ])=> key )
			return keys.every( ( key, index )=> keys.indexOf( key ) === index )
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
			if( !this.unique( pairs ) ) return null
			const hash = pairs.find( ([ key ])=> key === 'hash' )?.[1] ?? ''
			const sign = this.sign( pairs, token )
			if( hash.length !== sign.length ) return null
			if( !$node.crypto.timingSafeEqual( Buffer.from( hash ), Buffer.from( sign ) ) ) return null
			const auth_date = Number( pairs.find( ([ key ])=> key === 'auth_date' )?.[1] )
			if( !auth_date || now - auth_date > max_age ) return null
			return this.unsafe( init_data )
		}

		static demo_max = 1000

		static demo( init_data: string ) {
			const pairs = this.pairs( init_data )
			if( pairs.some( ([ key ])=> key === 'hash' ) ) return null
			const checked = this.unsafe( init_data )
			if( !checked ) return null
			if( !Number.isInteger( checked.user.id ) || checked.user.id <= 0 || checked.user.id >= this.demo_max ) return null
			return checked
		}

		static unsafe( init_data: string ) {
			const pairs = this.pairs( init_data )
			const raw = pairs.find( ([ key ])=> key === 'user' )?.[1] ?? ''
			const user = raw ? JSON.parse( raw ) as $bog_max_bot_check_user : { id: 1, first_name: 'Тестовый житель' }
			if( !user.id ) return null
			const start = pairs.find( ([ key ])=> key === 'start_param' )?.[1] ?? ''
			return { user, start }
		}

	}

}
