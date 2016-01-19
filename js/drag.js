var t;
var flow = {
	
	//左边控制板
	main : {
		bind :function(){
			var that = this;
			/*draggable:jquery-ui的东西，helper如果值设置为"clone", 那么该元素将会被复制，并且被复制的元素将被拖动*/
			$('.drag div').draggable({ helper: "clone" });
			/**/
			$('.configuration').droppable({drop: function(event,ui){
				// console.log(ui.draggable);
				// q = ui.draggable;
				var x = Math.floor(ui.offset.left - $('.configuration')[0].offsetLeft), y = Math.floor(ui.offset.top - $('.configuration')[0].offsetTop);

				var type = ui.draggable[0].className.split(' ')[0];
				var name = $(ui.draggable[0]).find('span').html();
				console.log(type);
				//生成图框
				that.makeConfiguration(type,x,y,name,name);

				
			}});
		}
		,makeConfiguration: function(type,x,y,name,description,condition){
			var _this = this;
			if( type == 'open'){
				$.get('model/open.html',function(html){
					var htmlStr = html;
					$(".configuration").append(htmlStr);
				});
				//htmlStr.html().find(".btn").css({"left":x,"top":y});

			}else if(type == 'inputbtn'){

			}else if(type == 'label1'){

			}else{

			}
			_this.draggable();

		},
		draggable:function(){
			var mousex = 0, mousey = 0;
			var divLeft, divTop;
			$('.draggable').mousedown(function(e)
			{
				var offset = $(this).offset();
				divLeft = parseInt(offset.left,10);
				divTop = parseInt(offset.top,10);
				mousey = e.pageY;
				mousex = e.pageX;
				$(this).bind('mousemove',dragElement);
			});

			function dragElement(event)
			{
				var left = divLeft + (event.pageX - mousex);
				var top = divTop + (event.pageY - mousey);
				$(this).css(
						{
							'top' :  top + 'px',
							'left' : left + 'px',
							'position' : 'absolute'
						});
				return false;
			}
			$(document).mouseup(function()
			{
				$('.draggable').unbind('mousemove');
			});
		}
		//设置图框和连线的内容
		,content: function(el){
			var that = this;
			var p = flow.canvas.can.getById(el.id);
			var condition = '';
			if(p.type == "path"){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<label >条件</label>'
									+'<input class="span2" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}else if(p.origin == 'branch'){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<label >判断</label>'
									+'<input class="span2" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}else if(p.type == 'rect'){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<input class="key span1" type="text" value="'+i+'"/>'
									+'<span>:</span>'
									+'<input class="value" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}
			var html = '<div class="content" op="'+p.id+'">'
							+'<h4>属性</h4>'
							+'<div class="form">'
								+'<div>'
									+'<label for="name">显示</label>'
									+'<input class="span2" type="text" id="name" value="'+p.text.attr('text')+'"/>'
								+'</div>'
								+'<div>'
									+'<label for="description">描述</label>'
									+'<textarea class="span2" name="description" id="description" cols="20" rows="2">'+p.text.attr('description')+'</textarea>'
								+'</div>'
								+'<div class="condition">'
									+condition
								+'</div>'
								+'<div class="butt">'
									+'<input type="button" class="btn btn-success" id="confirm" value="确定"/>'
									+'<input type="button" class="btn" id="cancle" value="取消"/>'
								+'</div>'
								+'<div class="butt">'
									+'<input type="button" class="btn btn-danger span2" id="delete" value="删除此元素"/>'
								+'</div>'
							+'</div>'
						+'</div>';
			$('body').append(html);
			$('.content .add').unbind('click',null);
			$('.content .add').bind('click',function(){
				if(p.type == "path"){
					var html = '<div>'
									+'<label >条件</label>'
									+'<input class="span2" type="text" value=""/>'
								+'</div>';
					$(this).before(html)
				}else if(p.origin == 'branch'){
					var html = '<div>'
									+'<label >判断</label>'
									+'<input class="span2" type="text" value=""/>'
								+'</div>';
					$(this).before(html);
				}else if(p.type == 'rect'){
					var html = '<div>'+'<input class="key span1" type="text" value=""/>'
									+'<span>:</span>'+'<input class="value" type="text" value=""/>'+'</div>';
					$(this).before(html);
				}
			});
			$('.content .del').unbind('click',null);
			$('.content .del').bind('click',function(){
				$(this).prev().prev().remove();
			});
			$('.content #confirm').unbind('click',null);
			$('.content #confirm').bind('click', function(){
				var text = flow.canvas.can.getById($('.content').attr('op')).text;
				text.attr({'text':$('.content #name').val()});
				// console.log($('.content #description').val())
				// console.log(flow.canvas.can.getById($('.content').attr('op')).text.attr('description'));
				text.attrs.description = $('.content #description').val();
				// console.log(flow.canvas.can.getById($('.content').attr('op')).text.attr('description'));
				// $(p[0]).unbind('click',null);
				// if($.lineFlag){
				// 	that.lineUnbind();
				// 	that.lineBind();	
				// } 
				// that.focusBind(p);
				text.attrs.condition = {};
				if(p.type == "path" || p.origin == "branch"){
					$('.content .condition div').each(function(i,u){
						text.attrs.condition[i] = ($(u).find('input').val());
					})
				}else if(p.type == 'rect'){
					text.attrs.condition = {};
					$('.content .condition div').each(function(i,u){
						text.attrs.condition[$(u).find('.key').val()] = $(u).find('.value').val(); 
					})
				}
				
			});
			$('.content #cancle').unbind('click',null);
			$('.content #cancle').bind('click', function(){
				$('.content').remove();
				that.unfocus();
			});
			$('.content #delete').unbind('click',null);
			$('.content #delete').bind('click', function(){
				if(confirm('删除此项后将删除该项的所有相关事物\n\n是否确定删除？')){
					var p = flow.canvas.can.getById($('.content').attr('op'));
					if(p.type == 'path'){
						$.each(p.op.line,function(ei,eu){
	        				if(eu[1] == p.id){
	        					p.op.line.pop(eu);
	        				}
	        			});
						$.each(p.ed.line,function(ei,eu){
	        				if(eu[1] == p.id){
	        					p.ed.line.pop(eu);
	        				}
	        			})
					}else{
						//删除相关的连线几连线相关的图框的line属性里的该连线
						$.each(p.line, function(i,u){
							var l = flow.canvas.can.getById(u[1]);
				        	if(l){
				        		var num;
				        		if(u[0] == 'start'){
				        			$.each(l.ed.line,function(ei,eu){
				        				if(eu[0] == 'end' && eu[1] == l.id){
				        					num = ei;
				        				}
				        			});
				        			l.ed.line.pop(num);
						        }else if(u[0] == 'end'){
						        	$.each(l.op.line,function(ei,eu){
				        				if(eu[0] == 'start' && eu[1] == l.id){
				        					num = ei;
				        				}
				        			});
				        			l.op.line.pop(num);
					         	}
				        	}
				        	l.text.remove();
		        			l.remove();
				        })
					}
					//删除点
					$.each(flow.canvas.lp, function(i,u){
						u.remove();
					});
			        //删除文字
					p.text.remove();
					//删除本身
			        p.remove();
					$('.content').remove();
					//将连线开始标识符置0
					$.lineStart = 0;
				}

			})
		}
		,focus: function(el){
			this.unfocus();
			if(el.type != 'path' && el.origin && el.origin != 'bend')
				el.attr({ stroke: "#FF3300" , 'stroke-width': '2px'});
			this.content(el);
		}
		,unfocus: function(){
			$.each(this.getE(['circle','rect']),function(i,u){
				if(u.origin != 'bend'){
					$('.content').remove();
					u.attr({ stroke: "#03689a" , 'stroke-width': '1px'});
				}
			})
		}
		//点击画布，消除path上面的点，消除属性框
		,flowClick: function(){
			var that = this;
			$('svg').bind('click', function(e){
				// console.log(1)
				e.stopPropagation();
				that.unfocus();
				$.each(flow.canvas.lp, function(i,u){
					u.remove();
				});
				
				flow.canvas.lp.length = 0;
			})
			
		}
		,init: function(){
			this.bind();
			this.flowClick();
		}
	},
	canvas: {
		//线上面点的队列
		init: function(){
			$('.configuration').css({"top":($(window).height() - $('.configuration').height())/2,"left":($(window).width()-$('.configuration').width())/2});
		}
	},
	init: function(){
		this.canvas.init();
		this.main.init();
	}
};

flow.init();
/*获取canvas上的坐标点*/
function windowToConfiguration(x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
}