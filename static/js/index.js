$(function() {
	$('table .delete-btn').on('click', function() {
		console.log($(this).data('id'))
		var $this = $(this)
		$.ajax({
			url: '/admin/list?id=' + $(this).data('id'),
			type: 'delete'
		}).done(function(res) {
			console.log(res.success)
			console.log($this.parent().parent())
			if (res.success) {
				$this.parent().parent().remove()
			}
		})
	})
})