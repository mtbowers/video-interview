var currInt = 0, currQ = -1, ob;
$(function() {
        d = Interview.getAll();
        View.renderInterviews(d);
        
       var oTable =  $('#interList').dataTable( {
			"sPaginationType": "full_numbers",
			'aLengthMenu': [3,5,10,20],
			 "sDom":'t<"bottom"filp><"clear">',
                    "bAutoWidth": false,
		});
		
		$("#interviews").delegate("i.icon-pencil",'click', function(e) {
			var obj = $(this);
			var id = obj.parent().parent().children(".inVal").html();
			showInterview(id)
		});
		$("#interviews").delegate("i.icon-file",'click', function(e) {
			var obj = $(this);
			var id = obj.parent().parent().children(".inVal").html();
			var newInt = Interview.getByID(id);
			//newInt = Interview.getByID(id);
			nI = new Interview;
			nI.name = newInt.name
			nI.questions = newInt.questions
			console.log("new "+nI.id)
			//var iid = nI.id;
			//$.extend(nI,newInt);
			//nI.id = iid;
			nI.save();
			ob = nI;
			console.log("old "+nI.id)
			showInterview(nI.id)
		});

		$("#interviews").delegate("i.icon-trash",'click', function(e) {
			
			if (!confirm("Are you sure?")) 
        	return false;
			
			var obj = $(this);
			var id = obj.parent().parent().children(".inVal").html();
			console.log(id)
			Interview.getByID(id).destroy();
			e.stopImmediatePropagation();

			 
  			 oTable.fnDestroy();
  			 View.renderInterviews(Interview.getAll());
  			oTable = $('#interList').dataTable( {
								"sDom":'t<"bottom"filp><"clear">',
								"bAutoWidth": false,
								"sPaginationType": "full_numbers",
								'aLengthMenu': [3,5,10,20],
						});
		});
		
        $(".publish").click(function() {
			currInt.name = $('#interTitle').val();
			currInt.save();
			$(".page2").hide();
			$(".page1").show();
			
		    oTable.fnDestroy();
  			 View.renderInterviews(Interview.getAll());
  			 oTable =$('#interList').dataTable( {
								"sDom":'t<"bottom"filp><"clear">',
								"bAutoWidth": false,
								"sPaginationType": "full_numbers",
								'aLengthMenu': [3,5,10,20],
			});
			
			currInt = 0;currQ = -1;
		});
        $(".cancel").click(function() {
			$(".page2").hide();
			$(".page1").show();
			
		    oTable.fnDestroy();
  			 View.renderInterviews(Interview.getAll());
  			 oTable =$('#interList').dataTable( {
								"sDom":'t<"bottom"filp><"clear">',
								"bAutoWidth": false,
								"sPaginationType": "full_numbers",
								'aLengthMenu': [3,5,10,20],
			});
						
			currInt = 0;currQ = -1;
		});
		
        $(".newInter").click(function() {
			$('#interTitle').val('');
			document.getElementById('questions').innerHTML = '<tr><td colspan="3" class="blueText">You dont have any questions yet. Click the <b>+Add Question</b> button to create your first question.</td></tr>';
	
			showInterview(0)
			
			$('form :input').change(function() {
		  		saveTitle();
			});
		});
		
		$(".addQuestion").click(function() {
			var obj = $(this);
			if($("#sort").find(".editForm").length && obj.html() == '+ Add Question'){
				
				saveQuestion();
				    $('#sort .editForm').parent().parent().remove();
				    currQ = -1;
					currInt.save();
					View.renderQuestions(currInt);
					setIcons()
				 
			}
				
				console.log(obj.html())
				if(obj.html() == '+ Add Question'){
					obj.html('Save');
					
					$('.formClose, .minus').hide();
					//$("#sort tbody").after($(".qForm").children().children().clone());
					console.log();
					$(".qForm").children().children().clone().appendTo($("#sort tbody#questions"));
					
					$("#sort .editForm .icon-remove").click(function() {
						var obj = $(this);
						obj.parent().parent().parent().parent().parent().parent().parent().remove();
						currQ = -1;
						currInt.save();
						View.renderQuestions(currInt);
						setIcons()
					});
				}else{
					obj.html('+ Add Question');
					$('.formClose, .minus').show();
					saveQuestion();
					$("#sort .editForm").parent().parent().remove();
					View.renderQuestions(currInt);
					setIcons()
				}
			
			
		});
		
		$(".toolbar-link").click(function() {
			copyLink();
		});
		
});

function setIcons(){
		
		$("#sort").delegate("i.icon-pencil",'click', function(e) {
			var obj = $(this);
			var id = parseInt(obj.parent().parent().children(".inVal").html());
			$("#sort .editForm").parent().remove();

			obj.parent().parent().parent().parent().after($(".qForm").children().children().clone());
			$("#sort .editForm").hide().slideDown(500);
			currQ = id;
			setForm(id);
			$("#sort .editForm .icon-remove").click(function() {
				var obj = $(this);
				
				 $('#sort .editForm').slideUp(500, function() {
				    saveQuestion();
				    currInt.save();
				    
				    obj.parent().parent().parent().parent().parent().parent().remove();
				    currQ = -1;
					
					View.renderQuestions(currInt);
					setIcons()
				  });
				
				
			});
			$("#sort .minus").click(function() {
				var obj = $(this);
				$('#sort .editForm').slideUp(500, function() {
					saveQuestion();
					currInt.save();
					obj.parent().parent().parent().remove();
					currQ = -1;
					
					View.renderQuestions(currInt);
					setIcons()
				});
			});
		});
		$("#questions").delegate("i.icon-trash",'click', function(e) {
		
			var obj = $(this);
			var id = obj.parent().parent().children(".inVal").html();
			//currInt.questions[id] = false;
			console.log('deleting : '+ id)
			//currInt.deleteQuestionByID(id);
			currInt.questions.splice(id, 1);
			
			currInt.sortQuestions();
			
			View.renderQuestions(currInt);
			currInt.save()
			currQ = -1;
			e.stopImmediatePropagation();
		});
		
		$("#questions").delegate("i.icon-file",'click', function(e) {
			var obj = $(this);
			var id = obj.parent().parent().children(".inVal").html();
			var newQ = new Object();
			$.extend(newQ,currInt.questions[id])
			currInt.questions.push(newQ);
			currQ = currInt.questions.length - 1;
			//currInt.save();
			console.log(currQ);
			
			$("#sort .editForm").parent().remove();

			obj.parent().parent().parent().parent().parent().after($(".qForm").children().children().clone());
			$("#sort .editForm").hide().slideDown(500);
			setForm(currQ);
			$("#sort .editForm .icon-remove").click(function() {
				var obj = $(this);
				
				 $('#sort .editForm').slideUp(500, function() {
				    saveQuestion();
				    currInt.save();
				    
				    obj.parent().parent().parent().parent().parent().parent().remove();
				    currQ = -1;
					
					View.renderQuestions(currInt);
					setIcons()
				  });
				
				
			});
			$("#sort .minus").click(function() {
				var obj = $(this);
				$('#sort .editForm').slideUp(500, function() {
					saveQuestion();
					currInt.save();
					obj.parent().parent().parent().remove();
					currQ = -1;
					
					View.renderQuestions(currInt);
					setIcons()
				});
			});
			e.stopImmediatePropagation();
		});
		
		
}

function showInterview(id){
	$(".page1").hide();
	$(".page2").show();
	if(id){
		currInt = Interview.getByID(id);
		$('#interTitle').val(currInt.name);
		View.renderQuestions(currInt);
		setIcons();
	}else{
		currInt = new Interview;
		//View.renderQuestions(currInt);
	
	}
	
	
}

function saveQuestion(){
	
	if(currQ == -1){
		var q = {
				type: $('#question-type').val(),
				position:currInt.questions.length,
				responseTime: $('#responseTime').val(),
				text: $('#quesionText').val(),
				attempts:$('input[name=attempts]:checked', '#saveEdit').val() == "Yes"? 0:$('#attempCount').val(),
				startAuto: $('input[name=startAuto]:checked', '#saveEdit').val() == "Yes"? 0:$('#attemptAfter').val(),
			}
		console.log(q)
		currInt.questions.push(q);
	}else{
		
		currInt.questions[currQ].type = $('#question-type').val();
		currInt.questions[currQ].responseTime = $('#responseTime').val();
		currInt.questions[currQ].text = $('#quesionText').val();
		currInt.questions[currQ].attempts = $('input[name=attempts]:checked', '#saveEdit').val() == "Yes"? 0:$('#attempCount').val();
		currInt.questions[currQ].startAuto = $('input[name=startAuto]:checked', '#saveEdit').val() == "Yes"? 0:$('#attemptAfter').val();
		
	}
	currInt.save();
		
}

function saveTitle(){
	
	var interview = currInt;
	if(!currInt)
		interview = new Interview;
	
	interview.name = $('#interTitle').val();
	interview.save();
	currInt = interview;
}

function setForm(idm){
	var q = currInt.questions[idm];
	$('#question-type').val(q.type);
	$('#responseTime').val(q.responseTime);
	$('#quesionText').val(q.text);
	
	$('#radios-0').attr('checked', true);
	$('#radios-1').attr('checked', q.attempts>0?true:false);
	
	$('#attempCount').val(q.attempts);
	$('#radios-2').attr('checked', true);
	$('#radios-3').attr('checked', q.startAuto>0?true:false);
	$('#attemptAfter').val(q.startAuto);
	
	$('form :input').change(function() {
		  	saveQuestion();
		  	//currQ = 0;
		  	console.log("succ")
	});
}

function copyLink(){
	$(".linkC").fadeIn(300);
	setTimeout(hideLink,1000);
}
function hideLink(){
	$(".linkC").fadeOut(300)
}
