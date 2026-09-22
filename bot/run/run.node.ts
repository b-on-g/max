namespace $ {
	$bog_max_bot.serve()
	process.on( 'SIGTERM', ()=> setTimeout( ()=> process.exit( 0 ), 10000 ) )
}
