namespace $ {

	$mol_test({

		async 'chat flow creates a ticket from buttons and a place message'( $ ) {

			const ops = {
				land: null! as $giper_baza_land,
				chat: null! as $bog_max_bot_chat,
				grab() {
					const link = $.$giper_baza_glob.land_grab().link()
					this.land = new $mol_wire_atom( 'bog_max_chat_test_flow', ()=> $.$giper_baza_glob.Land( link ) ).sync()
					$bog_max_seed( this.uk() )
					const bot = {
						uk: ()=> this.uk(),
						lords: ()=> [ $.$giper_baza_auth.current().pass().lord().str ],
						ticket: ( link: string )=> this.uk().tickets().find( ticket => ticket.link().str === link ) ?? null,
					} as unknown as $bog_max_bot
					this.chat = $bog_max_bot_chat.make({ $, bot: ()=> bot })
				},
				uk() {
					return this.land.Data( $bog_max_uk )
				},
				start() {
					return this.chat.start( 7000, 'Течёт кран', [] )
				},
				pick( payload: string ) {
					return this.chat.pick( 7000, payload )
				},
				place() {
					return this.chat.place( 7000, 'подъезд 2, этаж 5' )
				},
				placed( link: string ) {
					return this.chat.placed( link )
				},
				mine() {
					return this.chat.mine( 7000 )
				},
			}

			const run = $mol_wire_async( ops )
			await run.grab()

			const houses = await run.start()
			$mol_assert_equal( houses.options.length, 3 )
			$mol_assert_equal( houses.options[0].label, 'ул. Пушкина, д. 10' )

			const scopes = await run.pick( 'f:h:0' )
			$mol_assert_equal( scopes.options.map( option => option.payload ), [ 'f:s:house', 'f:s:yard', 'f:s:city', 'f:x' ] )

			const categories = await run.pick( 'f:s:house' )
			$mol_assert_equal( categories.options[0].label, 'Течь, авария на стояке или трубах' )

			await run.pick( 'f:c:0' )
			$mol_assert_equal( ops.chat.waiting( 7000 ), true )

			const link = await run.place()
			$mol_assert_equal( ops.chat.waiting( 7000 ), false )
			$mol_assert_equal( ops.uk().tickets().length, 1 )

			const done = await run.placed( link )
			$mol_assert_equal( done.ticket, link )
			$mol_assert_equal( done.text.startsWith( 'Заявка № 1 создана' ), true )

			const ticket = ops.uk().tickets()[0]
			$mol_assert_equal( ticket.Author()?.val(), '7000' )
			$mol_assert_equal( ticket.Place()?.val(), 'подъезд 2, этаж 5' )
			$mol_assert_equal( ticket.Text()?.val(), 'Течёт кран' )
			$mol_assert_equal( ticket.heading(), 'Течь, авария на стояке или трубах' )

			$mol_assert_equal( await run.mine(), 'Ваши заявки:\n№ 1, Течь, авария на стояке или трубах: ждёт регистрации' )

		},

		async 'cancel drops the draft'( $ ) {

			const ops = {
				chat: null! as $bog_max_bot_chat,
				grab() {
					const link = $.$giper_baza_glob.land_grab().link()
					const land = new $mol_wire_atom( 'bog_max_chat_test_cancel', ()=> $.$giper_baza_glob.Land( link ) ).sync()
					$bog_max_seed( land.Data( $bog_max_uk ) )
					const bot = { uk: ()=> land.Data( $bog_max_uk ) } as unknown as $bog_max_bot
					this.chat = $bog_max_bot_chat.make({ $, bot: ()=> bot })
				},
				flow() {
					this.chat.start( 7001, 'Шумят', [] )
					return this.chat.pick( 7001, 'f:x' )
				},
			}

			await $mol_wire_async( ops ).grab()
			const step = await $mol_wire_async( ops ).flow()
			$mol_assert_equal( step.text.startsWith( 'Заявку не создаём' ), true )
			$mol_assert_equal( ops.chat.drafts.has( 7001 ), false )

		},

	})

}
