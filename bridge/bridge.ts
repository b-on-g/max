namespace $ {

	export type $bog_max_bridge_app = {
		initData: string
		platform: string
		ready(): void
	}

	export class $bog_max_bridge extends $mol_object {

		static app(): $bog_max_bridge_app | null {
			return ( this.$.$mol_dom_context as any ).WebApp ?? null
		}

		static inside() {
			return this.app() !== null
		}

		static init_data() {
			return this.app()?.initData ?? ''
		}

		static platform() {
			return this.app()?.platform ?? 'web'
		}

		static ready() {
			this.app()?.ready()
		}

	}

}
