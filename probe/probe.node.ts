namespace $ {

	export const $bog_max_probe_screens = [
		[ 'tickets', '', `document.body.innerText.includes( 'Дом: ' )` ],
		[ 'house', '/section=house', `!!document.querySelector( '[bog_max_app_house_rows], [bog_max_app_house_empty]' )` ],
		[ 'account', '/section=account', `( document.querySelector( '[bog_max_app_account_house]' )?.innerText ?? '' ).includes( 'ул. ' )` ],
		[ 'new', '/screen=new', `( document.querySelector( '[bog_max_app_house_line_content]' )?.innerText ?? '' ).includes( 'ул. ' )` ],
	] as const

	export async function $bog_max_probe_shots( dir: string, bot: string, ticket = '' ) {

		const base = `http://localhost:9080/bog/max/app/-/index.html?v=${ Date.now() }#!bot=${ encodeURIComponent( bot ) }`
		const screens = [
			... $bog_max_probe_screens,
			... ticket ? [[ 'ticket', '/ticket=' + encodeURIComponent( ticket ), `( document.querySelector( '[bog_max_app_ticket_basis_content]' )?.innerText ?? '' ).includes( 'ПП' )` ] as const ] : [],
		]

		const files = [] as string[]
		for( const width of [ 1280, 400 ] ) {
			for( const [ name, arg, ready ] of screens ) {
				const file = $node.path.join( dir, `${ name }-${ width }.png` )
				const got = await $bog_probe_shot({ page: base + arg, ready: `typeof $ !== 'undefined' && ( ${ ready } )`, width, height: 800, file, limit: 60000 })
				if( got === $bog_probe_skip ) return $mol_fail( new Error( $bog_probe_skip ) )
				files.push( got )
				$node.fs.writeSync( 1, got + '\n' )
			}
		}
		return files
	}

	const dir = $mol_state_arg.value( 'dir' )
	if( dir ) $bog_max_probe_shots( dir, $mol_state_arg.value( 'bot' ) ?? 'localhost:9097', $mol_state_arg.value( 'ticket' ) ?? '' )
		.then( ()=> $node.process.exit( 0 ), error => { $node.fs.writeSync( 2, String( error?.stack ?? error ) + '\n' ); $node.process.exit( 1 ) } )

}
