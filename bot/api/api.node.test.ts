namespace $ {

	function message( text: string, chat_type: 'dialog' | 'chat' | 'channel', markup: readonly { type: 'user_mention', from: number, length: number, user_id?: number }[] = [] ): $bog_max_bot_api_message {
		return {
			recipient: { chat_id: 1, chat_type, user_id: null, post_id: null },
			timestamp: 0,
			body: { mid: 'm1', seq: 1, text, markup: [ ... markup ] },
		}
	}

	$mol_test({

		'dialog messages are always addressed to the bot'() {
			const api = $bog_max_bot_api.make({})
			$mol_assert_equal( api.addressed( message( 'привет', 'dialog' ), {} ), true )
		},

		'group chat answers only commands, keywords and mentions'() {
			const api = $bog_max_bot_api.make({})
			const me = { user_id: 5, username: 'demo_uk_bot' }
			$mol_assert_equal( api.addressed( message( 'привет всем', 'chat' ), me ), false )
			$mol_assert_equal( api.addressed( message( '/help', 'chat' ), me ), true )
			$mol_assert_equal( api.addressed( message( 'у нас авария в подвале', 'chat' ), me ), true )
			$mol_assert_equal( api.addressed( message( '@Demo_UK_bot, есть новости?', 'chat' ), me ), true )
			$mol_assert_equal( api.addressed( message( 'эй', 'chat', [ { type: 'user_mention', from: 0, length: 2, user_id: 5 } ] ), me ), true )
			$mol_assert_equal( api.addressed( message( 'эй', 'chat', [ { type: 'user_mention', from: 0, length: 2, user_id: 6 } ] ), me ), false )
		},

		'mention without bot info is not guessed'() {
			const api = $bog_max_bot_api.make({})
			$mol_assert_equal( api.mentioned( message( 'эй', 'chat', [ { type: 'user_mention', from: 0, length: 2 } ] ), {} ), false )
		},

		'plain text becomes a ticket question'() {
			const api = $bog_max_bot_api.make({})
			const me = { user_id: 5, username: 'demo_uk_bot' }
			$mol_assert_equal( api.problem( message( ' @demo_uk_bot, течёт  кран ', 'chat' ), me ), 'течёт кран' )
			$mol_assert_equal( api.problem( message( '/help', 'dialog' ), me ), '' )
			$mol_assert_equal( api.question( 'течёт кран' ), 'Создать заявку по проблеме: «течёт кран»?' )
			const payload = $bog_max_bot_api.text_payload( 'течёт кран в подъезде №3' )
			$mol_assert_ok( /^t_[\w-]+$/.test( payload ) )
			$mol_assert_equal( $bog_max_bot_api.text_of( payload ), 'течёт кран в подъезде №3' )
			$mol_assert_equal( $bog_max_bot_api.text_of( 'house_abc' ), '' )
			const mixed = $bog_max_bot_api.text_payload( 'видео из чата', [ 'MdXC__a', 'MdXC__b' ] )
			$mol_assert_equal( $bog_max_bot_api.text_of( mixed ), 'видео из чата' )
			$mol_assert_equal( $bog_max_bot_api.files_of( mixed ), [ 'MdXC__a', 'MdXC__b' ] )
			$mol_assert_equal( $bog_max_bot_api.files_of( payload ), [] )
		},

		'command list matches the handlers'() {
			const api = $bog_max_bot_api.make({})
			$mol_assert_equal( api.commands().map( command => command.name ), [ 'start', 'help', 'id' ] )
		},

	})

}
