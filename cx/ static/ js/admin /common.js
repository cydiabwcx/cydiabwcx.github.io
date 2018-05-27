

function adminLogout() {
	$.ajax( {
		url : controllerUrl + 'admin/sys_admin.php?m=logout',
		dataType : 'json',
		data : [], 
		type : "POST",
		beforeSend : function() {
		// 请求前的处理
	},
	success : function(req) {
		// 请求成功时处理
		console.log(req);
		if (req) {
			if (req.result) {
				location.href = contextPath + '/web/admin/sys_admin/login.php';
			} else {
				alert(req.msg);
			}
		} else {
			alert('请求失败, 稍后重试');
		}
	},
	complete : function() {
		// 请求完成的处理
	},
	error : function(err) {
		// 请求出错处理
		alert('系统繁忙, 稍后重试');
		console.log(err);
	}
	});
	return false;
}






