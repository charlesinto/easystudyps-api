const Joi = require("@hapi/joi");

const testCreationModel = Joi.object({
	id: Joi.string().required(),
    quizName: Joi.string().required(),
    numberOfQuestions: Joi.string(),
    isTimed: Joi.boolean().required(),
    numberOfMinutesToComplete: Joi.string().required(),
    subject: Joi.string().required(),
    schoolLevel: Joi.string().required(),
    questions: Joi.array().min(1).required(),
    totalValidMarks: Joi.number().required(),
	validUntil: Joi.date(),
	targetedClass: Joi.string().required()
})

module.exports = {
    testCreationModel
}

/*

{

	"quizName":"Take home",
	"numberOfQuestions":"",
	"isTimed":"true | false",
	"numberOfMinutesToComplete":"30",
	"subject":"English Language | Mathematics | etc",
	"schoolLevel":"Primary School | Junior Secondary School | Senoir Secondary School",
	"questions":[
		{
			"question":"What is comprehension",
			"questionMark":"",
			"options":[
				{
					"option":"A",
					"answer":"is Good"
				}	
			],
			"hasImage":true,
			"images":[
				"images-1",
				"images-2"
			],
			"correctionOption":"A"
		}
	],
	"totalValidMarks":"",
	"valideUntil":"2020-08-10"
}

*/