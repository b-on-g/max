namespace $ {

	$mol_test({

		'home shows the bot error instead of the list'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> $mol_fail( new Error( 'Подпись MAX не прошла проверку' ) )
			$mol_assert_equal( app.fail(), 'Подпись MAX не прошла проверку' )
			$mol_assert_equal( app.waiting(), false )
			$mol_assert_equal( app.main_body(), [ app.Fail() ] )
		},

		'empty category and place get bids'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.category_options = ()=> [ 'category' ]
			app.category = ()=> ''
			app.place = ()=> '  '
			$mol_assert_equal( app.category_bids(), [ 'Выберите категорию' ] )
			$mol_assert_equal( app.place_bids(), [ 'Укажите, где именно' ] )
			const ready = $$.$bog_max_app.make({ $ })
			ready.category_options = ()=> [ 'category' ]
			ready.category = ()=> 'category'
			ready.place = ()=> 'подъезд 2'
			$mol_assert_equal( ready.category_bids(), [] )
			$mol_assert_equal( ready.place_bids(), [] )
		},

		'sections switch the main body'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.section = ()=> 'account'
			$mol_assert_equal( app.main_body()[0], app.Account_name() )
			$mol_assert_equal( app.main_title(), 'Профиль' )
		},

		'house list filters neighbours by query'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.section = ()=> 'house'
			app.neighbours = ()=> []
			$mol_assert_equal( app.main_body(), [ app.House_pick(), app.House_tabs(), app.Search(), app.House_empty() ] )
		},

		'dispatcher section is hidden from residents'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.waiting = ()=> false
			app.fail = ()=> ''
			app.staff = ()=> false
			app.section = ()=> 'admin'
			$mol_assert_equal( app.main_body(), [ app.Fail() ] )
		},

		'network failure explains that the app lives inside MAX'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> $mol_fail( new Error( 'Failed to fetch' ) )
			$mol_assert_ok( app.fail().includes( 'MAX' ) )
		},

		'ticket page opens by arg'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.ticket_link = ()=> 'link'
			app.screen = ()=> ''
			$mol_assert_equal( app.pages(), [ app.Main(), app.Ticket() ] )
		},

	})

}
