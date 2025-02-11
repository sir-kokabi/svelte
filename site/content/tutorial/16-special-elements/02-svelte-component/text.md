---
title: <svelte:component>
---

A component can change its category altogether with `<svelte:component>`. Instead of a sequence of `if` blocks...

```html
{#if selected.color === 'red'}
	<RedThing/>
{:else if selected.color === 'green'}
	<GreenThing/>
{/if}
```

...we can have a single dynamic component:

```html
<svelte:component this={selected.component}/>
```

The `this` value can be any component constructor, or a falsy value — if it's falsy, no component is rendered.
