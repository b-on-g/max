namespace $ {

	export const $bog_max_status = {
		new: 'Зарегистрирована',
		accepted: 'Принята, назначен исполнитель',
		work: 'В работе',
		done: 'Выполнена',
		rejected: 'Отклонена',
		escalated: 'Эскалирована руководству УК',
		deleted: 'Удалена как дубль или спам',
	} as const

	export const $bog_max_status_closed = [ 'done', 'rejected', 'deleted' ] as readonly string[]

}
