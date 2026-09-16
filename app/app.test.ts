namespace $ {

	$mol_test({

		'home shows the bot error instead of the list'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.session = ()=> $mol_fail( new Error( 'Подпись MAX не прошла проверку' ) )
			$mol_assert_equal( app.fail(), 'Подпись MAX не прошла проверку' )
			$mol_assert_equal( app.waiting(), false )
			$mol_assert_equal( app.main_body(), [ app.Fail() ] )
		},

		'new ticket needs house, category and place'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.house = ()=> 'house'
			app.category = ()=> 'category'
			app.place = ()=> '  '
			$mol_assert_equal( app.submit_allowed(), false )
			const ready = $$.$bog_max_app.make({ $ })
			ready.house = ()=> 'house'
			ready.category = ()=> 'category'
			ready.place = ()=> 'подъезд 2'
			$mol_assert_equal( ready.submit_allowed(), true )
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
			$mol_assert_equal( app.main_body(), [ app.Search(), app.House_empty() ] )
		},

		'ticket page opens by arg'( $ ) {
			const app = $$.$bog_max_app.make({ $ })
			app.ticket_link = ()=> 'link'
			app.screen = ()=> ''
			$mol_assert_equal( app.pages(), [ app.Main(), app.Ticket() ] )
		},

	})

}
