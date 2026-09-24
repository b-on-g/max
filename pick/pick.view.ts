namespace $.$$ {

	export class $bog_max_pick extends $.$bog_max_pick {

		custom_id() {
			return '…custom'
		}

		typed() {
			return this.filter_pattern().trim()
		}

		options_filtered(): readonly string[] {
			const typed = this.typed()
			const value = this.value()
			const options = this.options()
				.filter( $mol_match_text( this.filter_pattern(), ( id: string )=> [ this.option_label( id ) ] ) )
				.filter( id => id !== value )
			if( !typed ) return options
			const same = this.options().some( id => this.option_label( id ).toLowerCase() === typed.toLowerCase() )
			return same ? options : [ ... options, this.custom_id() ]
		}

		override option_label( id: string ) {
			if( id === this.custom_id() ) return `${ this.custom_prefix() } «${ this.typed() }»`
			return super.option_label( id )
		}

		override event_select( id: string, event?: MouseEvent ) {
			if( id !== this.custom_id() ) return super.event_select( id, event )
			this.custom( this.typed() )
			this.filter_pattern( '' )
			this.showed( false )
			event?.preventDefault()
		}

	}

}
