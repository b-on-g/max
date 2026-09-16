namespace $ {

	export function $bog_max_seed( uk: $bog_max_uk ) {

		uk.Title( 'auto' )!.val( 'УК «Демо-Дом», тестовые данные' )

		const houses = [
			[ 'ул. Пушкина, д. 10', 'pushkina10' ],
			[ 'пр. Победы, д. 5, к. 2', 'pobedy5k2' ],
		] as const

		for( const [ address, code ] of houses ) {
			const house = uk.Houses( 'auto' )!.make( null )
			house.Address( 'auto' )!.val( address )
			house.Code( 'auto' )!.val( code )
		}

		const categories = [
			[ 'Течь, авария на стояке или трубах', 'ads', 0.5, 72, 'ПП РФ № 416, п. 13: локализация не позднее 30 минут, устранение не позднее 3 суток с момента регистрации заявки' ],
			[ 'Засор канализации', 'ads', 0.5, 2, 'ПП РФ № 416, п. 13: устранение засора внутридомовой канализации в течение 2 часов с момента регистрации заявки' ],
			[ 'Нет холодной или горячей воды', 'rso', 0.5, 4, 'ПП РФ № 354, прил. 1: перерыв подачи воды не более 4 часов единовременно и 8 часов суммарно в месяц' ],
			[ 'Не греет отопление', 'uk', 0.5, 16, 'ПП РФ № 354, прил. 1: перерыв отопления не более 16 часов единовременно при температуре в жилых помещениях выше 12 °C' ],
			[ 'Не работает лифт', 'uk', null, 24, 'ПП РФ № 170, прил. 2: неисправность лифта устраняется в срок не более 1 суток' ],
			[ 'Не горит свет в подъезде', 'uk', null, 168, 'ПП РФ № 170, прил. 2: неисправность освещения помещений общего пользования устраняется в течение 7 суток' ],
			[ 'Протечка кровли', 'uk', null, 24, 'ПП РФ № 170, прил. 2: протечки в отдельных местах кровли устраняются в течение 1 суток' ],
		] as const

		for( const [ title, owner, react, fix, basis ] of categories ) {
			const category = uk.Categories( 'auto' )!.make( null )
			category.Title( 'auto' )!.val( title )
			category.Owner( 'auto' )!.val( owner )
			if( react !== null ) category.React( 'auto' )!.val( react )
			category.Fix( 'auto' )!.val( fix )
			category.Basis( 'auto' )!.val( basis )
		}

	}

}
