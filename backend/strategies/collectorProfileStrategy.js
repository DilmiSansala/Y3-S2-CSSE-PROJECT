// strategies/CollectorProfileStrategy.js
class ProfileStrategy {
  apply(collector) {
    throw new Error("Method 'apply()' must be implemented.");
  }
}

class ExperiencedCollectorStrategy extends ProfileStrategy {
  apply(collector) {
    return `Experienced collector: ${collector.name}, based in ${collector.city}`;
  }
}

class NewCollectorStrategy extends ProfileStrategy {
  apply(collector) {
    return `New collector: ${collector.name}, based in ${collector.city}`;
  }
}





// Strategy Pattern (CollectorProfileStrategy.js)
// How it Works: The Strategy Pattern allows you to define different behaviors or strategies and swap them out at runtime. In your project, you use this pattern to determine how to handle different types of collectors based on their experience.
// The controller uses different strategies (ExperiencedCollectorStrategy or NewCollectorStrategy) to display different profile information depending on whether the collector is experienced or new.
// The specific logic for handling experienced and new collectors is encapsulated in these strategy classes, which are applied dynamically at runtime based on the collector's data.
// Why It's Important:
// Flexibility: You can easily change or extend the logic for experienced and new collectors without changing the core controller logic. If you add more types of collectors in the future, you can simply add new strategies without affecting existing code.
// Cleaner Code: Instead of using if-else conditions or complex logic in the controller, you encapsulate this logic in separate strategy classes, making the code more readable and easier to maintain.
// Scalability: As your system grows and more types of collectors or roles are introduced, you can easily scale the strategy pattern to accommodate new behaviors.