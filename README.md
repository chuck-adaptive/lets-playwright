# Let's Playwright!

This example repository runs some tests with playwright against a running OpenFin app.

```
npm install
npm run hello-openfin       // launches hello-openfin
npm run test                // runs the tests
```

## Note on the tests

These exist to show how things work. In particular, the minimize test will hang if your window is already minimized.

Of course it will! The test waits for the OpenFin Window to emit a 'minimized' event. Restore and minimize and you will see it fire. That's the feature - waiting for OpenFin events. This allows you to test your app's integration with the OpenFin API.
