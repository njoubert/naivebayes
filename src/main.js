
var nb = require('./nb.js');


console.log('Boolean Naive Bayes Classifier');


//Goal:
// P(cause | observed) = a * P(cause)* (for all observed P(observed | cause))

// Thus, observe a vector of boolean variables: is it present or not?
// Requires: 
//    - Overall probability of cause.
//    - Probability of each variable's presence given the cause


//Sketch:
// 1. Take in for each cause: 
//   examples of all the boolean variables (on or off)
//
// 2. Calculate that, given a cause, what is the probability of observed
//
// 3. Calculate the overall probability of each cause
//
// 4. Given a observed set, calculate a probability of each cause


var inputs = [
	["spam", "DO YOU WANT TO BUY VIAGRA FOR YOUR PENIS?"],
	["spam", "Hi, my name is nastia and i dream of american boy to marry and make long love times to. see my profile"],
	["spam", "Limited Time Promotion,  Limited Quantities 3.5 inches in 3 weeks? Thicker. Longer. Harder. Tell us where to send your FREE TRIAL: Only 250 samples given our per day PLEASE NOTE: This message may accidentally appear in your junkmail. Please hit the Not Spam button above, move this message to your inbox, or copy and paste the above link into your browser"],
	["ham","Niels. This is Eric. We are riding motorcycles tomorrow. Be there."],
	["ham","I'm also not super excited for Vegas. I don't have my license until June so I cannot fly you :-(. I can ask around and we could rent a plane with a pilot though. My instructor is awesome and not that pricey. A plane for 6 ppl however will cost us ~$400 / engine hour. Anything for Marcello, but it might not fit into grad student budget and the money could be spend better IMHO. "],
	["ham","I'm waiting to hear from 1 girl that might join but if she doesn't show then you have the spot. Ask me again on Saturday?"],
	["ads","Free Standard shipping and $10 shipping apply to orders shipped to the US. Free Economy shipping and $10 shipping apply to orders shipped to Canada, Australia & New Zealand. Free returns and exchanges are only available for orders shipped within the US (including AK & HI)."],
	["ads","Spring is rapidly approaching, and that means seed season! What would you like to plant this year? How will you best maintain your plants? We are excited to host an event with Kristyn Leach of Namu Farm, who will discuss planting methods and tips for how to keep your garden sprouting, blooming and thriving. WHAT: A conversation with Kristyn Leach of Namu Farm. WHEN: Saturday 2/23, 2pm WHERE: Umami Mart 815 Broadway Oakland, Pop-Up Hood BART: 12th Street Google Map"],
	["ads","Offers featured in this email are only intended for njoubert@gmail.com. Forwarded recipients are not eligible to get the offers via this email. Thanks to our Cardmembers, J.D. Power and Associates has ranked us Highest in Customer Satisfaction with Credit Card Companies, Six Years in a Row. Learn more about this award: americanexpress.com/jdpower American Express received the highest numerical score among credit card issuers in the proprietary J.D. Power and Associates 2007-2012 Credit Card Satisfaction StudiesSM. 2012 study based on responses from 13,726 consumers measuring 11 card issuers, and measures opinions of consumers about the issuer of their primary credit card. Proprietary study results are based on experiences and perceptions of consumers surveyed in June 2012. Your experiences may vary. Visit jdpower.com."],
].map(function(arr) {
	arr[1] = arr[1].split(" ");
	return arr;
});


const COMMON_WORDS = ("the of an a to in is you that it he was for on are as with his they I "
                + "at be this have from or one had by word but not what all were we when your can said "
                + "there use an each which she do how their if will up other about out many then them these so "
                + "some her would make like him into time has look two more write go see number no way could people "
                + "my than first ZZwater been call who ZZoil its now find long down day did get come made may part "
                + "this and").split(" ");

//Lets build up all the probability tables:

function fix_format(word) {
	return word.toLowerCase().replace(/[^0-9a-z-]/g,"");
}


//First, what is the probability of each cause:

var causes = {};
for (var i = 0; i < inputs.length; i++) {
	var cause = inputs[i][0];
	if (causes[cause]) {
		causes[cause] += 1
	} else {
		causes[cause] = 1;
	}
}
for (var cause in causes) {
	causes[cause] = causes[cause]/inputs.length;
}


// Now we build up the probability of each 


var effectsconditioned = {};
for (var i = 0; i < inputs.length; i++) {
	
	var input = inputs[i];
	var cause = input[0];

	for (var j = 0; j < input[1].length; j++) {
		var word = fix_format(input[1][j]);
		
		var skip = false;
		for (var s = 0; s < COMMON_WORDS.length; s++) {
			if (word == COMMON_WORDS[s]) {
				skip = true;
			}
		}

		if (!skip) {

			if (!effectsconditioned[word]) {
				var newlist = {};
				for (var c in causes) {
					newlist[c] = 0;
				}
				effectsconditioned[word] = newlist;
			}
			effectsconditioned[word][cause] += 1;

		}

	}

}

for (var word in effectsconditioned) {
	var causesw = effectsconditioned[word];
	var total = 0;
	for (var i in causesw) {
		total += causesw[i];
	}
	for (var i in causesw) {
		causesw[i] = causesw[i]/total;
	}
}



//OK, so we can try to make a query now:
//Lets just take the text of one of the training sets and query that.

function queryMe(query) {
	console.log("Querying: " + query);
	query = query.split(" ");
	for (var cause in causes) {

		var pc = causes[cause];
		for (var i in query) {
			var word = fix_format(query[i]);

			var skip = false;
			for (var s = 0; s < COMMON_WORDS.length; s++) {
				if (word == COMMON_WORDS[s]) {
					skip = true;
				}
			}
			if (!skip) {
				if (effectsconditioned[word]) {
					console.log("PC * " + effectsconditioned[word][cause] + " " + word)
					pc *= effectsconditioned[word][cause];

				}

			}
		}
		console.log("Cause " + cause + " = " + pc);


	}

}

var testQuery = "Hey Niels. This is Pags. Can we ride motorcycles tomorrow?";
queryMe(testQuery);

var tQ2 = "Do you wanna buy viagra? bigger! stronger! it makes  go fast! big! stronger!";
queryMe(tQ2);

