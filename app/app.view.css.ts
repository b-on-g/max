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

		Account_head: {
			padding: $mol_gap.block,
			gap: $mol_gap.space,
			align: { items: 'center' },
		},

		Account_photo: {
			width: '3rem',
			height: '3rem',
			borderRadius: '50%',
			objectFit: 'cover',
			flex: { shrink: 0 },
		},

		Account_avatar: {
			width: '3rem',
			height: '3rem',
			flex: { shrink: 0 },
			color: $mol_theme.current,
		},

		Account_titles: {
			flex: { direction: 'column' },
			minWidth: 0,
		},

		Account_name: {
			font: { weight: 500 },
		},

		Account_username: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Account_id: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Account_count: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		House_title: {
			color: $mol_theme.shade,
			padding: { left: $mol_gap.block, right: $mol_gap.block, bottom: $mol_gap.block },
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
			color: $mol_theme.text,
			':hover': {
				background: { color: $mol_theme.hover },
			},
		},

		Post: {
			flex: { direction: 'column' },
			gap: '4px',
			padding: { top: $mol_gap.block, bottom: $mol_gap.block, left: '16px', right: '16px' },
			borderRadius: '16px',
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

		All: {
			flex: { grow: 0, shrink: 0, basis: '26rem' },
		},

		All_link: {
			display: 'flex',
			padding: $mol_gap.block,
		},

		All_search: {
			padding: $mol_gap.block,
		},

		All_status: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		All_rows: {
			gap: $mol_gap.space,
			padding: { top: $mol_gap.block },
		},

		Stats: {
			flex: { grow: 0, shrink: 0, basis: '26rem' },
		},

		Stats_link: {
			display: 'flex',
			padding: $mol_gap.block,
		},

		Stats_period: {
			padding: { left: $mol_gap.block, right: $mol_gap.block, top: $mol_gap.block },
			flex: { wrap: 'wrap' },
		},

		Stats_house_pick: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Stats_summary: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},

		Summary: {
			flex: { direction: 'column', grow: 1, basis: '40%' },
			padding: { top: $mol_gap.block, bottom: $mol_gap.block, left: '16px', right: '16px' },
			borderRadius: '16px',
			boxSizing: 'border-box',
		},

		Summary_value: {
			font: { size: '1.5rem', weight: 600 },
			lineHeight: '2rem',
		},

		Summary_label: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Stats_owners_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Stats_houses_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Owner_stat: {
			flex: { direction: 'column' },
			padding: { left: $mol_gap.block, right: $mol_gap.block, bottom: $mol_gap.space },
		},

		Owner_stat_name: {
			font: { weight: 500 },
		},

		Owner_stat_line: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Orgs_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Stat: {
			flex: { direction: 'column' },
			padding: { left: $mol_gap.block, right: $mol_gap.block, bottom: $mol_gap.space },
		},

		Stat_house: {
			font: { weight: 500 },
		},

		Stat_line: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Org: {
			flex: { direction: 'column' },
			padding: { left: $mol_gap.block, right: $mol_gap.block, bottom: $mol_gap.space },
		},

		Org_name: {
			font: { weight: 500 },
		},

		Org_state: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Qr_house: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Qr: {
			width: '12rem',
			height: '12rem',
			margin: { left: $mol_gap.block },
		},

		Qr_link: {
			color: $mol_theme.shade,
			font: { size: '0.75rem' },
			wordBreak: 'break-all',
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Qr_print: {
			margin: $mol_gap.block,
		},

		House_form: {
			padding: $mol_gap.block,
		},

		Account_role: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Staff_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		House_missing: {
			flex: { direction: 'row' },
			alignItems: 'center',
			gap: $mol_gap.block,
			margin: { left: $mol_gap.block, right: $mol_gap.block },
			padding: $mol_gap.block,
			borderRadius: '16px',
			background: { color: $mol_theme.card },
		},

		House_missing_icon: {
			flex: { shrink: 0 },
			width: '2rem',
			height: '2rem',
			color: $mol_theme.control,
		},

		House_missing_text: {
			color: $mol_theme.shade,
		},

		Houses_title: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},

		Admin_house: {
			flex: { direction: 'row' },
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: { left: $mol_gap.block, right: $mol_gap.space, bottom: $mol_gap.space },
		},

		Admin_house_info: {
			flex: { direction: 'column', grow: 1, shrink: 1 },
			minWidth: 0,
		},

		Admin_house_address: {
			font: { weight: 500 },
		},

		Admin_house_code: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		House_remove: {
			color: $mol_theme.shade,
			flex: { shrink: 0 },
		},

		Staff_invite: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
			wordBreak: 'break-all',
			font: { size: '0.8125rem' },
		},

		Staff_qr: {
			width: '10rem',
			height: '10rem',
			margin: { left: $mol_gap.block },
		},

		Staff_houses_label: {
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Staff_houses: {
			flex: { wrap: 'wrap' },
		},

		Staff_form: {
			flex: { direction: 'column' },
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},

		Account_code: {
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Account_code_note: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
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

		Photo_box: {
			flex: { direction: 'column' },
			gap: $mol_gap.space,
		},

		Photo_previews: {
			flex: { direction: 'row', wrap: 'wrap' },
			gap: $mol_gap.space,
		},

		Photo_item: {
			position: 'relative',
			flex: { direction: 'column' },
		},

		Photo_thumb: {
			width: '6rem',
			height: '6rem',
			objectFit: 'cover',
			borderRadius: '12px',
		},

		Photo_video: {
			width: '9rem',
			height: '6rem',
			borderRadius: '12px',
			background: { color: 'black' },
		},

		Photo_drop: {
			position: 'absolute',
			top: 0,
			right: 0,
			background: { color: $mol_theme.card },
			borderRadius: '999px',
			padding: '2px',
		},

		Ticket_media: {
			flex: { direction: 'row', wrap: 'wrap' },
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},

		Ticket_image_pic: {
			maxWidth: '100%',
			maxHeight: '14rem',
			objectFit: 'contain',
			borderRadius: '12px',
		},

		Ticket_video: {
			maxWidth: '100%',
			maxHeight: '14rem',
			borderRadius: '12px',
			background: { color: 'black' },
		},

		Ticket_uploading: {
			color: $mol_theme.shade,
			padding: { left: $mol_gap.block, right: $mol_gap.block },
		},

		Admin_note: {
			margin: { left: '16px', right: '16px', bottom: $mol_gap.space },
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
