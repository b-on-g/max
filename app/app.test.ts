namespace $ {

	$mol_test({

		'home shows the bot error instead of the list'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> $mol_fail( new Error( 'Подпись MAX не прошла проверку' ) )
			$mol_assert_equal( app.fail(), 'Подпись MAX не прошла проверку' )
			$mol_assert_equal( app.waiting(), false )
			$mol_assert_equal( app.main_body(), [ app.Fail(), app.Reset() ] )
		},

		'broken local mirror is explained and offered a reset'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> ({ land: '', lord: '', lords: [], bot: '', role: 'resident', duty: [], integrations: [], staff_link: '', house: null, user: { id: 1, name: '' } })
			app.uk = ()=> $mol_fail( new Error( 'No Seal for Sand' ) )
			$mol_assert_ok( app.fail().includes( 'Сбросить локальные данные' ) )
			$mol_assert_equal( app.main_body(), [ app.Fail(), app.Reset() ] )
		},

		'bids appear only after a submit attempt'( $ ) {
			const quiet = $$.$bog_max_app.make({ $ })
			quiet.category_options = ()=> [ 'category' ]
			quiet.category = ()=> ''
			quiet.place = ()=> '  '
			$mol_assert_equal( quiet.category_bids(), [] )
			const app = $$.$bog_max_app.make({ $ })
			app.category_options = ()=> [ 'category' ]
			app.category = ()=> ''
			app.place = ()=> '  '
			app.tried( true )
			$mol_assert_equal( app.category_bids(), [ 'Выберите категорию' ] )
			$mol_assert_equal( app.place_bids(), [ 'Укажите, где именно' ] )
			const ready = $$.$bog_max_app.make({ $ })
			ready.category_options = ()=> [ 'category' ]
			ready.category = ()=> 'category'
			ready.place = ()=> 'подъезд 2'
			ready.tried( true )
			$mol_assert_equal( ready.category_bids(), [] )
			$mol_assert_equal( ready.place_bids(), [] )
		},

		'sections switch the main body'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.section = ()=> 'account'
			$mol_assert_equal( app.main_body()[0], app.Account_head() )
			$mol_assert_equal( app.main_title(), 'Профиль' )
		},

		'house list filters neighbours by query'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.section = ()=> 'house'
			app.house = ()=> 'h1'
			app.neighbours = ()=> []
			$mol_assert_equal( app.main_body(), [ app.House_pick(), app.House_tabs(), app.Search(), app.House_empty() ] )
		},

		'profile head shows MAX photo or a generated avatar'( $ ) {
			const session = {
				land: '', lord: '', lords: [], bot: '', role: 'resident' as const, duty: [], integrations: [], staff_link: '', house: null,
				user: { id: 7, name: 'Демо 7', username: 'demo7', photo: '' },
			}
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> session
			$mol_assert_equal( app.account_head()[0], app.Account_avatar() )
			$mol_assert_equal( app.Account_avatar().id(), '7' )
			$mol_assert_equal( app.account_titles(), [ app.Account_name(), app.Account_username() ] )
			$mol_assert_equal( app.account_username(), '@demo7' )
			const pic = $$.$bog_max_app.make({ $ })
			pic.session = ()=> ({ ... session, user: { id: 7, name: 'Демо 7', photo: 'https://st.max.ru/p.jpg' } })
			$mol_assert_equal( pic.account_head()[0], pic.Account_photo() )
			$mol_assert_equal( pic.Account_photo().uri(), 'https://st.max.ru/p.jpg' )
			$mol_assert_equal( pic.account_titles(), [ pic.Account_name() ] )
		},

		'dispatcher section is hidden from residents'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.role = ()=> 'resident'
			app.section = ()=> 'dispatch'
			$mol_assert_equal( app.main_body(), [ app.Fail() ] )
			app.section = ()=> 'admin'
			$mol_assert_equal( app.main_body(), [ app.Fail() ] )
		},

		'network failure explains that the app lives inside MAX'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> $mol_fail( new Error( 'Failed to fetch' ) )
			$mol_assert_ok( app.fail().includes( 'MAX' ) )
		},

		'resident without a house sees the QR hint'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> ({ land: '', lord: '', lords: [], bot: '', role: 'resident' as const, duty: [], integrations: [], staff_link: '', house: null, user: { id: 1, name: '' } })
			app.uk = ()=> ({ Houses: ()=> null }) as any
			app.house_options = ()=> [ 'h1', 'h2' ]
			app.mine = ()=> []
			$mol_assert_equal( app.house(), '' )
			$mol_assert_equal( app.main_body(), [ app.House_missing() ] )
			$mol_assert_equal( app.new_body(), [ app.House_missing() ] )
		},

		'author cannot support own ticket'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.user_id = ()=> '7'
			app.current = ()=> ({ Author: ()=> ({ val: ()=> '7' }), Voices: ()=> null, voices: ()=> 0 }) as any
			$mol_assert_equal( app.voice_allowed(), false )
			$mol_assert_equal( app.voices_text(), 'Ваша заявка, поддержать могут соседи' )
			app.current = ()=> ({ Author: ()=> ({ val: ()=> '8' }), Voices: ()=> null, voices: ()=> 2 }) as any
			$mol_assert_equal( app.voice_allowed(), true )
			$mol_assert_equal( app.voices_text(), 'Поддержали: 2' )
		},

		'house code is a latin slug'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			$mol_assert_equal( app.slug( 'ул. Пушкина, д. 10' ), 'pushkina10' )
			$mol_assert_equal( app.slug( 'пр. Победы, д. 5, к. 2' ), 'pobedy52' )
		},

		'ticket page opens by arg'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.ticket_link = ()=> 'link'
			app.screen = ()=> ''
			$mol_assert_equal( app.pages(), [ app.Main(), app.Ticket() ] )
		},

	})

}
