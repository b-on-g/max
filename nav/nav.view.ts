namespace $.$$ {

	export class $bog_max_nav extends $.$bog_max_nav {

		tickets_active() {
			return this.section() === 'tickets' ? 'on' : 'off'
		}

		house_active() {
			return this.section() === 'house' ? 'on' : 'off'
		}

		account_active() {
			return this.section() === 'account' ? 'on' : 'off'
		}

	}

}
