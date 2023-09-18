# Source code for Trigger.dev blog articles

Check out [our blog](https://trigger.dev/blog) for all our articles or [follow us](https://dev.to/triggerdotdev) to be notified when new blogs are release.

## Content Guidelines

All blog post content should following the guidelines:

- Don't use tabs for indenting code and use 2 spaces (not 4).
- Use TypeScript instead of JavaScript, unless the article is specifically about JavaScript
- Favor specifying a [Zod schema](https://zod.dev/) when using `eventTrigger` [Docs here](https://trigger.dev/docs/documentation/concepts/triggers/events)
- Use `io.runTask` or an integration whenever doing any communication with outside services or databases, especially when there's a possibility that runs will be resumed. See our [Resumability docs](https://trigger.dev/docs/documentation/concepts/resumability) for more.
- Use Trigger.dev integrations instead of native SDKs.
- When using `io.logger.info`, use the second parameter to include additional data with the log:

```ts
await io.logger.info("This is a log message with additional data", {
  foo: "bar",
});
```

- `io.sendEvent` must be awaited
