namespace $ {

	export class $bog_max_uk extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Houses: $giper_baza_list_link_to( ()=> $bog_max_house ),
		Categories: $giper_baza_list_link_to( ()=> $bog_max_category ),
		Tickets: $giper_baza_list_link_to( ()=> $bog_max_ticket ),
		Bindings: $giper_baza_dict_to( $giper_baza_atom_text ),
		Notified: $giper_baza_dict_to( $giper_baza_atom_text ),
	}) {

		tickets() {
			return this.Tickets()?.remote_list() ?? []
		}

		ticket_number( ticket: $bog_max_ticket ) {
			return this.tickets().findIndex( item => item.link().str === ticket.link().str ) + 1
		}

		house_by_code( code: string ) {
			return this.Houses()?.remote_list().find( house => house.Code()?.val() === code ) ?? null
		}

	}

}
