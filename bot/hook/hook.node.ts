namespace $ {

	export class $bog_max_bot_hook extends $mol_rest_resource {

		bot() {
			return null! as $bog_max_bot
		}

		secret( msg: $mol_rest_message ) {
			const input = ( msg as $mol_rest_message_http ).input
			return String( input?.headers?.[ 'x-max-bot-api-secret' ] ?? '' )
		}

		POST( msg: $mol_rest_message ) {
			const bot = this.bot()
			const secret = bot.env().WEBHOOK_SECRET ?? ''
			if( secret && this.secret( msg ) !== secret ) return msg.reply( 'Неверный секрет webhook', { code: 401 } )
			const update = msg.data()
			if( !update || typeof update !== 'object' || !( 'update_type' in update ) ) return msg.reply( 'Ожидается Update от MAX', { code: 422 } )
			msg.reply( 'OK' )
			bot.api().handle( update as $bog_max_bot_api_update )
		}

	}

}
