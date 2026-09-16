namespace $ {

	$mol_style_define( $bog_max_app, {

		Main: {
			flex: { grow: 1, shrink: 0, basis: '24rem' },
		},

		New: {
			flex: { grow: 0, shrink: 0, basis: '26rem' },
		},

		Ticket: {
			flex: { grow: 0, shrink: 0, basis: '26rem' },
		},

		Max_logo: {
			width: '1.75rem',
			height: '1.75rem',
			borderRadius: '0.5rem',
			margin: { right: '0.5rem' },
		},

		New_link: {
			display: 'flex',
			padding: $mol_gap.block,
		},

		Search: {
			padding: $mol_gap.block,
		},

		Account_note: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Account_name: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Account_id: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Account_count: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		House_title: {
			color: $mol_theme.shade,
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Empty: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		House_empty: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		House_rows: {
			gap: $mol_gap.space,
		},

		Wait: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Fail: {
			padding: $mol_gap.block,
			color: $mol_theme.special,
		},

		Rows: {
			gap: $mol_gap.space,
		},

		Row: {
			flex: { direction: 'column' },
			gap: '4px',
			padding: { top: $mol_gap.block, bottom: $mol_gap.block, left: '16px', right: '16px' },
			borderRadius: '16px',
			background: { color: $mol_theme.card },
			color: $mol_theme.text,
			':hover': {
				background: { color: $mol_theme.field },
			},
		},

		Post: {
			flex: { direction: 'column' },
			gap: '4px',
			padding: { top: $mol_gap.block, bottom: $mol_gap.block, left: '16px', right: '16px' },
			borderRadius: '16px',
			background: { color: $mol_theme.card },
		},

		Post_title: {
			font: { weight: 500 },
		},

		Post_when: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		House_pick: {
			padding: { left: $mol_gap.block, right: $mol_gap.block, top: $mol_gap.block },
		},

		House_tabs: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Admin_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Admin_empty: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Admin_rows: {
			gap: $mol_gap.space,
		},

		Admin_row: {
			flex: { direction: 'column' },
			gap: $mol_gap.space,
			padding: { bottom: $mol_gap.block },
		},

		Admin_status: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Qr_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Qr_card: {
			flex: { direction: 'column' },
			align: { items: 'center' },
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},

		Qr: {
			width: '12rem',
			height: '12rem',
		},

		Qr_link: {
			color: $mol_theme.shade,
			font: { size: '0.75rem' },
			wordBreak: 'break-all',
		},

		Post_form: {
			padding: $mol_gap.block,
		},

		Photo_row: {
			align: { items: 'center' },
			gap: $mol_gap.space,
		},

		Photo_name: {
			color: $mol_theme.shade,
		},

		Photo_preview: {
			maxWidth: '100%',
			maxHeight: '16rem',
			objectFit: 'contain',
			borderRadius: '16px',
			margin: $mol_gap.block,
		},

		Ticket_photo: {
			maxWidth: '100%',
			maxHeight: '20rem',
			objectFit: 'contain',
			borderRadius: '16px',
			margin: $mol_gap.block,
		},

		Ticket_note: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Similar_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Similar: {
			gap: $mol_gap.space,
		},

		Voices: {
			flex: { direction: 'column' },
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},

		Voices_count: {
			color: $mol_theme.shade,
		},

		Row_title: {
			font: { weight: 500 },
		},

		Row_status: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Ticket_status: {
			color: $mol_theme.current,
			padding: { left: $mol_gap.block, right: $mol_gap.block },
			font: { weight: 500 },
		},

		Log: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		New_button: {
			flex: { grow: 1 },
		},

	})

}
