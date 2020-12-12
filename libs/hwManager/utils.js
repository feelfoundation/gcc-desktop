/* istanbul ignore file */
import { to } from 'await-to-js';
import { REQUEST, RESPONSE } from './constants';

/**
 * Create a listener to a function that send a response back to the sender
 * @param {any} subscriber - Subscriber that will listen to the event
 * @param {Object} data - Object containing  the command and fn
 * @param {string} data.command - Event name to be listened to
 * @param {function} data.fn - Function to be executed when event is triggered
 */
export const createCommand = (subscriber, { command, fn }) => {
  subscriber.on(`${command}.${REQUEST}`, async (event, ...args) => {
    const [error, data] = await to(fn(...args));
    event.sender.send(`${command}.${RESPONSE}`, {
      success: !error,
      data,
      error: error && error.toString(),
    });
  });
};

/**
 * Publish a event throught the sender in this.pubSub
 * @param {any} sender - Sender that will trigger the event
 * @param {object} data - Object with event name and payload to be sent
 * @param {string} data.event - Event to be published throught the sender
 * @param {any} data.payload - Payload to be sent to with the event
 */
export const publish = (sender, { event, payload }) => {
  if (!sender) return false;
  sender.send({ event, value: payload });
  return true;
};

/**
 * Subscribe to a event throught the receiver
 * @param {any} receiver - Subscriber that should be subscribed to the the event
 * @param {object} data - Object containing the event and the action
 * @param {string} data.event - Event name to be subscribed to thoguht the receiver
 * @param {function} data.action - Function that should be executed when event is triggered
 */
export const subscribe = (receiver, { event, action }) => (!receiver ? receiver
  : createCommand(receiver, {
    command: event,
    fn: action,
  }));


export default {
  createCommand,
  publish,
  subscribe,
};
