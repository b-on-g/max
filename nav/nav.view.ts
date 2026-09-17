namespace $.$$ {

	export class $bog_max_nav extends $.$bog_max_nav {

		tabs() {
			return [
				this.Tab_tickets(),
				this.Tab_house(),
				... this.staff() ? [ this.Tab_dispatch() ] : [],
				... this.admin() ? [ this.Tab_admin() ] : [],
				this.Tab_account(),
			]
		}

		tickets_active() {
			return this.section() === 'tickets' ? 'on' : 'off'
		}

		house_active() {
			return this.section() === 'house' ? 'on' : 'off'
		}

		dispatch_active() {
			return this.section() === 'dispatch' ? 'on' : 'off'
		}

		admin_active() {
			return this.section() === 'admin' ? 'on' : 'off'
		}

		account_active() {
			return this.section() === 'account' ? 'on' : 'off'
		}

	}

}
