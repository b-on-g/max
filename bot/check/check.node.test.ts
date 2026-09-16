namespace $ {

	const token = 'test-token'

	function init_data( fields: Record< string, string >, sign = true ) {
		const pairs = Object.entries( fields )
		const params = new URLSearchParams( pairs )
		if( sign ) params.set( 'hash', $bog_max_bot_check.sign( pairs, token ) )
		return params.toString()
	}

	$mol_test({

		'signed init data yields user and start param'() {
			const data = init_data({
				auth_date: '1000',
				user: JSON.stringify({ id: 42, first_name: 'Иван' }),
				start_param: 'pushkina10',
			})
			$mol_assert_equal( $bog_max_bot_check.user( data, token, 1500 ), {
				user: { id: 42, first_name: 'Иван' },
				start: 'pushkina10',
			} )
		},

		'tampered field is rejected'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) })
			const forged = data.replace( '42', '43' )
			$mol_assert_equal( $bog_max_bot_check.user( forged, token, 1500 ), null )
		},

		'stale auth_date is rejected'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) })
			$mol_assert_equal( $bog_max_bot_check.user( data, token, 1000 + 3601 ), null )
		},

		'unsafe mode falls back to test resident'() {
			$mol_assert_equal( $bog_max_bot_check.unsafe( '' ), {
				user: { id: 1, first_name: 'Тестовый житель' },
				start: '',
			} )
		},

	})

}
