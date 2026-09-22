namespace $ {

	export class $bog_max_bot_mine extends $giper_baza_mine_fs {

		@ $mol_action
		override units_load() {
			const units = super.units_load()
			const lord = this.$.$giper_baza_auth.current().pass().lord().str
			for( const unit of units ) {
				if( unit.lord().str === lord ) $giper_baza_unit_trusted_grant( unit )
			}
			return units
		}

	}

}
