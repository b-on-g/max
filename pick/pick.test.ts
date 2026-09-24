namespace $.$$ {

	$mol_test({

		'typed text becomes a custom option'( $ ) {
			const pick = $$.$bog_max_pick.make({ $ })
			pick.focused = ()=> false
			pick.custom_prefix = ()=> 'Своё:'
			let custom = ''
			pick.dictionary = ()=> ({ a: 'Лифт', b: 'Протечка' })
			pick.custom = ( next?: string )=> next === undefined ? custom : custom = next
			pick.filter_pattern( 'Сломали лавку' )
			const options = pick.options_filtered()
			$mol_assert_equal( options.at( -1 ), pick.custom_id() )
			$mol_assert_equal( pick.option_label( pick.custom_id() ), 'Своё: «Сломали лавку»' )
			pick.event_select( pick.custom_id() )
			$mol_assert_equal( custom, 'Сломали лавку' )
		},

		'exact match hides the custom option'( $ ) {
			const pick = $$.$bog_max_pick.make({ $ })
			pick.focused = ()=> false
			pick.custom_prefix = ()=> 'Своё:'
			pick.dictionary = ()=> ({ a: 'Лифт' })
			pick.filter_pattern( 'лифт' )
			$mol_assert_equal( pick.options_filtered(), [ 'a' ] )
		},

	})

}
