/**
 * @author CliveYuan
 * @date 7/30/2016
 * 
 * */

//auto run
$(function() {
    
    //更新验证码
	switchVcode();
	
    //清除输入内容
    clearInput();
    
    //异步表单提交
    ajaxSubmit();
	
    datePicker();//日期选择器
	
	selectMore();//多选
	
	imgPreview();//图片预览
});


//更新验证码
function switchVcode() {
	$('.v-code').click(function() {
		var src = contextPath + '/web/common/v_code.php?' + Math.random() * 10000;
		$(this).attr('src', src);
	});
}



//toast message
/*
 * $.toast('password is wrong');
 * $.toast('success', '添加成功');
 * $.toast('warning', 'what fuck are you doing', 'left-center');
 * 
 * */
$.toast = function() {
    var len= arguments.length;
    var type = "error";
    var msg = "No Message";
    var position = "top-center";
    
    if(len == 1) { 
        msg = arguments[0]; 
    } 
    
    if(len == 2) {
        type = arguments[0]; 
        msg = arguments[1]; 
    }
    
    if(len >= 3) {
        type = arguments[0]; 
        msg = arguments[1]; 
        position = arguments[2]; 
    }
    
  //user configuration of all toastmessages to come:
    $().toastmessage('showToast', {
        text     : msg,
        sticky   : false,
        position : position,// top-left, top-center, top-right, middle-left, middle-center, middle-right
        type     : type// notice, warning, error, success
    });
    return this;
};

function clearInput() {
	$('.clear-input').click(function(){
		$(this).prev('input').val('');
	});
}

var controllerUrl = contextPath + '/controller/';

function datePicker() {
	$('input[name="daterange"]').daterangepicker({
	    "showDropdowns": true
	});
}

//[公用] 异步提交表单 ->一个页面只有第一个form有效
function ajaxSubmit() {
	$('.ajax-submit').validate({
		submitHandler : function(form) {
			form = $(form);
			var action = form.attr('action');
			var formDate = form.serialize();
			var submitBtn = form.find('button[type="submit"]');
			var redirect = form.attr('redirect');//成功之后重定向地址
			var successMsg = form.attr('successMsg');//成功提示信息
			//console.log(action);
			//console.log(formDate);
			if (!action) {
				$.toast('action不能为空');
				return false;
			}
			if (!redirect) {
				$.toast('redirect不能为空');
				return false;
			}
			if (!successMsg) {
				successMsg = '操作成功';
			}
			$.ajax( {
				url : controllerUrl + action,
				dataType : 'json',
				data : formDate, 
				type : "POST",
			beforeSend : function() {
				submitBtn.attr('title', submitBtn.text()); //将按钮名字暂存起来
				submitBtn.text('提交中...');
				submitBtn.attr('disabled', true);
			},
			success : function(req) {
				// 请求成功时处理
				//console.log(req);
				if (req) {
					if (req.result) {
						submitBtn.attr('type', 'button');
						//$.toast('success', successMsg);
						setTimeout('location.href = "' + redirect +'"', 1000);
					} else {
						$.toast(req.msg);
						if( typeof ajaxSubmitErrorCallback === 'function' ){
							ajaxSubmitErrorCallback();//报错时回调方法
						}
					}
				} else {
					$.toast('请求失败, 请稍后重试');
					setTimeout('location.reload()', 2000);
				}
			},
			complete : function() {
				// 请求完成的处理
				submitBtn.text(submitBtn.attr('title'));
				submitBtn.attr('disabled', false);
			},
			error : function(err) {
				// 请求出错处理
				$.toast('系统繁忙, 稍后重试');
				console.log(err);
			}
			});
			return false;
		}
		});
	
}

function selectMore() {
	$('.checkAll').bind('click', function() {
	    var checkAll = $(this).is(".fa-check-square-o");
	    //checked($(this), checkAll);
	    checked($('.checkAll'), checkAll);
	    checked($('.idCheckbox'), checkAll);
	});
	var $subBox = $(".idCheckbox");
	$subBox.click(function() {
	    checked($(this), $(this).is(".fa-check-square-o"));
	    var checkedAll = $subBox.length == $("i[name='idCheckbox'].fa-check-square-o").length;
	    console.log( $("i[name='idCheckbox'].fa-check-square-o").length);
	    checked($('.checkAll'), !checkedAll);
	});
}

//多选框的图标
function checked(selector, isChecked) {
    if (isChecked) {
        selector.removeClass('fa-check-square-o');
        selector.addClass('fa-square-o');
    } else {
        selector.removeClass('fa-square-o');
        selector.addClass('fa-check-square-o');
    }
}

function muliDel(model) {
	// 多项删除
	$('.multi-delete-btn').bind('click', function() {
		var checkedItem = $("i[name='idCheckbox'].fa-check-square-o");
		if (checkedItem.length == 0) {
			$.toast('warning', '请先勾选要删除的对象');
			return false;
		}
		if (!confirm('确认删除所选项?')) {
			return false;
		}
		var ids = new Array();
		checkedItem.each(function() {
			ids.push($(this).attr('value'));
		});
		console.debug(ids);
		postDelete(ids, model);
	});
}

//提交删除
function postDelete(ids, model) {
	console.log('postDelete, ids: ' + ids + ", model: " + model);
	if (ids == '' || ids == null || ids.length == 0) {
		$.toast('warning', '请选择要删除的数据');
		return false;
	}
	$.ajax({
		url : controllerUrl + 'admin/' + model + '.php?m=delete',
		dataType : 'json',
		data : {ids: ids},
		type : "POST",
		beforeSend : function() {
			//$.toast('notice', '删除中...');
		},
		success : function(req) {
			if (req) {
				if (req.result) {
					$.toast('success', '删除成功');
					setTimeout('location.reload()', 1000);
				} else {
					$.toast(req.msg);
				}
			} else {
				$.toast('请求失败, 稍后重试');
			}
		},
		error : function(err) {
			console.log(err);
			$.toast('系统繁忙, 稍后重试');
		}
	});
}
// 单个删除
function singleDel(id, model) {
	var ids= new Array(id);
	postDelete(ids, model);
}

//每页多少条
$('.per-page li a').bind('click', function() {
	$('.per-page-count').text($(this).attr('data-id'));
	$('input[name="pageSize"]').val($(this).attr('data-id'));
	$('#searchForm').submit();
});


/**
 * 图片预览
 * <input class="preview-input" />
 * <div class="preview-img"></div>
 * */
function imgPreview() {
    $('.preview-input').change(function(e) {
        var file = e.target.files[0];
        var img = new Image(),
        url = img.src = URL.createObjectURL(file);
        if (url != null) {
        	var $img = $(img);
        	$img.css('max-width', '100%');
        	$('.preview-img').empty().append($img);
        }
    });
}

//冻结验证码
function freeze(auth_code) {
    $.post(controllerUrl+'/admin/code.php?m=freeze', {auth_code:auth_code}, function(resp){
		    if (resp) {
		      if (resp.result) {
		        $.toast('success', '冻结成功');
		        setTimeout('location.reload()', 1000);
		      } else {
		        $.toast(req.msg);
		      }
		    } else {
		      $.toast('请求失败, 稍后重试');
		    }
        });
}
