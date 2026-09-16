namespace $ {
	$bog_max_bot.serve()
	process.on( 'SIGTERM', ()=> process.exit( 0 ) )
}
