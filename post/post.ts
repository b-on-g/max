namespace $ {

	export class $bog_max_post extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Text: $giper_baza_atom_text,
		Kind: $giper_baza_atom_text,
		House: $giper_baza_atom_link.to( ()=> $bog_max_house ),
		Since: $giper_baza_atom_time,
		Till: $giper_baza_atom_time,
		Created: $giper_baza_atom_time,
	}) {}

}
