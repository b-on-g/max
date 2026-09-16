namespace $ {

	$mol_style_define( $bog_max_app, {

		Home: {
			flex: { basis: '24rem' },
		},

		House_title: {
			color: $mol_theme.shade,
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Empty: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
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
