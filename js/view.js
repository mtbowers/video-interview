var View = {};

View.renderQuestions = function(interviewObject) {
    var template = $.trim($('#questionsTemplate').html()),
    frag = '';
	$.each(interviewObject.questions, function(index,question ) {
		frag +=
            template.replace(/{{index}}/ig, index+1 )
					.replace(/{{type}}/ig, question.type )
					.replace(/{{text}}/ig, question.text )
					.replace(/{{id}}/ig, index );
	});
	if(interviewObject.questions.length > 0)
		document.getElementById('questions').innerHTML = frag;
	else
		document.getElementById('questions').innerHTML = '<tr><td colspan="3" class="blueText">You dont have any questions yet. Click the <b>+Add Question</b> button to create your first question.</td></tr>';


}

View.renderInterviews = function(interviewObject){
	var template = $.trim( $('#interviewsTemplate').html() ),
	frag = '';
	$.each( interviewObject, function( index, interview ) {
		frag +=
			template.replace( /{{id}}/ig, interview.id )
					.replace( /{{name}}/ig, interview.name )
					.replace( /{{owner}}/ig, interview.owner )
					.replace( /{{timestamp}}/ig, interview.timestamp )
					.replace( /{{status}}/ig, interview.status ? "Open" : "Closed" )
					.replace( /{{applicants}}/ig, interview.applicants );

	});
	//console.log(frag);
	document.getElementById('interviews').innerHTML = frag;
}