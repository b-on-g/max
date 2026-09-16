namespace $ {

	$mol_style_define( $bog_max_app, {

		Home: {
			flex: { basis: '24rem' },
		},

		Row: {
			flex: { direction: 'column' },
			padding: $mol_gap.block,
			borderRadius: 'var(--mol_gap_round)',
			':hover': {
				background: { color: $mol_theme.hover },
			},
		},

		Row_status: {
			color: $mol_theme.shade,
		},

		Ticket_status: {
			color: $mol_theme.current,
		},

		New_button: {
			flex: { grow: 1 },
			justifyContent: 'center',
		},

	})

}
