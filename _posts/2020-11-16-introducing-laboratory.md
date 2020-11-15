---
layout: post
title: Introducing Laboratory
categories: [Laboratory, Feature flags, OSS, Programming, Android]
---

I'm a huge supporter of [Trunk Based Development](https://trunkbaseddevelopment.com/) (TBD). It is simple, and it enforces good practices in multiple aspects – frequent integration with the mainline branch, focus on meaningful and working commits, thinking in small tasks, continuous deployment of a product, and many more.

One of the essential techniques that are required to leverage this branching model is feature flags. While they are crucial in having an undisruptive and continuous workflow, you might want to use them even if you are not on the TBD train.

While the material on feature flags and their usage is not scarce, I couldn't find a satisfactory Android implementation. Here is what I was looking for:

* Testability. It should be possible to change feature flag options in development builds easily at runtime and during the execution of automated tests.

* Non-binary options. While most of the feature flags have usually only two states – enabled and disabled – there should be no restriction on this. It is not uncommon that your product team might want to test more than two options. If feature flags are confined only to two choices, it can, at some point, become a problem.

* Safety. A high-level API that interacts with feature flags should enforce checking all possible options and make sure that you cannot by a mistake use options of another one. Think enums with named values vs. booleans or strings which do not convey much information.

* Modularisation and encapsulation. There should be no coupling between feature flags. API should handle them generically, and it should be easy to extract a feature flag with a feature code to a separate module without losing any flexibility of feature flags.

Lately, I've been working on a solution that addresses all of the enlisted challenges (and some more). The outcome is Laboratory. A small library for feature flags management.

Using the library is as simple as defining a feature flag and interacting with it via the `Laboratory` class.

```kotlin
enum class ShowAds : Feature<ShowAds> {
  Enabled,
  Disabled,
  ;

  override val defaultOption get() = Disabled
}

suspend fun main() {
  // A persistence mechanism. You can use a different one than in-memory.
  val featureStorage = FeatureStorage.inMemory()

  // A high-level API for interaction with feature flags.
  val laboratory = Laboratory.create(featureStorage)

  // Set ShowAds option to Enabled.
  val success = laboratory.setOption(ShowAds.Enabled)

  // Check what the current option of ShowAds is.
  val shouldShowAds = laboratory.experiment<ShowAds>()

  // Check if the current option of ShowAds is equal to Enabled.
  val areAdsEnabled = laboratory.experimentIs(ShowAds.Enabled)

  // Observe changes to the ShowAds feature flag.
  laboratory.observe<ShowAds>()
      .onEach { option -> println("ShowAds: $option") }
      .launchIn(GlobalScope)
}
```

A thing that I'm really pleased with is its testability. At runtime, you can open a debug menu that enables interaction with feature flags. You can change selected options or preview their remote configurations, such as Firebase or whichever external source you choose to use.

![](/images/inspector_screenshot.jpg)

In automated tests, all you need is an instance of `Laboratory`, which you can create with `Laboratory.inMemory()` function and use it as a substitute for `SharedPreferences` or any other mechanism you'd like to use in production.

Currently, the library is in version `0.9.1`, and I'd like to see it more in action before going `1.0.0`. Right now, some things might be missing or be clunky, as only a couple of projects use it. For example, the library focuses heavily on Kotlin. While it is possible to use it from Java, I did not design it for that purpose. However, if you feel like this would be useful for your Java project, let me know.

Secondly, because `Laboratory` supports Jetpack DataStore out-of-the-box, it won't go stable as long as `DataStore` does not reach `1.0.0`.

In any case, I invite you to visit the [project website](https://mehow.io/laboratory/) and the [repository](https://github.com/MiSikora/laboratory/). You'll find there more information about how to use the library along with the sample application. Any feedback or issues reported on GitHub appreciated!
