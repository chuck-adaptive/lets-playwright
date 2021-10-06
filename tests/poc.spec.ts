import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Hello OpenFin', () => {
    test('It has three windows on launch', async ({ context }) => {
        const pages = await context.pages();
        expect(pages.length).toEqual(3);
    })
    test.describe('POC stuff in an example test', () => {
        test('we can get the OpenFin API in here with typedefs', async ({ mainWindow }) => {
            const runtimeVersion = await mainWindow.evaluate(async arg => {
                console.log(`Passing in arguments to be executed in the context of your window? ${arg}`);
                console.log('But you will see me in the window console! Specifically - mainWindow');

                // tab complete ftw - check the types!
                const runtimeInfo = await window.fin.System.getRuntimeInfo();
                return runtimeInfo.version;
            }, 'You are darn right you are!');

            // yet another value that would need to sync with your app.json. Not the point - this test is just
            // here to show you how to retrieve values from the context of your application
            expect(runtimeVersion).toEqual('22.94.65.4'); 
        })
    })
})
