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

		'all platform fields take part in the signature'() {
			const user = { id: 67890, first_name: 'Max', last_name: 'User', username: 'maxuser', language_code: 'ru', photo_url: 'https://st.max.ru/p.jpg' }
			const data = init_data({
				chat: JSON.stringify({ id: 12345, type: 'DIALOG' }),
				ip: '192.168.0.1',
				user: JSON.stringify( user ),
				query_id: '4c0ab423-342b-4e45-aea4-2747dbc500cd',
				auth_date: '1000',
			})
			$mol_assert_equal( $bog_max_bot_check.user( data, token, 1500 )?.user, user )
		},

		'fragment with WebAppData is unwrapped'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) })
			const url = `https://example.com#WebAppData=${ encodeURIComponent( data ) }&WebAppPlatform=web&WebAppVersion=26.2.8`
			$mol_assert_equal( $bog_max_bot_check.user( url, token, 1500 )?.user.id, 42 )
		},

		'tampered field is rejected'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) })
			const forged = data.replace( '42', '43' )
			$mol_assert_equal( $bog_max_bot_check.user( forged, token, 1500 ), null )
		},

		'duplicate parameter is rejected'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) })
			$mol_assert_equal( $bog_max_bot_check.user( data + '&auth_date=1000', token, 1500 ), null )
			$mol_assert_equal( $bog_max_bot_check.user( data + '&hash=' + data.slice( -64 ), token, 1500 ), null )
		},

		'missing hash is rejected'() {
			const data = init_data({ auth_date: '1000', user: JSON.stringify({ id: 42 }) }, false )
			$mol_assert_equal( $bog_max_bot_check.user( data, token, 1500 ), null )
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
