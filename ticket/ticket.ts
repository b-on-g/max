namespace $ {

	export class $bog_max_ticket extends $giper_baza_dict.with({
		House: $giper_baza_atom_link_to( ()=> $bog_max_house ),
		Category: $giper_baza_atom_link_to( ()=> $bog_max_category ),
		Place: $giper_baza_atom_text,
		Text: $giper_baza_atom_text,
		Author: $giper_baza_atom_text,
		Status: $giper_baza_atom_text,
		Created: $giper_baza_atom_time,
		Log: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {

		category() {
			return this.Category()?.remote() ?? null
		}

		house() {
			return this.House()?.remote() ?? null
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

		status_by( lord: string ) {
			return this.text_by( this.Status(), lord )
		}

		log_by( lord: string ) {
			const log = this.Log()
			if( !log ) return [] as [ string, string ][]
			return log.keys()
				.map( key => [ String( key ), this.text_by( log.key( key ), lord ) ] as [ string, string ] )
				.filter( ([ , status ])=> status )
				.sort( ([ a ], [ b ])=> a < b ? -1 : a > b ? 1 : 0 )
		}

		text_by( atom: null | $giper_baza_atom_text, lord: string ) {
			if( !atom ) return ''
			for( const unit of atom.units_of( null ) ) {
				if( unit.lord().str !== lord ) continue
				return String( atom.land().sand_decode( unit ) ?? '' )
			}
			return ''
		}

	}

}
