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

		static script(): HTMLScriptElement | null {
			return this.$.$mol_dom_context.document?.querySelector( 'script[src*="max-web-app"]' ) ?? null
		}

		static async settle( script: HTMLScriptElement ) {
			await new Promise< void >( done => {
				script.addEventListener( 'load', ()=> done() )
				script.addEventListener( 'error', ()=> done() )
				setTimeout( done, 3000 )
			} )
		}

		@ $mol_mem
		static loaded() {
			if( this.app() ) return true
			const script = this.script()
			if( script ) $mol_wire_sync( this ).settle( script )
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
