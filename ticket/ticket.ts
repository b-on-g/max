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

	}

}
