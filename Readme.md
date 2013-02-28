# Naive Bayes Classifier

This is a quick test of my understanding of basic probability, by implementing a naive Bayes classifier.

**THIS CODE IS NOT PORTABLE OR MAINTAINABLE**

This is a simple naive bayes classifier as inpired by the Russell and Norvig book, Ch.13, third edition.

## Notes on implementation

In a Naive Bayes chain, P(cause|effect) = P(cause) * P(effect|cause)....P(effect|cause). 
Absolute zero has the nasty property of zeroing out the entire chain. Thus if any effect given some cause has not been observed in our training data, we can't classify it at all for an input. A prudent approach here is to assign a very small probability to anything we haven't observed (consider this the background noise of the unobserved parts of the world). This allow us to still classify sentences containing words we haven't seen for a given cause.

A different way to implement the multiplication is by using logarithms and addition. Multiplying many small probabilities together (imagine 0.1 * 0.1 * 0.1 * ...) tends toward zero, causing underflow. By using logarithms, we can avoid this.

Normalization of the final answer is necessary to give a true probability, but since the normalization constant is the same for all causes, we safely ignore it in this code, allowing us to compare the classes for a given sentence.