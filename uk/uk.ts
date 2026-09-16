namespace $ {

	export class $bog_max_uk extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Houses: $giper_baza_list_link.to( ()=> $bog_max_house ),
		Categories: $giper_baza_list_link.to( ()=> $bog_max_category ),
		Tickets: $giper_baza_list_link.to( ()=> $bog_max_ticket ),
		Posts: $giper_baza_list_link.to( ()=> $bog_max_post ),
		Bindings: $giper_baza_dict_to( $giper_baza_atom_text ),
		Notified: $giper_baza_dict_to( $giper_baza_atom_text ),
		Staff: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {

		tickets() {
			return this.Tickets()?.remote_list() ?? []
		}

		posts() {
			return this.Posts()?.remote_list() ?? []
		}

		ticket_number( ticket: $bog_max_ticket ) {
			return this.tickets().findIndex( item => item.link().str === ticket.link().str ) + 1
		}

		house_by_code( code: string ) {
			return this.Houses()?.remote_list().find( house => house.Code()?.val() === code ) ?? null
		}

		staff_by( root: string ) {
			const staff = this.Staff()
			if( !staff ) return [ root ]
			const trusted = new Set([ root ])
			const authors = new Map< string, string[] >()
			for( const key of staff.keys() ) {
				const atom = staff.key( key )
				if( !atom ) continue
				const by = [] as string[]
				for( const unit of atom.units_of( null ) ) {
					if( atom.land().sand_decode( unit ) ) by.push( unit.lord().str )
				}
				authors.set( String( key ), by )
			}
			let grown = true
			while( grown ) {
				grown = false
				for( const [ lord, by ] of authors ) {
					if( trusted.has( lord ) ) continue
					if( !by.some( author => trusted.has( author ) ) ) continue
					trusted.add( lord )
					grown = true
				}
			}
			return [ ... trusted ]
		}

	}

}
