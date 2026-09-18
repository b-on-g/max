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

		'command list matches the handlers'() {
			const api = $bog_max_bot_api.make({})
			$mol_assert_equal( api.commands().map( command => command.name ), [ 'start', 'help', 'id' ] )
		},

	})

}
