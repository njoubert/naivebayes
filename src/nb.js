
const ZERO_PROBABILITY = 1e-5;

const COMMON_WORDS = ("the of an a to in is you that it he was for on are as with his they i "
                + "at be this have from or one had by word but not what all were we when your can said "
                + "there use an each which she do how their if will up other about out many then them these so "
                + "some her would make like him into time has look two more write go see number no way could people "
                + "my than first water been call who oil its now find long down day did get come made may part "
                + "this and").split(" ");




module.exports = function construct() { return new NBClassifier(); }

module.exports.filter = {};
module.exports.filter.ArrayFilterGenerator = function buildFilter(array) {

	return function filter(element) {
		for (var i = 0; i < array.length; i++) {
			if (element == array[i]) {
				return true;
			}
		}
		return false;
	}

}
module.exports.filter.CommonWordsFilter = (function() { return module.exports.filter.ArrayFilterGenerator(COMMON_WORDS); })();


function fix_format(word) {
	return word.toLowerCase().replace(/[^0-9a-z-]/g,"");
}

function NBClassifier() {
	
	//Stores all the known causes as a list. P(cause) = this.causes[cause]/this.causes.length
	this.causes = {__length:0};
	//Stores for each effect the list of causes - P(effect | cause)
	this.effectsconditioned = {};
	//Filter
	this.filter = module.exports.filter.CommonWordsFilter;


}

NBClassifier.prototype.teach = function(cause, effects) {

	//We add an occurrence of the given cause.
	if (this.causes[cause]) {
		this.causes[cause] += 1;
	} else {
		this.causes[cause] = 1;
	}
	this.causes.__length += 1;

	//Now we add all the word occurrences
	for (var j = 0; j < effects.length; j++) {
		var word = fix_format(effects[j]);

		if (!this.filter(word)) {

			if (!this.effectsconditioned[word]) {
				this.effectsconditioned[word] = {__length:0};
			}
			if (!this.effectsconditioned[word][cause]) {
				this.effectsconditioned[word][cause] = 0;
			}
			this.effectsconditioned[word][cause] += 1;
			this.effectsconditioned[word].__length += 1;

		}

	}

}

//Accessor for P(cause)
NBClassifier.prototype.P_cause = function(cause) {

	if (this.causes[cause]) {
		return this.causes[cause] / this.causes.__length;
	} else {
		return ZERO_PROBABILITY;
	}

}

//Accessor for P(effect | cause)
NBClassifier.prototype.P_effectGivenCause = function(effect,cause) {

	if (this.effectsconditioned[effect] && this.effectsconditioned[effect][cause]) {
		return this.effectsconditioned[effect][cause] / this.effectsconditioned[effect].__length;
	} else {
		return ZERO_PROBABILITY;
	}

}

//Query the classifier.
// Words are boolean variables, thus presence signals TRUE and absence signals FALSE in the list.
// Takes an array of values.
NBClassifier.prototype.query = function(effects) {

	var probs = {};

	for (cause in this.causes) {
		if (cause == "__length") continue;

		var Pc = this.P_cause(cause);

		for (var i in effects) {

			var effect = fix_format(effects[i]);
			if (!this.filter(effect)) {
				Pc *= this.P_effectGivenCause(effect,cause);
			}

		}
		probs[cause] = Pc;

	}
	return probs;


}
