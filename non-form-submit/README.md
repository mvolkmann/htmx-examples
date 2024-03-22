# non-form-submit

This is an example project that uses Bun, ElysiaJS, and htmx.
It demonstrates:

- submitting input values that are not wrapped in a `form` element
  by using the `hx-include` attribute.
- using the `hx-vals` attribute to submit additional static values
- using the `hx-push-url` attribute
  to add the updated page to the browser history
  so going back clears the inputs and the message

To run this:

- Install Bun
- Enter `bun install`
- Enter `bun dev`
- Browse localhost:1919
- Enter a first and last name.
- Click the "Submit" button.
- Note that a hello message is displayed below the inputs
  AND the location bar URL is changed to end with "/greeting".
- Click the browser back button.
- Note that the inputs are cleared and the hello message is removed.
