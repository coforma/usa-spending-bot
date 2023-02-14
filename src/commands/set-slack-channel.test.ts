import JestReceiver from '@slack-wrench/jest-bolt-receiver';
import {
  MockedWebClient,
  MockWebClient,
} from '@slack-wrench/jest-mock-web-client';
import { SlackApp } from '../SlackApp.js';

describe('My Awesome App', () => {
  let receiver: typeof JestReceiver;
  let app: typeof SlackApp;
  let client: MockWebClient;

  beforeEach(() => {
    receiver = new JestReceiver(); // doesn't have a constructor
    app = new SlackApp({ receiver }); // doesn't construct with a receiver
    client = MockedWebClient.mock.instances[0];
  });

  it('Can handle a slash command', async () => {
    const message = '@slack-wrench makes testing easy!';
    await receiver.send(slashCommand('/echo', { text: message })); // slashCommand comes from '@slack-wrench/fixtures' which requires bolt to be below v3

    // Test what should have happened.
    expect(client.chat.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        text: message,
      }),
    );
  });
});