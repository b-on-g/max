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
		Duty: $giper_baza_dict_to( $giper_baza_atom_text ),
		Orgs: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {

		tickets() {
			return this.Tickets()?.remote_list() ?? []
		}

		posts() {
			return this.Posts()?.remote_list() ?? []
		}

		@ $mol_mem
		numbers() {
			return new Map( this.tickets().map( ( item, index )=> [ item.link().str, index + 1 ] ) )
		}

		ticket_number( ticket: $bog_max_ticket ) {
			return this.numbers().get( ticket.link().str ) ?? 0
		}

		house_by_code( code: string ) {
			return this.Houses()?.remote_list().find( house => house.Code()?.val() === code ) ?? null
		}

		staff_roles( root: string ) {
			const roles = new Map< string, string >([[ root, 'admin' ]])
			const staff = this.Staff()
			if( !staff ) return roles
			const entries = [] as { lord: string, role: string, by: string }[]
			for( const key of staff.keys() ) {
				const atom = staff.key( key )
				if( !atom ) continue
				for( const unit of atom.units_of( null ) ) {
					const role = String( atom.land().sand_decode( unit ) ?? '' )
					if( role ) entries.push({ lord: String( key ), role, by: unit.lord().str })
				}
			}
			let grown = true
			while( grown ) {
				grown = false
				for( const { lord, role, by } of entries ) {
					if( roles.has( lord ) ) continue
					if( roles.get( by ) !== 'admin' ) continue
					roles.set( lord, role )
					grown = true
				}
			}
			return roles
		}

		staff_by( root: string ) {
			return [ ... this.staff_roles( root ).keys() ]
		}

		org_seen( root: string, owner: string ) {
			const atom = this.Orgs()?.key( owner )
			if( !atom ) return ''
			for( const unit of atom.units_of( null ) ) {
				if( unit.lord().str !== root ) continue
				return String( atom.land().sand_decode( unit ) ?? '' )
			}
			return ''
		}

		duty_by( root: string, lord: string ) {
			const roles = this.staff_roles( root )
			const all = this.Houses()?.remote_list().map( house => house.link().str ) ?? []
			if( roles.get( lord ) === 'admin' ) return all
			const atom = this.Duty()?.key( lord )
			if( !atom ) return [] as string[]
			for( const unit of atom.units_of( null ) ) {
				if( roles.get( unit.lord().str ) !== 'admin' ) continue
				return String( atom.land().sand_decode( unit ) ?? '' ).split( ',' ).filter( link => all.includes( link ) )
			}
			return [] as string[]
		}

	}

}
