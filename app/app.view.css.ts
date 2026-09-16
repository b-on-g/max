namespace $ {

	$mol_style_define( $bog_max_app, {

		Main: {
			flex: { basis: '24rem' },
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
