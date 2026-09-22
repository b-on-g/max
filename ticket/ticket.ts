namespace $ {

	export class $bog_max_ticket extends $giper_baza_dict.with({
		House: $giper_baza_atom_link.to( ()=> $bog_max_house ),
		Category: $giper_baza_atom_link.to( ()=> $bog_max_category ),
		Entrance: $giper_baza_atom_text,
		Place: $giper_baza_atom_text,
		Text: $giper_baza_atom_text,
		Photo: $giper_baza_atom_link.to( ()=> $giper_baza_file ),
		Photos: $giper_baza_list_link.to( ()=> $giper_baza_file ),
		Author: $giper_baza_atom_text,
		Status: $giper_baza_atom_text,
		Note: $giper_baza_atom_text,
		Created: $giper_baza_atom_time,
		Log: $giper_baza_dict_to( $giper_baza_atom_text ),
		Voices: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {

		category() {
			return this.Category()?.remote() ?? null
		}

		house() {
			return this.House()?.remote() ?? null
		}

		photo() {
			return this.Photo()?.remote() ?? null
		}

		photos() {
			const list = this.Photos()?.remote_list() ?? []
			if( list.length ) return list
			const one = this.photo()
			return one ? [ one ] : []
		}

		react_till() {
			return this.till( this.category()?.React()?.val() ?? null )
		}

		fix_till() {
			return this.till( this.category()?.Fix()?.val() ?? null )
		}

		till( hours: number | null ) {
			const created = this.Created()?.val()
			if( !created || hours === null ) return null
			return created.shift({ minute: Math.round( hours * 60 ) })
		}

		voices() {
			return this.Voices()?.keys().length ?? 0
		}

		status_by( lords: readonly string[] ) {
			return this.text_by( this.Status(), lords )
		}

		note_by( lords: readonly string[] ) {
			return this.text_by( this.Note(), lords )
		}

		log_by( lords: readonly string[] ) {
			const log = this.Log()
			if( !log ) return [] as [ string, string ][]
			return log.keys()
				.map( key => [ String( key ), this.text_by( log.key( key ), lords ) ] as [ string, string ] )
				.filter( ([ , status ])=> status )
				.sort( ([ a ], [ b ])=> a < b ? -1 : a > b ? 1 : 0 )
		}

		text_by( atom: null | $giper_baza_atom_text, lords: readonly string[] ) {
			if( !atom ) return ''
			for( const unit of atom.units_of( null ) ) {
				if( !lords.includes( unit.lord().str ) ) continue
				return String( atom.land().sand_decode( unit ) ?? '' )
			}
			return ''
		}

	}

}
