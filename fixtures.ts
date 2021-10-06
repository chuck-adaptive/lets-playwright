import { chromium, Page } from 'playwright';
import { test as base } from '@playwright/test';
// ensures all window objects we interact with in our spec have fin tyepdefs
export * from './openfinGlobal';

// PORT WARNINGS!
// If you set your devtools_port, but another runtime is already up on that port,
// the port isn't handed off - your app will be assigned a new one.
// This is clear - but can be tough to catch if your app is using something like
// the notifications service. The service can launch first and squat on your port.
// Best bet is to avoid the default port (9090).

// can match the devtool_port in the app.json
// though if you use the runtime arguments flag, the RVM is not required - and will
// let you connect on a mac/linux OS. However - things like the Platform API may
// require the RVM. In the hello-openfin.app.json I do BOTH - just as an example.
// Don't do both unless you're autogenerating your app.json or want to handle code maintenance overhead
const RUNTIME_ADDRESS = 'http://localhost:9001';

// Define custom fixture interface
interface IPlaywrightFixtures {
    mainWindow: Page;
    cpuInfoWindow: Page;
    interAppWindow: Page;
}

export const test = base.extend<IPlaywrightFixtures>({
    // in this case, our browser is OpenFin. Rather than DL and run a binary,
    // we connect to a running OpenFin session here. Start/Stop of OpenFin is left
    // to the developer to implement.
    browser: async ({}, use) => {
        const runtimeConnection = await chromium.connectOverCDP(RUNTIME_ADDRESS);
        await use(runtimeConnection);
    },
    context: async ({ browser }, use) => {
        const contexts = await browser.contexts();
        if (contexts.length !== 1) {
            throw Error(
                `Unexepcted Context(s): Expected 1, Found ${contexts.length}`
            );
        }
        await use(contexts[0]);
    },
    page: async ({ context }, use) => {
        // just like above, I can define a "page"
        // for a single page app, or single window app this makes sense
        // I prefer to define separate fixtures for the various windows of the app
    },
    mainWindow: async ({ context }, use) => {
        const pages = await context.pages()
        const mainWindowPage = pages.find(page => page.url() === 'https://cdn.openfin.co/demos/hello/index.html');
        if (!mainWindowPage) throw Error('Main Window not found at url!');
        await use(mainWindowPage);
    },
    // TODO copypasta cleanup
    cpuInfoWindow: async ({ context }, use) => {
        const pages = await context.pages()
        const cpuWindowPage = pages.find(page => page.url() === 'https://cdn.openfin.co/demos/hello/views/cpu.html');
        if (!cpuWindowPage) throw Error('CPU Window not found at url!');
        await use(cpuWindowPage);
    },
    interAppWindow: async ({ context }, use) => {
        const pages = await context.pages()
        const interAppWindowPage = pages.find(page => page.url() === 'https://cdn.openfin.co/demos/hello/views/interappbus.html');
        if (!interAppWindowPage) throw Error('CPU Window not found at url!');
        await use(interAppWindowPage);
    }
})