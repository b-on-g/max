namespace $ {

	$mol_test({

		async 'status is taken only from the trusted lord'( $ ) {

			const ops = {
				land: null! as $giper_baza_land,
				grab() {
					this.land = $.$giper_baza_glob.land_grab()
				},
				ticket() {
					return this.land.Data( $bog_max_ticket )
				},
				write() {
					this.ticket().Status( 'auto' )!.val( 'new' )
				},
			}

			await $mol_wire_async( ops ).grab()
			await $mol_wire_async( ops ).write()

			const lord = $.$giper_baza_auth.current().pass().lord().str
			$mol_assert_equal( ops.ticket().status_by( lord ), 'new' )
			$mol_assert_equal( ops.ticket().status_by( 'somebody' ), '' )

		},

	})

}
