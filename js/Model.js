var ID = localStorage.getItem("ID") ? localStorage.getItem("ID") : 0;
var Interview = function(config){
	if(!config){
		config = {};
	}
	ID ++;
	this.id = ID;
	this.timestamp = (new Date).toUTCString();
	this.owner = config.owner ? config.owner : "Admin";
	this.name= config.name ? config.name : "generic";
	this.status = config.status ? config.status : 0;
	this.applicants = config.applicants? config.applicants : 0;
	this.questions = config.questions? config.question: [
/*
		{
			type: "video",
			position:0,
			responseTime: 100,
			text: "This is the video question",
			attempts:2,
			startAuto: 0
		},
		{
			type: "audio",
			position:1,
			responseTime: 100,
			text: "This is the audio question",
			attempts:2,
			startAuto: 0
		}*/

	]

}

Interview.getAll = function(){
	var i = 1;
	var results = [];
	for(; i <= ID ; i++){
		if(localStorage.getItem(i)){
			results.push(JSON.parse(localStorage.getItem(i)));
		}	
	}
	return results;
};



Interview.getByID = function(id){
	if(localStorage.getItem(id)){
		var obj = JSON.parse(localStorage.getItem(id));
		obj.save = function(){
			localStorage.setItem(id, JSON.stringify(obj));
		};
		obj.destroy = function(){
			localStorage.removeItem(id);
		}
		obj.deleteQuestionByID = function(id){
		       this.questions.splice(id, 1);
		};
		
		obj.sortQuestions = function(){
		       this.questions.sort(function(a,b) { return parseFloat(a.position) - parseFloat(b.position) } );
		};
		return obj;
	} else {
		throw new Error("No object by this ID");
	}
	 
};

Interview.prototype.save = function(){
	this.timestamp = (new Date).toUTCString();
	if(localStorage.getItem(this.id)){
		localStorage.setItem(this.id, JSON.stringify(this));
		return this.id;
	}else{
		localStorage.setItem(this.id, JSON.stringify(this));
		localStorage.setItem("ID", ID);
		return this.id;
	}
	
};

Interview.prototype.destroy = function(){
	console.log("Deleted interview by id" + this.id );
	localStorage.removeItem(this.id);	
};


Interview.prototype.deleteQuestionByID = function(id){
       this.questions.splice(id, 1);
       
       console.log('deleted : '+ id)
};

Interview.prototype.sortQuestions = function(){
       this.questions.sort(function(a,b) { return parseFloat(a.position) - parseFloat(b.position) } );
};

// var Interviews = {
// 	name: "Designer",
// 	status: 0,
// 	applicants: 2,
// 	questions: [
// 		{
// 			type: "video",
// 			position:0,
// 			responseTime: 100,
// 			text: "This is the video question",
// 			attempts:2,
// 			startAuto: 0
// 		},
// 		{
// 			type: "audio",
// 			position:1,
// 			responseTime: 100,
// 			text: "This is the audio question",
// 			attempts:2,
// 			startAuto: 0
// 		}
// 	]
// };

