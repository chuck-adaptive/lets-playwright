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
    test.describe('Waiting for an event to happen to assert something', () => {
        test('we can click the maximize icon and wait for the event to fire an event on it', async ({ mainWindow }) => {
            // In this test we do NOT await the window click. We await the result of the window click. Thus, we can
            // smart wait for events to fire on both the dom and the OpenFin objects
            mainWindow.click('#minimize-window');
            const val = await mainWindow.evaluate(eventName => {
                const currentWindow = window.fin.Window.getCurrentSync();
                return new Promise(callback => currentWindow.on(eventName, callback));
            }, 'minimized');
            expect(val).toBeTruthy();
            //TODO cleanup the test results
        })

    })
})
