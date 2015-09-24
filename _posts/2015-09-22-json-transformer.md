---
layout: post_page
title: JsonTransformer
---

###Functional JSON Transformation for Java 8

Java has a ton of libraries for JSON. However, the focus of almost all of these libraries is serialization and deserialization. Their goal is to take your JSON and turn it into objects and take your objects and turn it into JSON. Many of these libraries (ex. gson), provide ways to deal with JSON as a generic structure, but actual transformations of these structures involves painful type casting and constant conditionals. [JsonTransformers](http://jimmyhmiller.github.io/json-transformer/) goal is to eliminate all of that boilerplate.
{% highlight java %}
JsonValue transformed = new JsonTransformer(json)
        .mapRescursiveIf((String s) -> s.equals("change me"), (String s) -> "changed")
        .mapIf((String key, Integer i) -> key.equals("add2"), (String key, Integer i) -> i + 2)
        .mapRecursive((JsonArray a) -> new JsonTransformer(a).map((Integer i) -> i + 2).toJson())
        .pprint()
        .toJson();

{% endhighlight %}


Transformations like the one above are incredibly hard using traditional methods provided by Java JSON libraries. However, there is also no point in throwing away all the work by others. That's why rather than creating yet another way of parsing JSON, JsonTransformer uses the wonderful javax.json library. JsonTransformer does one job and tries to do it well.

###The Journey

JsonTransformer was born out of pure need and frustration. The JSON I'm dealing with doesn't have a flat structure that can easily be turned into objects. It is a series of nested rest calls following href's wherever they may lead and plucking out the important pieces and parts.

I started by implementing a function to deal with recursing over a JSON structure in gson. Unfortunately, I ran into some really ugly parts of the library. When writing my recursion, I was getting a stack overflow. I spent thirty minutes trying to figure out how I had messed up my base case. As it turns out, it is actually a problem with gson itself.

I eventually did get it all to work, but with a hefty dose of type conversions. At that point, I decided to tackle the problem in a different language to get some perspective. Of course, this would be trivial in JavaScript and probably just as trivial in any dynamically typed language (for instance Clojure), so I wanted to do my experiments in a strongly typed language. Scala was on my list of languages to play with, so it seemed a perfect candidate.

###The Real Answer

About an hour after I began my first Scala code, I had solved the problem. I had a working program that did exactly what my painfully coded java program did. I was impressed. What made it so easy? Discriminated union types and pattern matching. These were already familiar to me having used Haskell. But seeing them in a more mainstream language was a breath of fresh air.

Due to its functional nature and pattern matching capabilities, every Scala JSON library I looked at already had map in place! This made it trivial to write a recursive map, the powerhouse of the code I was writing. Not only was my Scala code shorter, it was also more powerful and yet easier to read. So I had found the answer, union types and pattern matching, two things Java lacks.

At this point, it would be great if I could say, “So I changed languages!” Unfortunately, my company has vetoed Scala. So how can I accomplish this in Java? Well, I started doing some readings and while there are some ways do "pattern matching" in java, they don't get anywhere as quickly as I need, nor are they very readable. So I went back to the proverbial drawing board.

###The Compromise

One of the ways I like to write software is to imagine my ideal API and work backward. Often times, this requires compromise on the way down, but it usually ends up with a nice, usable product. JsonTransformer was designed exactly in this way. Ideally (in java), this is what I would like to write.

{% highlight java %}
json.mapRecursive(s -> "stuff");
{% endhighlight %}

Of course, there are some problems here. 1) I would have to invent my own new JSON object. I can't add methods to classes that I don't own. 2) What is the type of s? What parts of the JSON would I want map over? Those two problems are easy to fix.
{% highlight java %}
new JsonTransformer(json).mapRecursive((String s) -> "stuff");
{% endhighlight %}

And thus, JsonTranformer was born. In fact, adding that type was key. While Java can do some local type inference, requiring the user to specify the type here can actually have some benefits. From the type of that function, I can now know what parts of the JSON structure to apply that function to. Therefore, this function will apply to all strings. In fact, we can just overload mapRecursive with all the different types we want to map over, and then we don't need to do pattern matching.  Our functions will tell us our types.

Well, we can almost do that. Imagine we want to implement mapRecursive for JsonObjects and Strings. We would write the following:

{% highlight java %}
public JsonTransformer mapRecursive(Function<String, Object> f) {}
public JsonTransformer mapRecursive(Function<JsonObject, Object> f) {}
{% endhighlight %}

Unfortunately, this won't compile in Java. These methods have the same "type erasure". In Java, generics are erased at run time, meaning as far as Java is concerned, these methods both just take Function. Ultimately, this means that there is no way to distinguish them.

###The Hacks

Alas, my grand vision would not work… at least not without hacks. In order to write the methods above and not run into the same erasure problem, I had to write this:

{% highlight java %}
public interface FunctionFromStringToObject extends Function<String, Object> {}
public JsonTransformer mapRecursive(FunctionFromStringToObject f) {}

public interface FunctionFromJsonObjectToObject extends Function<JsonObject, Object> {}
public JsonTransformer mapRecursive(FunctionFromJsonObjectToObject f) {}
{% endhighlight %}

What I've done is hidden the fact that these are referring to the exact same erasure. By creating a new interface, it gives the types different names and we can therefore overload. This feels wrong, but it is an unfortunate reality when using generics in Java.

###Giving up Full Type Safety

One last compromise I made was the decision to give up full type safety. You may notice that the functions above both return Object. This is rather unfortunate. It would be wonderful if we could keep full type safety here. Technically we can, but at the loss of expressivity.

Instead of Object, the return type ought to be JsonValue. Ultimately, that is what the type will be turned into. Unfortunately, there aren't always straightforward ways to turn values into JsonValue objects. So every time you used map, you would need to figure out some way to turn your type into a JsonValue. Instead, I do that for you. Of course, you can still do it yourself (Of course, JsonValue is one of the things I check for), but you are saved the hassle.

There are two ways I can think of to recover full type safety. First, requiring an instance of an interface named something like "ToJsonValue". I could provide ways to create an instance of this interface for common types and require the user to use these when they are mapping. Unfortunately, this is rather verbose and ugly.

The other way is technically not completely type safe, but in it, not completely type safe is the same way that Java is not completely type safe. One way that this problem could be solved is by undiscriminated union types. Of course these aren't supported in Java, but they would solve this problem neatly. Imagine if instead of Object, you could just say something like this:

{% highlight java %}
public JsonTransformer mapRecursive(Function<String, String | JsonValue | Integer | ToJsonValue> f) {}
{% endhighlight %}

Of course now to remain type safe, each of these cases needs to be checked. However, we now have a much more expressive way to say what we'd like. If Java did support this, I think this would be the way to go.

###Experience Report

This my first public java library. I think it turned out fairly well. The experience wasn't without its frustrations, but thanks to Java 8 Lambdas, I was able to implement an api that isn't half bad. There are more features that need to be added of course. Better testing (I might write about this a bit later) and better code organization are needed. However, this library represents the lack of expressivity of Java. While you can certainly get things done in Java, it takes a long time to express what you want.